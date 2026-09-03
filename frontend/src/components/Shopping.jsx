function Shopping() {
  return (
    <section className="shopping-page">
      <div className="shopping-header">
        <div>
          <p className="eyebrow">Plan what you need</p>
          <h2>Shopping List</h2>
        </div>
      </div>

      <div className="shopping-empty-state">
        <span className="shopping-empty-icon">🛒</span>

        <h3>Your shopping list</h3>

        <p>
          PantryPal can help you keep track of ingredients
          you still need.
        </p>
      </div>
    </section>
  );
}

export default Shopping;