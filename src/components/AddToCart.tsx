"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart/CartProvider";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(product.variants[1]?.id ?? product.variants[0].id);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <div className="add-to-cart">
      <fieldset className="volume-picker">
        <legend className="eyebrow">Contenance</legend>
        <div className="volume-picker__options">
          {product.variants.map((v) => (
            <label key={v.id} className={`volume-picker__option ${v.id === variantId ? "is-selected" : ""}`}>
              <input
                type="radio"
                name="volume"
                value={v.id}
                checked={v.id === variantId}
                onChange={() => setVariantId(v.id)}
              />
              <span className="volume-picker__ml">{v.volumeMl} ml</span>
              <span className="volume-picker__price">{formatPrice(v.price)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button className="button button--full" onClick={() => add(product.slug, variant.id)}>
        Ajouter au panier — {formatPrice(variant.price)}
      </button>
    </div>
  );
}
