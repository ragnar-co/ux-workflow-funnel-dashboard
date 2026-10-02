import { Card } from "../../components/Card.jsx";
import { ProductListItem } from "./ProductListItem.jsx";

export function ProductList({ products, people, selectedName, onSelect }) {
  return (
    <Card className="p-0 overflow-hidden sticky top-6 self-start">
      <div className="px-4 py-3 border-b border-line">
        <h2 className="text-sm font-bold">Products</h2>
        <p className="text-xs text-muted">{products.length} products</p>
      </div>
      <div className="max-h-[70vh] overflow-y-auto">
        {products.map((product) => {
          const peopleCount = people.filter((p) => product.teams.includes(p.team)).length;
          return (
            <ProductListItem
              key={product.name}
              product={product}
              teamCount={product.teams.length}
              peopleCount={peopleCount}
              selected={product.name === selectedName}
              onSelect={() => onSelect(product.name)}
            />
          );
        })}
        {products.length === 0 && <p className="px-4 py-6 text-sm text-muted text-center">No products match your search.</p>}
      </div>
    </Card>
  );
}
