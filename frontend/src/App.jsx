import "./App.css";

function App() {
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
        </section>

        <section className="search-section">
          <input
            type="text"
            placeholder="🔍 Search your pantry..."
            className="search-input"
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
          <button>See All</button>
      </div>

        <div className="category-grid">
          <button className="category-card">
            <span className="category-icon">🥛</span>
            <span>
              <strong>Dairy</strong>
              <small>1 item</small>
            </span>
          </button>

          <button className="category-card">
            <span className="category-icon">🥬</span>
            <span>
              <strong>Produce</strong>
              <small>1 item</small>
            </span>
          </button>

          <button className="category-card">
            <span className="category-icon">🍞</span>
            <span>
              <strong>Bakery</strong>
              <small>1 item</small>
            </span>
          </button>

          <button className="category-card">
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
    </div>
  );
}

export default App;