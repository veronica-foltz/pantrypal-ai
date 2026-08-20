import { useEffect, useState } from "react";

export default function Pantry({ searchTerm, selectedCategory, }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    expiration_date: "",
  });

  <input
  type="text"
  className="search-input"
  placeholder="Search pantry items..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

  useEffect(() => {
    async function fetchItems() {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "http://127.0.0.1:8000/pantry-items",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Pantry fetch failed:", response.status, errorData);
          throw new Error("Could not load pantry items");
        }

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

    const url = editingItem
    ? `http://127.0.0.1:8000/pantry-items/${editingItem.id}`
    : "http://127.0.0.1:8000/pantry-items";

    const method = editingItem ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
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
    });

    if (!response.ok) {
      throw new Error("Could not add pantry item");
    }

    const savedItem = await response.json();

    if (editingItem) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === savedItem.id ? savedItem : item
        )
      );
    } else {
      setItems((currentItems) => [
        ...currentItems,
        savedItem,
      ]);
    }

    setNewItem({
      name: "",
      category: "",
      quantity: "",
      expiration_date: "",
    });

    setEditingItem(null);
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
async function handleDeleteItem(itemId) {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `http://127.0.0.1:8000/pantry-items/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Could not delete pantry item");
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  } catch (error) {
    console.error(error);
  }
}

const filteredItems = items.filter((item) => {
  const matchesSearch = item.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "" ||
    item.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

  return (
  <div className="pantry-section">
    <div className="pantry-header">
        <h2>My Pantry</h2>

        <button
            className="add-item-button"
            onClick={() => {
              setEditingItem(null);

              setNewItem({
                name: "",
                category: "",
                quantity: "",
                expiration_date: "",
              });

  setErrorMessage("");
  setShowModal(true);
}}
        >
            + Add Item
        </button>
    </div>

    {filteredItems.length === 0 ? (
      <p>Your pantry is empty.</p>
    ) : (
      filteredItems.map((item) => (

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

          <button
            className="delete-button"
            onClick={() => setItemToDelete(item)}
          >
            🗑️ Delete
          </button>
        </div>
      ))
    )}

    {showModal && (
        <div className="modal-overlay">
            <div className="modal">
                <h3>
                  {editingItem ? "Edit Pantry Item" : "Add Pantry Item"}
                </h3>
                
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
                    onClick={() => {
                      setEditingItem(null);
                      setErrorMessage("");
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
            </div>
        </div>
)}
{itemToDelete && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Delete Pantry Item?</h3>

      <p>
        Are you sure you want to delete{" "}
        <strong>{itemToDelete.name}</strong>?
      </p>

      <div className="modal-actions">
        <button
          className="delete-confirm-button"
          onClick={() => {
            handleDeleteItem(itemToDelete.id);
            setItemToDelete(null);
          }}
        >
          Delete
        </button>

        <button
          className="close-button"
          onClick={() => setItemToDelete(null)}
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