import { useEffect, useState } from "react";

function Shopping() {
  const [shoppingItems, setShoppingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
    async function fetchShoppingList() {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "http://127.0.0.1:8000/shopping-list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not load shopping list");
        }

        const data = await response.json();

        setShoppingItems(
          Array.isArray(data)
            ? data
            : data.items || data.shopping_list || []
        );
      } catch (error) {
        console.error(error);
        setErrorMessage("Could not load shopping list.");
      } finally {
        setLoading(false);
      }
    }

    fetchShoppingList();
  }, []);
  
  
    return (
    <section className="shopping-page">
      <div className="shopping-header">
        <div>
          <p className="eyebrow">Plan what you need</p>
          <h2>Shopping List</h2>
        </div>
      </div>

        {loading ? (
            <p>Loading shopping list...</p>
        ) : errorMessage ? (
            <p className="error-message">{errorMessage}</p>
        ) : shoppingItems.length === 0 ? (
            <p>Your shopping list is empty.</p>
        ) : (
            <div className="shopping-list">
                {shoppingItems.map((item, index) => (
                    <div className="shopping-item" key={index}>
                        🛒 {typeof item === "string" ? item : item.name}
                    </div>
                ))}
            </div>
        )}
    </section>
  );
}

export default Shopping;