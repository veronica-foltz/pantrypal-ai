import { useEffect, useState } from "react";

function Recipes() {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showAiPanel, setShowAiPanel] = useState(false);

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch(
                    "http://127.0.0.1:8000/recipes/suggestions",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Could not load recipe suggestions");
                }

                const data = await response.json();

                setRecipes(
                    Array.isArray(data)
                        ? data
                        : data.recipes || data.suggestions || []
                    );
                } catch (error) {
                    console.error(error);
                    setErrorMessage("Could not load recipe suggestions.");
                } finally {
                    setLoading(false);
                }
            }

            fetchRecipes();
        }, []);

  return (
    <section className="recipes-page">
      <div className="recipes-header">
        <div>
          <p className="eyebrow">Cook with what you have</p>
          <h2>Recipe Ideas</h2>

            <button className="ai-recipe-button"
                onClick={() => setShowAiPanel(true)}
            >
                ✨ Generate AI Recipe
            </button>

            {showAiPanel && (
                <div className="ai-recipe-panel">
                    <h3>AI Recipe Assistant</h3>
                    <p>
                        PantryPal will use your pantry ingredients to create
                        a personalized recipe.
                    </p>

                    <button
                        className="close-ai-button"
                        onClick={() => setShowAiPanel(false)}
                    >
                        Close
                    </button>
                </div>
            )}

        </div>
      </div>

    {loading ? (
        <p>Loading recipe ideas...</p>
    ) : errorMessage ? (
        <p className="error-message">{errorMessage}</p>
    ) : recipes.length === 0 ? (
        <p>No recipe suggestions yet.</p>
    ) : (
        <div className="recipe-grid">
            {recipes.map((recipe, index) => (
                <article
                    className="recipe-card"
                    key={recipe.name}
                >
                    <div className="recipe-icon">🍳</div>

                    <div className="recipe-card-content">
                        <div className="recipe-card-header">
                            <h3>{recipe.name}</h3>

                            <span
                                className={
                                    recipe.can_make
                                        ? "recipe-status ready"
                                        : "recipe-status missing"
                                }
                            >
                                {recipe.can_make ? "Ready to make" : `${recipe.match_score}% match`}
                            </span>
                        </div>

                        <p>
                            <strong>Have:</strong>{" "}
                            {recipe.matched_ingredients.join(", ") || "None"}
                        </p>

                        {!recipe.can_make && (
                            <p>
                                <strong>Missing:</strong>{" "}
                                {recipe.missing_ingredients.join(", ")}
                            </p>
                        )}
                    </div>
                </article>
            ))}
        </div>
        )}
    </section>
  );
}

export default Recipes;