import { useEffect, useState } from "react";

export default function Pantry() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    expiration_date: "",
  });

  useEffect(() => {
    async function fetchItems() {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "http://127.0.0.1:8000/items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setItems(
            Array.isArray(data)
                ? data
                : data.items || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  async function handleAddItem() {
    setErrorMessage("");
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      "http://127.0.0.1:8000/pantry-items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          quantity: Number(newItem.quantity),
          expiration_date: newItem.expiration_date,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Could not add pantry item");
    }

    const createdItem = await response.json();

    setItems((currentItems) => [
      ...currentItems,
      createdItem,
    ]);

    setNewItem({
      name: "",
      category: "",
      quantity: "",
      expiration_date: "",
    });

    setShowModal(false);
  } catch (error) {
    console.error(error);
    setErrorMessage(
      "Unable to save your pantry item. Please try again."
    );
  }
}

  if (loading) {
    return <p>Loading pantry...</p>;
  }

  return (
  <div className="pantry-section">
    <div className="pantry-header">
        <h2>My Pantry</h2>

        <button
            className="add-item-button"
            onClick={() => setShowModal(true)}
        >
            + Add Item
        </button>
    </div>

    {items.length === 0 ? (
      <p>Your pantry is empty.</p>
    ) : (
      items.map((item) => (

        <div key={item.id} className="pantry-card">
          <h3>{item.name}</h3>

          <p>
            <strong>Category:</strong> {item.category}
          </p>

          <p>
            <strong>Quantity:</strong> {item.quantity}
          </p>

          <p>
            <strong>Expires:</strong> {item.expiration_date}
          </p>

                  <button
          className="edit-button"
          onClick={() => {
            setEditingItem(item);

            setNewItem({
              name: item.name,
              category: item.category,
              quantity: item.quantity,
              expiration_date: item.expiration_date,
            });

            setShowModal(true);
            }}
          >
          ✏️ Edit
          </button>
        </div>
      ))
    )}

    {showModal && (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Add Pantry Item</h3>

                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
  <label>Expiration Date</label>
  <input
    type="date"
    value={newItem.expiration_date}
    onChange={(e) =>
      setNewItem({
        ...newItem,
        expiration_date: e.target.value,
      })
    }
  />
              </div>

                {errorMessage && (
                  <p className="form-error">
                    {errorMessage}
                  </p>
                )}

                <div className="modal-actions">
                  <button
                    className="save-button"
                    type="button"
                    onClick={handleAddItem}
                  >
                    Save
                  </button>

                  <button
                    className="close-button"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
            </div>
        </div>
)}

  </div>
);
}