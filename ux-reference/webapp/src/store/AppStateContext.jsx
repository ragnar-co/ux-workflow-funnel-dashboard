import { createContext, useContext, useMemo, useState } from "react";
import appConfig from "../config/app-config.json";
import { DEFAULT_ROLE } from "../config/roles.js";
import { initialPeople, initialResponses } from "../data/mockData.js";
import { initialDatasets } from "../data/mockDatasets.js";

const STORAGE_KEY = "ragnar-nps-responses-v1";
const EVENTS_STORAGE_KEY = "ragnar-nps-events-v1";
const DATASETS_STORAGE_KEY = "ragnar-nps-datasets-v1";
const SIDEBAR_STORAGE_KEY = "ragnar-nps-sidebar-collapsed-v1";

function loadStoredResponses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialResponses;
  } catch {
    return initialResponses;
  }
}

function loadStoredEvents() {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadStoredDatasets() {
  try {
    const raw = localStorage.getItem(DATASETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialDatasets;
  } catch {
    return initialDatasets;
  }
}

function loadSidebarCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [products, setProducts] = useState(appConfig.products);
  const [people, setPeople] = useState(initialPeople);
  const [responses, setResponses] = useState(loadStoredResponses);
  const [events, setEvents] = useState(loadStoredEvents);
  const [lastImportSummary, setLastImportSummary] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(loadSidebarCollapsed);
  const [teamInfo, setTeamInfoState] = useState({});
  const [datasets, setDatasets] = useState(loadStoredDatasets);

  const setSidebarCollapsed = (next) => {
    setSidebarCollapsedState(next);
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
    } catch {
      // storage unavailable, keep in-memory only
    }
  };

  const persist = (next) => {
    setResponses(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable, keep in-memory only
    }
  };

  const importResponses = (newRows, meta) => {
    persist([...newRows, ...responses]);
    setLastImportSummary({ count: newRows.length, ...meta });
  };

  const updateResponse = (id, patch) => {
    persist(responses.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addTeamToProduct = (productName, teamName) => {
    setProducts((prev) => prev.map((product) => (
      product.name === productName && !product.teams.includes(teamName)
        ? { ...product, teams: [...product.teams, teamName] }
        : product
    )));
  };

  const addProduct = (name) => {
    setProducts((prev) => (prev.some((product) => product.name === name) ? prev : [...prev, { name, teams: [] }]));
  };

  const updateProduct = (name, patch) => {
    setProducts((prev) => prev.map((product) => (product.name === name ? { ...product, ...patch } : product)));
  };

  const teamInfoKey = (productName, teamName) => `${productName}::${teamName}`;

  const setTeamInfo = (productName, teamName, patch) => {
    setTeamInfoState((prev) => {
      const key = teamInfoKey(productName, teamName);
      return { ...prev, [key]: { ...prev[key], ...patch } };
    });
  };

  const getTeamInfo = (productName, teamName) => teamInfo[teamInfoKey(productName, teamName)] || {};

  const addPerson = (person) => {
    setPeople((prev) => [...prev, { status: "Active", role: "", email: "", ...person }]);
  };

  const updatePerson = (id, patch) => {
    setPeople((prev) => prev.map((person) => (person.id === id ? { ...person, ...patch } : person)));
  };

  const removePerson = (id) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  const persistDatasets = (next) => {
    setDatasets(next);
    try {
      localStorage.setItem(DATASETS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable, keep in-memory only
    }
  };

  const addDataset = (dataset) => {
    persistDatasets([{ id: crypto.randomUUID(), updatedAt: new Date().toISOString().slice(0, 10), ...dataset }, ...datasets]);
  };

  const removeDataset = (id) => {
    persistDatasets(datasets.filter((d) => d.id !== id));
  };

  const addEvent = (event) => {
    setEvents((prev) => {
      const next = [event, ...prev];
      try {
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable, keep in-memory only
      }
      return next;
    });
  };

  const clearAllData = () => {
    setDatasets([]);
    setResponses([]);
    setEvents([]);
    setLastImportSummary(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EVENTS_STORAGE_KEY);
      localStorage.removeItem(DATASETS_STORAGE_KEY);
    } catch {
      // storage unavailable, in-memory state already cleared
    }
  };

  const value = useMemo(() => ({
    role,
    setRole,
    appConfig,
    products,
    people,
    responses,
    events,
    lastImportSummary,
    sidebarCollapsed,
    setSidebarCollapsed,
    importResponses,
    updateResponse,
    addTeamToProduct,
    addProduct,
    updateProduct,
    teamInfo,
    setTeamInfo,
    getTeamInfo,
    addPerson,
    updatePerson,
    removePerson,
    addEvent,
    datasets,
    addDataset,
    removeDataset,
    clearAllData
  }), [role, products, people, responses, events, teamInfo, datasets, lastImportSummary, sidebarCollapsed]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
