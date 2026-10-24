import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { BottleArt } from "./BottleArt";

type Props = {
  product: Product;
  sizes?: string;
  priority?: boolean;
};

/** Photo du parfum si elle existe, sinon le flacon dessiné. */
export function ProductVisual({ product, sizes = "(max-width: 768px) 100vw, 33vw", priority }: Props) {
  return (
    <div className="product-visual" style={{ "--tint": product.tint } as React.CSSProperties}>
      {product.image ? (
        <Image src={product.image} alt={product.name} fill sizes={sizes} priority={priority} />
      ) : (
        <BottleArt tint={product.tint} name={product.name} className="product-visual__bottle" />
      )}
    </div>
  );
}
