import { useEffect, useState } from "react";
import { Card } from "../../components/Card.jsx";
import { ProductSummary } from "./ProductSummary.jsx";
import { TeamAccordion } from "./TeamAccordion.jsx";
import { MemberTable } from "./MemberTable.jsx";
import { SearchInput } from "../../components/SearchInput.jsx";
import { FilterSelect } from "../../components/FilterSelect.jsx";

const TABS = [
  { id: "hierarchy", label: "Hierarchy" },
  { id: "people", label: "People" }
];

export function ProductDetail({ product, people, getTeamInfo, onAddTeam, onEditProduct, onAddPerson, onRemovePerson, onEditTeam }) {
  const [tab, setTab] = useState("hierarchy");
  const [expandedTeam, setExpandedTeam] = useState(product.teams[0] || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [peopleFilter, setPeopleFilter] = useState({ search: "", team: "all", status: "all" });

  useEffect(() => {
    setTab("hierarchy");
    setExpandedTeam(product.teams[0] || null);
    setPeopleFilter({ search: "", team: "all", status: "all" });
  }, [product.name]);

  const productPeople = people.filter((p) => product.teams.includes(p.team));
  const activeCount = productPeople.filter((p) => (p.status || "Active") === "Active").length;

  const filteredPeople = productPeople.filter((p) =>
    (peopleFilter.team === "all" || p.team === peopleFilter.team) &&
    (peopleFilter.status === "all" || (p.status || "Active") === peopleFilter.status) &&
    (!peopleFilter.search.trim() || `${p.name} ${p.email}`.toLowerCase().includes(peopleFilter.search.toLowerCase()))
  );

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="text-sm text-muted">Product Owner: {product.owner || "—"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onAddTeam} className="btn-secondary whitespace-nowrap">+ Add Team</button>
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="btn-outline-sm px-2.5">•••</button>
            {menuOpen && (
              <div className="absolute right-0 top-9 z-10 w-36 rounded-input border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.1)]">
                <button
                  onClick={() => { setMenuOpen(false); onEditProduct(); }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-workspace"
                >
                  Edit Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductSummary teamCount={product.teams.length} peopleCount={productPeople.length} activeCount={activeCount} />

      <div className="flex gap-2 mb-4 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-brand-blue text-brand-blue" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "hierarchy" && (
        product.teams.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted mb-3">No teams yet</p>
            <button onClick={onAddTeam} className="btn-secondary">+ Add Team</button>
          </div>
        ) : (
          <div>
            {product.teams.map((team) => (
              <TeamAccordion
                key={team}
                team={team}
                lead={getTeamInfo(product.name, team).lead}
                members={people.filter((p) => p.team === team)}
                expanded={expandedTeam === team}
                onToggle={() => setExpandedTeam((prev) => (prev === team ? null : team))}
                onAddPerson={() => onAddPerson(team)}
                onRemovePerson={onRemovePerson}
                onEditTeam={() => onEditTeam(team)}
              />
            ))}
          </div>
        )
      )}

      {tab === "people" && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <SearchInput
              value={peopleFilter.search}
              onChange={(value) => setPeopleFilter((prev) => ({ ...prev, search: value }))}
              placeholder="Search people..."
              className="max-w-xs"
            />
            <FilterSelect
              icon="team"
              value={peopleFilter.team}
              onChange={(value) => setPeopleFilter((prev) => ({ ...prev, team: value }))}
              options={[{ value: "all", label: "All Teams" }, ...product.teams.map((t) => ({ value: t, label: t }))]}
            />
            <FilterSelect
              icon="status"
              value={peopleFilter.status}
              onChange={(value) => setPeopleFilter((prev) => ({ ...prev, status: value }))}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" }
              ]}
            />
          </div>
          <MemberTable members={filteredPeople} onRemove={onRemovePerson} showTeam emptyLabel="No people match this filter." />
        </div>
      )}
    </Card>
  );
}
