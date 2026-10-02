export const ROLES = [
  { id: "nps-owner", label: "NPS Owner" },
  { id: "caller", label: "Outsource / Caller" },
  { id: "product-owner", label: "Product Owner" },
  { id: "event-owner", label: "Event Owner" },
  { id: "management", label: "Management" }
];

export const ROLE_NAV_ACCESS = {
  "nps-owner": ["dashboard", "add-result", "responses", "response-center", "products-teams", "settings"],
  "caller": ["dashboard", "response-center", "settings"],
  "product-owner": ["dashboard", "responses", "response-center", "products-teams", "settings"],
  "event-owner": ["dashboard", "add-result", "settings"],
  "management": ["dashboard", "responses", "settings"]
};

export const DEFAULT_ROLE = "nps-owner";
