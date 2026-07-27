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

        <section className="placeholder-card">
          <h3>Pantry overview</h3>
          <p>Your pantry items will appear here.</p>
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