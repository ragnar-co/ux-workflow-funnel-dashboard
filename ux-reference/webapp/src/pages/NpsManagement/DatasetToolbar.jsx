import { SearchInput } from "../../components/SearchInput.jsx";
import { FilterSelect } from "../../components/FilterSelect.jsx";
import { ExportMenu } from "../../components/ExportMenu.jsx";

export function DatasetToolbar({
  search, onSearch, count, onReset, isFiltered, onAddSurvey, exportOptions,
  periodOptions, periodFilter, onPeriodFilter
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput value={search} onChange={onSearch} placeholder="Search survey..." className="max-w-xs" />
      <FilterSelect
        icon="calendar"
        value={periodFilter}
        onChange={onPeriodFilter}
        options={[{ value: "all", label: "All periods" }, ...periodOptions]}
      />
      <span className="text-sm text-muted whitespace-nowrap">{count} results</span>
      {isFiltered && (
        <button onClick={onReset} className="text-xs font-bold text-brand-blue hover:underline whitespace-nowrap">
          Reset filters
        </button>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <ExportMenu
          options={exportOptions}
          disabled={count === 0}
          disabledReason="ไม่มีข้อมูลให้ส่งออก"
        />
        <button onClick={onAddSurvey} className="btn-primary h-9 whitespace-nowrap">+ Add Survey</button>
      </div>
    </div>
  );
}
