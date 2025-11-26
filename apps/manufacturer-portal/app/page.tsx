"use client";

import { FormEvent, useState } from "react";
import { api } from "../lib/api";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
}

export default function ManufacturerHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await api.get("/products");
    setProducts(data);
    setLoading(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await api.post("/products", {
      manufacturerId: formData.get("manufacturerId"),
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      commissionRules: { percentage: Number(formData.get("commission")) / 100 },
      stock: [
        {
          warehouseId: String(formData.get("warehouseId")),
          quantity: Number(formData.get("quantity")),
        },
      ],
    });
    form.reset();
    fetchProducts();
  }

  return (
    <section className="space-y-6">
      <form onSubmit={onSubmit} className="bg-white shadow-sm p-4 rounded-lg grid gap-3">
        <h2 className="text-lg font-semibold">Upload Product</h2>
        <input name="manufacturerId" placeholder="Manufacturer ID" required className="field" />
        <input name="title" placeholder="Product title" required className="field" />
        <textarea name="description" placeholder="Description" required className="field" />
        <input name="price" type="number" step="0.01" placeholder="Price (₵)" required className="field" />
        <input name="commission" type="number" placeholder="Commission %" required className="field" />
        <input name="warehouseId" placeholder="Warehouse ID" required className="field" />
        <input name="quantity" type="number" placeholder="Quantity" required className="field" />
        <button className="btn">Save Product</button>
      </form>

      <div>
        <button onClick={fetchProducts} className="btn">
          Refresh Products
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid gap-3">
          {products.map((product) => (
            <article key={product.id} className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm">Price: ₵{product.price}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
