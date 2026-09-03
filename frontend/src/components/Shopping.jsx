import { useEffect, useState } from "react";

function Shopping() {
  const [shoppingItems, setShoppingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);

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

    function toggleItem(index) {
        setCheckedItems((currentItems) =>
            currentItems.includes(index)
                ? currentItems.filter((itemIndex) => itemIndex !== index)
                : [...currentItems, index]
        );
    }

    function clearCompleted() {
        setShoppingItems((currentItems) =>
            currentItems.filter(
                (_, index) => !checkedItems.includes(index)
            )
        );

        setCheckedItems([]);
    }
  
  
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
        <>
            {checkedItems.length > 0 && (
                <button
                    className="clear-completed-button"
                    onClick={clearCompleted}
                >
                    Clear completed
                </button>
            )}

            <div className="shopping-list">
                {shoppingItems.map((item, index) => (
                    <button
                        className={`shopping-item ${
                            checkedItems.includes(index) ? "checked" : ""
                        }`}
                        key={index}
                        onClick={() => toggleItem(index)}
                    >
                        <span className="shopping-checkbox">
                            {checkedItems.includes(index) ? "✓" : ""}
                        </span>

                        <span>
                            {typeof item === "string" ? item : item.name}
                        </span>
                    </button>
                ))}
            </div>
        </>
        )}
    </section>
  );
}

export default Shopping;