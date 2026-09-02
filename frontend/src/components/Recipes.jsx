import { useEffect, useState } from "react";

function Recipes() {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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
                    key={recipe.id || index}
                >
                    <div className="recipe-icon">🍳</div>

                    <div>
                        <h3>{recipe.name || recipe.title}</h3>

                    <p>
                        {recipe.description ||
                            "A recipe based on ingredients in your pantry."}
                    </p>

                    {recipe.cook_time && (
                        <span>{recipe.cook_time}</span>
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