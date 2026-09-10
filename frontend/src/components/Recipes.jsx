import { useEffect, useState } from "react";
import { API_URL } from "./config";

function Recipes() {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showAiPanel, setShowAiPanel] = useState(false);
    const [aiRecipe, setAiRecipe] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch(
                    `${API_URL}/recipes/suggestions`,
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
    
    const generateAiRecipe = async () => {
        console.log("AI BUTTON CLICKED");

        setShowAiPanel(true);
        setAiLoading(true);
        setAiRecipe("");
        setAiError("");

        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(
            `${API_URL}/recipes/ai-generate`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to generate recipe");
        }

        setAiRecipe(data.recipe);
    } catch (error) {
        console.error(error);
        setAiError("We couldn't generate a recipe right now. Please try again.");
    } finally {
        setAiLoading(false);
    }
    };

  return (
    <section className="recipes-page">
      <div className="recipes-header">
        <div>
          <p className="eyebrow">Cook with what you have</p>
          <h2>Recipe Ideas</h2>

            <button className="ai-recipe-button"
                onClick={generateAiRecipe}
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

                    {aiLoading && (
                        <div className="ai-loading">
                            ✨ Creating a recipe from your pantry...
                        </div>
                    )}

                    {aiError && (
                        <div className="ai-error">
                            {aiError}
                        </div>
                    )}

                    {aiRecipe && (
                        <div className="ai-recipe-result">
                            {aiRecipe}
                        </div>
                    )}

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