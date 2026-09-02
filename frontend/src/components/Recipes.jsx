function Recipes() {
  return (
    <section className="recipes-page">
      <div className="recipes-header">
        <div>
          <p className="eyebrow">Cook with what you have</p>
          <h2>Recipe Ideas</h2>
        </div>
      </div>

      <div className="recipe-empty-state">
        <span className="recipe-empty-icon">🍳</span>

        <h3>Find something delicious</h3>

        <p>
          PantryPal can suggest recipes based on the ingredients
          already in your pantry.
        </p>

        <button className="recipe-generate-button">
          ✨ Find Recipes
        </button>
      </div>
    </section>
  );
}

export default Recipes;