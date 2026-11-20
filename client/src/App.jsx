import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  X,
  Users,
  Sparkles,
  MapPin,
  GraduationCap,
  RotateCcw,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [activeTab, setActiveTab] = useState("discover");
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [error, setError] = useState("");

  // Load profiles from backend
  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/feed`);

      if (!response.ok) {
        throw new Error("Unable to load profiles.");
      }

      const data = await response.json();
      setProfiles(data);
    } catch (err) {
      setError(err.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load matches from backend
  const loadMatches = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/matches`);

      if (!response.ok) {
        throw new Error("Unable to load matches.");
      }

      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error("Matches error:", err);
    }
  }, []);

  // Initial API calls
  useEffect(() => {
    loadFeed();
    loadMatches();
  }, [loadFeed, loadMatches]);

  const currentProfile = profiles[0];

  // Handle Like and Pass
  const handleSwipe = async (direction) => {
    if (!currentProfile || isSwiping) return;

    try {
      setIsSwiping(true);
      setError("");

      const action = direction === "right" ? "like" : "pass";

      const response = await fetch(`${API_URL}/swipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: currentProfile.id,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Swipe failed.");
      }

      // Remove swiped profile from current feed
      setProfiles((previous) =>
        previous.filter((profile) => profile.id !== currentProfile.id),
      );

      // Show match popup only when backend confirms match
      if (data.match) {
        setActiveMatch(data.profile);
      }

      // Refresh actual matches
      await loadMatches();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSwiping(false);
    }
  };

  // Refresh feed from backend
  const refreshDiscover = async () => {
    setActiveMatch(null);
    setActiveTab("discover");
    await loadFeed();
    await loadMatches();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="topbar">
        <div className="brand">
          coy<span>.</span>
        </div>

        <div className="online-status">
          <span></span> Discover people
        </div>
      </header>

      <main className="main-content">
        {/* Welcome */}
        <div className="welcome">
          <p className="eyebrow">
            <Sparkles size={15} /> YOUR NEXT CONNECTION
          </p>

          <h1>
            Discover <span>someone new.</span>
          </h1>

          <p>Good connections start with a little courage.</p>
        </div>

        {/* Navigation */}
        <nav className="tabs">
          <button
            className={activeTab === "home" ? "tab active" : "tab"}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>

          <button
            className={activeTab === "discover" ? "tab active" : "tab"}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </button>

          <button
            className={activeTab === "matches" ? "tab active" : "tab"}
            onClick={() => setActiveTab("matches")}
          >
            <Users size={16} /> Matches
            {matches.length > 0 && (
              <span className="match-count">{matches.length}</span>
            )}
          </button>
        </nav>

        {/* Home */}
        {activeTab === "home" && (
          <section className="placeholder">
            <Sparkles size={38} />
            <h2>Welcome to Coy</h2>
            <p>Your home experience will be available here.</p>

            <button onClick={() => setActiveTab("discover")}>
              Explore Discover
            </button>
          </section>
        )}

        {/* Discover */}
        {activeTab === "discover" && (
          <section className="discover-section">
            <div className="section-heading">
              <div>
                <h2>People for you</h2>
                <p>Swipe right to like, left to pass.</p>
              </div>

              <span className="profile-counter">
                {profiles.length} remaining
              </span>
            </div>

            {error && (
              <div className="empty-state">
                <h2>Connection Error</h2>
                <p>{error}</p>

                <button onClick={refreshDiscover}>
                  <RotateCcw size={17} /> Try Again
                </button>
              </div>
            )}

            {loading && !error && (
              <div className="empty-state">
                <Sparkles size={38} />
                <h2>Loading profiles...</h2>
                <p>Finding your next connection.</p>
              </div>
            )}

            {!loading && !error && currentProfile && (
              <>
                <div className="card-container">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentProfile.id}
                      className="profile-card"
                      drag={isSwiping ? false : "x"}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.8}
                      onDragEnd={(event, info) => {
                        if (isSwiping) return;

                        if (info.offset.x > 100) {
                          handleSwipe("right");
                        } else if (info.offset.x < -100) {
                          handleSwipe("left");
                        }
                      }}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: 250,
                        rotate: 15,
                        transition: { duration: 0.25 },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="profile-photo">
                        <img
                          src={currentProfile.photo}
                          alt={currentProfile.name}
                          draggable="false"
                        />

                        <div className="photo-overlay"></div>

                        <div className="photo-label">
                          <span className="verified">✓</span>
                          COMMUNITY PROFILE
                        </div>

                        <div className="profile-info">
                          <h2>
                            {currentProfile.name}, {currentProfile.age}
                          </h2>

                          <p>
                            <MapPin size={15} />
                            {currentProfile.city}
                          </p>

                          <p>
                            <GraduationCap size={16} />
                            {currentProfile.college}
                          </p>

                          <p className="bio">{currentProfile.bio}</p>

                          <div className="interest-list">
                            {currentProfile.interests?.map((interest) => (
                              <span key={interest}>{interest}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Swipe buttons */}
                <div className="swipe-actions">
                  <button
                    className="action-button pass"
                    onClick={() => handleSwipe("left")}
                    disabled={isSwiping}
                    aria-label="Pass"
                  >
                    <X size={28} />
                  </button>

                  <button
                    className="action-button like"
                    onClick={() => handleSwipe("right")}
                    disabled={isSwiping}
                    aria-label="Like"
                  >
                    <Heart size={27} fill="currentColor" />
                  </button>
                </div>

                <p className="swipe-hint">
                  <X size={14} /> Pass
                  <span>•</span>
                  Like <Heart size={14} />
                </p>
              </>
            )}

            {!loading && !error && !currentProfile && (
              <div className="empty-state">
                <Sparkles size={42} />

                <h2>You've seen everyone!</h2>

                <p>There are no more profiles to discover right now.</p>

                <button onClick={refreshDiscover}>
                  <RotateCcw size={17} /> Refresh Feed
                </button>
              </div>
            )}
          </section>
        )}

        {/* Matches */}
        {activeTab === "matches" && (
          <section className="matches-section">
            <h2>Your Matches ❤️</h2>
            <p>People who liked you back.</p>

            {matches.length > 0 ? (
              <div className="matches-grid">
                {matches.map((profile) => (
                  <div className="match-card" key={profile.id}>
                    <img src={profile.photo} alt={profile.name} />

                    <h3>{profile.name}</h3>
                    <p>{profile.city}</p>

                    <span>It's a match!</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Heart size={40} />

                <h2>No matches yet</h2>

                <p>Keep discovering. Your next connection could be here!</p>

                <button onClick={() => setActiveTab("discover")}>
                  Discover people
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          coy<span>.</span> — Connections made meaningful.
        </p>
      </footer>

      {/* Match Popup */}
      <AnimatePresence>
        {activeMatch && (
          <motion.div
            className="match-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="match-popup"
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
            >
              <Sparkles size={42} />

              <h1>It's a Match!</h1>

              <img src={activeMatch.photo} alt={activeMatch.name} />

              <h2>You and {activeMatch.name}</h2>

              <p>You both liked each other!</p>

              <button
                onClick={() => {
                  setActiveMatch(null);
                  setActiveTab("matches");
                }}
              >
                View Matches
              </button>

              <button
                className="close-match"
                onClick={() => setActiveMatch(null)}
              >
                Continue Discovering
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
