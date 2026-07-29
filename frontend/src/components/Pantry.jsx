import { useEffect, useState } from "react";

export default function Pantry() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
        </div>
      ))
    )}

    {showModal && (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Add Pantry Item</h3>

                <p>The form will go here next.</p>

                <button
                    className="close-button"
                    onClick={() => setShowModal(false)}
                >
                    Close
                </button>
            </div>
        </div>
)}

  </div>
);
}