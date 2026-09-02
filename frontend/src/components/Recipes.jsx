function Recipes() {
  return (
    <section className="recipes-page">
      <div className="recipes-header">
        <div>
          <p className="eyebrow">Cook with what you have</p>
          <h2>Recipe Ideas</h2>
        </div>
      </div>

      <div className="recipe-grid">
        <article className="recipe-card">
            <div className="recipe-icon">🍳</div>
            <div>
                <h3>Veggie Egg Scramble</h3>
                <p>Eggs, produce, and pantry staples.</p>
                <span>15 min</span>
            </div>
        </article>

        <article className="recipe-card">
            <div className="recipe-icon">🥪</div>
            <div>
                <h3>Toasted Pantry Sandwich</h3>
                <p>Bread, cheese, and whatever extras you have.</p>
                <span>10 min</span>
            </div>
        </article>

        <article className="recipe-card">
            <div className="recipe-icon">🍝</div>
            <div>
                <h3>Quick Pantry Pasta</h3>
                <p>Simple ingredients turned into an easy dinner.</p>
                <span>25 min</span>
            </div>
        </article>
        </div>
    </section>
  );
}

export default Recipes;