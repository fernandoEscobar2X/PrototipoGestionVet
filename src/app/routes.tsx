import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Agenda } from "./pages/Agenda";
import { Patients } from "./pages/Patients";
import { PatientDetail } from "./pages/PatientDetail";
import { CashRegister } from "./pages/CashRegister";
import { Reports } from "./pages/Reports";
import { Alerts } from "./pages/Alerts";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: "agenda", Component: Agenda },
          { path: "patients", Component: Patients },
          { path: "patients/:id", Component: PatientDetail },
          { path: "alerts", Component: Alerts },
          { path: "cashbox", Component: CashRegister },
          { path: "reports", Component: Reports },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: () => <div className="p-8 text-center text-slate-500">Página no encontrada</div>,
  },
]);