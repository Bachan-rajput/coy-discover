const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Existing JSON files (for one-time migration)
const profilesPath = path.join(__dirname, "../data/profile.json");
const swipesPath = path.join(__dirname, "../data/swipes.json");

// Format database profile for frontend
const formatProfile = (profile) => ({
  ...profile,
  interests: JSON.parse(profile.interests || "[]"),
  likedYou: Boolean(profile.likedYou),
});

// STEP 1: Import existing profiles into SQLite
const profileCount = db
  .prepare("SELECT COUNT(*) AS count FROM profiles")
  .get().count;

if (profileCount === 0) {
  if (!fs.existsSync(profilesPath)) {
    throw new Error("profile.json not found in server/data/");
  }

  const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf-8"));

  const insertProfile = db.prepare(`
    INSERT OR IGNORE INTO profiles
    (id, name, age, photo, bio, city, college, interests, likedYou)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const importProfiles = db.transaction((items) => {
    for (const profile of items) {
      insertProfile.run(
        profile.id,
        profile.name,
        profile.age,
        profile.photo,
        profile.bio,
        profile.city,
        profile.college,
        JSON.stringify(profile.interests || []),
        profile.likedYou ? 1 : 0,
      );
    }
  });

  importProfiles(profiles);
  console.log(`${profiles.length} profiles imported into SQLite.`);
}

// STEP 2: Import existing swipes into SQLite
if (fs.existsSync(swipesPath)) {
  const oldSwipes = JSON.parse(fs.readFileSync(swipesPath, "utf-8"));

  const insertSwipe = db.prepare(`
    INSERT OR IGNORE INTO swipes (profileId, action)
    VALUES (?, ?)
  `);

  const importSwipes = db.transaction((items) => {
    for (const swipe of items) {
      if (
        ["like", "pass"].includes(swipe.action) &&
        db.prepare("SELECT id FROM profiles WHERE id = ?").get(swipe.profileId)
      ) {
        insertSwipe.run(swipe.profileId, swipe.action);
      }
    }
  });

  importSwipes(oldSwipes);
  console.log("Existing swipes migration checked.");
}

// HOME ROUTE
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Coy Discover SQLite API is running!",
  });
});

// GET /feed
app.get("/feed", (req, res) => {
  try {
    const feed = db
      .prepare(
        `
      SELECT p.*
      FROM profiles p
      LEFT JOIN swipes s ON p.id = s.profileId
      WHERE s.id IS NULL
      ORDER BY p.id ASC
    `,
      )
      .all();

    res.json(feed.map(formatProfile));
  } catch (error) {
    res.status(500).json({
      message: "Unable to load profiles.",
    });
  }
});

// POST /swipe
app.post("/swipe", (req, res) => {
  try {
    const { profileId, action } = req.body;

    if (!Number.isInteger(Number(profileId))) {
      return res.status(400).json({
        message: "Invalid profile ID.",
      });
    }

    if (!["like", "pass"].includes(action)) {
      return res.status(400).json({
        message: "Invalid action.",
      });
    }

    const id = Number(profileId);

    const profile = db.prepare("SELECT * FROM profiles WHERE id = ?").get(id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found.",
      });
    }

    const existingSwipe = db
      .prepare("SELECT id FROM swipes WHERE profileId = ?")
      .get(id);

    if (existingSwipe) {
      return res.status(409).json({
        message: "Already swiped.",
      });
    }

    db.prepare(
      `
      INSERT INTO swipes (profileId, action)
      VALUES (?, ?)
    `,
    ).run(id, action);

    const isMatch = action === "like" && Boolean(profile.likedYou);

    res.json({
      success: true,
      message: isMatch ? "It's a match!" : "Swipe recorded.",
      match: isMatch,
      profile: formatProfile(profile),
    });
  } catch (error) {
    console.error("Swipe error:", error);

    res.status(500).json({
      message: "Something went wrong while saving swipe.",
    });
  }
});

// GET /matches
app.get("/matches", (req, res) => {
  try {
    const matches = db
      .prepare(
        `
      SELECT p.*
      FROM profiles p
      INNER JOIN swipes s ON p.id = s.profileId
      WHERE s.action = 'like'
      AND p.likedYou = 1
      ORDER BY s.createdAt DESC
    `,
      )
      .all();

    res.json(matches.map(formatProfile));
  } catch (error) {
    res.status(500).json({
      message: "Unable to load matches.",
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Coy Discover API running on http://localhost:${PORT}`);
});
