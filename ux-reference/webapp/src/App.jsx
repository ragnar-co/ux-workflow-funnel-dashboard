import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { NpsManagement } from "./pages/NpsManagement/NpsManagement.jsx";
import { Responses } from "./pages/Responses/Responses.jsx";
import { ResponseCenter } from "./pages/ResponseCenter.jsx";
import { ProductsTeams } from "./pages/ProductsTeams/ProductsTeams.jsx";
import { Settings } from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-result" element={<NpsManagement />} />
        <Route path="/responses" element={<Responses />} />
        <Route path="/response-center" element={<ResponseCenter />} />
        <Route path="/products-teams" element={<ProductsTeams />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
