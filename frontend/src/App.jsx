import { useEffect, useState } from "react";
import "./App.css";

import Pantry from "./components/Pantry";

import Recipes from "./components/Recipes";

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("access_token") || ""
  );

  const [loginMessage, setLoginMessage] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pantryItems, setPantryItems] = useState([]);

  async function handleGuestLogin() {
    try {
      setLoginMessage("Signing in as guest...");

      const response = await fetch(
        "http://127.0.0.1:8000/guest-login",
        {
         method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Guest login failed");
      }

      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);
      setToken(data.access_token);
      setLoginMessage("Guest login successful!");
    } catch (error) {
     console.error(error);
      setLoginMessage("Could not sign in as guest.");
    }
  }

  async function fetchDashboard(activeToken) {
    try {
      setDashboardError("");

      const response = await fetch(
        "http://127.0.0.1:8000/dashboard",
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Dashboard request failed");
      }

      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error(error);
      setDashboardError("Could not load dashboard data.");
    }
  }

  useEffect(() => {
    if (token) {
      fetchDashboard(token);
    }
  }, [token]);

  return (
    <div className="app-shell">
      <header className="top-header">
        <div>
          <p className="eyebrow">Smart pantry assistant</p>
          <h1>PantryPal AI</h1>
        </div>

        <button className="profile-button" aria-label="Open profile">
          VF
        </button>
      </header>

      <main className="app-content">
        <section className="welcome-card">
          <p>Welcome back</p>
          <h2>What’s in your pantry today?</h2>
            <button
              className="guest-button"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>

            {loginMessage && (
              <p className="login-message">{loginMessage}</p>
            )}
        </section>

        {dashboard && (
          <section className="stats-grid">
            <div className="stat-card">
              <strong>{dashboard.total_items}</strong>
              <span>Pantry Items</span>
            </div>

            <div className="stat-card">
              <strong>{dashboard.total_categories}</strong>
              <span>Categories</span>
            </div>

            <div className="stat-card">
              <strong>{dashboard.expiring_soon}</strong>
              <span>Expiring Soon</span>
            </div>

            <div className="stat-card">
              <strong>{dashboard.recipes_available}</strong>
              <span>Recipes Ready</span>
            </div>
          </section>
        )}

        {dashboardError && (
          <p className="error-message">{dashboardError}</p>
        )}

        <section className="search-section">
          <input
            type="text"
            placeholder="🔍 Search your pantry..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </section>

        <section className="expiring-card">
          <div className="section-header">
            <h3>Expiring Soon</h3>
            <button>See All</button>
          </div>

          <div className="expiring-items">
            <div className="item-pill">
              🥚 Eggs
            <span>2 days</span>
          </div>

            <div className="item-pill">
              🍞 Bread
            <span>3 days</span>
          </div>

          <div className="item-pill">
              🍎 Apples
            <span>5 days</span>
          </div>
          </div>
        </section>

      <section className="categories-section">
        <div className="section-header">
          <h3>Categories</h3>
          <button onClick={() => setSelectedCategory("")}>
            See All
          </button>
      </div>

        <div className="category-grid">
          <button className={`category-card ${
                    selectedCategory === "Dairy" ? "active-category" : ""
                  }`}
            onClick={() => setSelectedCategory("Dairy")}
          >
            <span className="category-icon">🥛</span>
            <span>
              <strong>Dairy</strong>
              <small>
                {pantryItems.filter((item) => item.category === "Dairy").length}{" "}
                {pantryItems.filter((item) => item.category === "Dairy").length === 1
                  ? "item"
                  : "items"}
              </small>
            </span>
          </button>

          <button className={`category-card ${
                    selectedCategory === "Produce" ? "active-category" : ""
                  }`}
            onClick={() => setSelectedCategory("Produce")}
          >
            <span className="category-icon">🥬</span>
            <span>
              <strong>Produce</strong>
              <small>
                {pantryItems.filter((item) => item.category === "Produce").length}{" "}
                {pantryItems.filter((item) => item.category === "Produce").length === 1
                  ? "item"
                  : "items"}
              </small>
            </span>
          </button>

          <button className={`category-card ${
                    selectedCategory === "Bakery" ? "active-category" : ""
                  }`}
            onClick={() => setSelectedCategory("Bakery")}
          >
            <span className="category-icon">🍞</span>
            <span>
              <strong>Bakery</strong>
              <small>
                {pantryItems.filter((item) => item.category === "Bakery").length}{" "}
                {pantryItems.filter((item) => item.category === "Bakery").length === 1
                  ? "item"
                  : "items"}
              </small>
            </span>
          </button>

          <button className={`category-card ${
                    selectedCategory === "" ? "active-category" : ""
                  }`}
            onClick={() => setSelectedCategory("")}
          >
            <span className="category-icon">➕</span>
            <span>
              <strong>More</strong>
              <small>View all</small>
            </span>
          </button>
        </div>
      </section>

      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        <button className="nav-item active">
          <span className="nav-icon">⌂</span>
          <span>Home</span>
        </button>

        <button className="nav-item">
          <span className="nav-icon">▦</span>
          <span>Pantry</span>
        </button>

        <button className="nav-item">
          <span className="nav-icon">♨</span>
          <span>Recipes</span>
        </button>

        <button className="nav-item">
          <span className="nav-icon">☷</span>
          <span>Shopping</span>
        </button>
      </nav>

      <Pantry 
        searchTerm={searchTerm} 
        selectedCategory={selectedCategory}
        onItemsChange={setPantryItems}
      />
      
    </div>
  );
}

export default App;