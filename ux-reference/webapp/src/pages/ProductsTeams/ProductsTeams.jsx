import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../../store/AppStateContext.jsx";
import { ProductList } from "./ProductList.jsx";
import { ProductDetail } from "./ProductDetail.jsx";
import { AddProductDrawer } from "./AddProductDrawer.jsx";
import { AddTeamDrawer } from "./AddTeamDrawer.jsx";
import { AddPersonDrawer } from "./AddPersonDrawer.jsx";
import { SearchInput } from "../../components/SearchInput.jsx";

function matchesSearch(text, query) {
  return text.toLowerCase().includes(query);
}

export function ProductsTeams() {
  const {
    products, people, addProduct, updateProduct,
    addTeamToProduct, teamInfo, setTeamInfo, getTeamInfo,
    addPerson, removePerson
  } = useAppState();

  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState(products[0]?.name || null);
  const [productDrawer, setProductDrawer] = useState({ open: false, initial: null });
  const [teamDrawer, setTeamDrawer] = useState({ open: false, initial: null });
  const [personDrawer, setPersonDrawer] = useState({ open: false, team: null });

  const query = search.trim().toLowerCase();

  const visibleProducts = useMemo(() => {
    if (!query) return products;
    return products.filter((product) => {
      if (matchesSearch(product.name, query)) return true;
      if (product.teams.some((team) => matchesSearch(team, query))) return true;
      const productPeople = people.filter((p) => product.teams.includes(p.team));
      return productPeople.some((p) => matchesSearch(p.name, query) || matchesSearch(p.email || "", query));
    });
  }, [products, people, query]);

  useEffect(() => {
    if (!visibleProducts.some((p) => p.name === selectedName)) {
      setSelectedName(visibleProducts[0]?.name || null);
    }
  }, [visibleProducts, selectedName]);

  const selectedProduct = products.find((p) => p.name === selectedName) || null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search product, team or person..." className="max-w-md" />
        <button onClick={() => setProductDrawer({ open: true, initial: null })} className="btn-primary whitespace-nowrap ml-auto">
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-start">
        <ProductList products={visibleProducts} people={people} selectedName={selectedName} onSelect={setSelectedName} />

        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            people={people}
            getTeamInfo={getTeamInfo}
            onAddTeam={() => setTeamDrawer({ open: true, initial: null })}
            onEditProduct={() => setProductDrawer({ open: true, initial: selectedProduct })}
            onAddPerson={(team) => setPersonDrawer({ open: true, team })}
            onRemovePerson={removePerson}
            onEditTeam={(team) => setTeamDrawer({ open: true, initial: { name: team, ...getTeamInfo(selectedProduct.name, team) } })}
          />
        ) : (
          <p className="text-sm text-muted py-10 text-center">No products match your search.</p>
        )}
      </div>

      <AddProductDrawer
        open={productDrawer.open}
        initial={productDrawer.initial}
        onClose={() => setProductDrawer({ open: false, initial: null })}
        onSubmit={(form) => {
          if (productDrawer.initial) {
            updateProduct(productDrawer.initial.name, { owner: form.owner, status: form.status });
          } else {
            addProduct(form.name.trim());
            updateProduct(form.name.trim(), { owner: form.owner, status: form.status });
            setSelectedName(form.name.trim());
          }
        }}
      />

      {selectedProduct && (
        <AddTeamDrawer
          open={teamDrawer.open}
          initial={teamDrawer.initial}
          productName={selectedProduct.name}
          onClose={() => setTeamDrawer({ open: false, initial: null })}
          onSubmit={(form) => {
            if (!teamDrawer.initial) addTeamToProduct(selectedProduct.name, form.name.trim());
            setTeamInfo(selectedProduct.name, form.name.trim(), { lead: form.lead, status: form.status });
          }}
        />
      )}

      {selectedProduct && (
        <AddPersonDrawer
          open={personDrawer.open}
          teams={selectedProduct.teams}
          defaultTeam={personDrawer.team}
          onClose={() => setPersonDrawer({ open: false, team: null })}
          onSubmit={(form) => addPerson({ id: crypto.randomUUID(), name: form.name.trim(), email: form.email, role: form.role, team: form.team, status: form.status })}
        />
      )}
    </div>
  );
}
