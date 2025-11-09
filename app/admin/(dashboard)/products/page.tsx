// app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ref, get, push, remove ,onValue} from "firebase/database";
import { database } from "@/lib/firebase";
import { Plus, Trash2 } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<Record<string, any>>({});
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  useEffect(() => {
    const unsub = onValue(ref(database, "products"), (snap) => {
      setProducts(snap.val() || {});
    });
    return () => unsub();
  }, []);

  const addProduct = async () => {
    if (!form.name || !form.price || !form.stock) return;
    await push(ref(database, "products"), {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    });
    setForm({ name: "", price: "", stock: "" });
  };

  const deleteProduct = async (id: string) => {
    await remove(ref(database, `products/${id}`));
  };

  return (
    <>
      <header className="content-header">
        <h1>Manage Products</h1>
      </header>

      <div className="product-form-card">
        <div className="form-grid">
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <button onClick={addProduct} className="add-btn">
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      <div className="products-grid">
        {Object.entries(products).map(([id, p]) => (
          <div key={id} className="product-card">
            <h3>{p.name}</h3>
            <p><strong>₹{p.price}</strong> • {p.stock} in stock</p>
            <button onClick={() => deleteProduct(id)} className="delete-btn">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}