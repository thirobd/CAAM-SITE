import Link from "next/link";
import { startingPrice, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/parfums/${product.slug}`} className="product-card">
      <ProductVisual product={product} />
      <div className="product-card__body">
        <span className="eyebrow">{product.family}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__tagline">{product.tagline}</p>
        <span className="product-card__price">Dès {formatPrice(startingPrice(product))}</span>
      </div>
    </Link>
  );
}
