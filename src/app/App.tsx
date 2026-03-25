import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import { Toaster } from "sonner";
import "../styles/index.css";

import { DataProvider } from "./context/DataContext";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </DataProvider>
    </AuthProvider>
  );
}
