import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  NotificationProvider,
  NotificationContext,
} from "./contexts/NotificationContext";
import useValidation from "./hooks/useValidation";
import {
  initialMachines,
  initialAgencies,
  initialClients,
  initialOperations,
} from "./data/mockData";

import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Machines from "./pages/Machines";
import Agencies from "./pages/Agencies";
import Clients from "./pages/Clients";
import Operations from "./pages/Operations";
import Reports from "./pages/Reports";

import { Bell, ChevronDown } from "lucide-react";

const MainLayout = ({ children, user, isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState("dashboard");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setCurrentView("dashboard");
    } else {
      setCurrentView(path.substring(1));
    }
  }, [location]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        className={`flex-1 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-16"
        } transition-all duration-300`}
      >
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentView === "dashboard" && "Dashboard"}
                {currentView === "machines" && "Gestão de Máquinas"}
                {currentView === "agencies" && "Gestão de Agências"}
                {currentView === "clients" && "Gestão de Clientes"}
                {currentView === "operations" && "Operações"}
                {currentView === "reports" && "Relatórios"}
              </h1>
              <p className="text-gray-500 mt-1">
                Sistema de Gestão de Máquinas POS - Sicoob
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                aria-label="Notificações"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative">
                <button
                  className="flex items-center space-x-2"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="font-bold">{user.name.charAt(0)}</span>
                  </div>
                  {isSidebarOpen && (
                    <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [machines, setMachines] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [clients, setClients] = useState([]);
  const [operations, setOperations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { addNotification } = useContext(NotificationContext) || {
    addNotification: () => {},
  };
  const validation = useValidation();

  useEffect(() => {
    setMachines(initialMachines);
    setAgencies(initialAgencies);
    setClients(initialClients);
    setOperations(initialOperations);
    setUser({
      id: "U1",
      name: "Admin Sicoob",
      role: "super_admin",
      agencyId: null,
    });
  }, []);

  if (!user) {
    return <Login setUser={setUser} addNotification={addNotification} />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <MainLayout
          user={user}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  user={user}
                  machines={machines}
                  agencies={agencies}
                  clients={clients}
                  operations={operations}
                  addNotification={addNotification}
                />
              }
            />
            <Route
              path="/machines"
              element={
                <Machines
                  user={user}
                  machines={machines}
                  setMachines={setMachines}
                  addNotification={addNotification}
                  agencies={agencies}
                />
              }
            />
            <Route
              path="/agencies"
              element={
                <Agencies
                  user={user}
                  agencies={agencies}
                  setAgencies={setAgencies}
                  addNotification={addNotification}
                />
              }
            />
            <Route
              path="/clients"
              element={
                <Clients
                  user={user}
                  clients={clients}
                  setClients={setClients}
                  addNotification={addNotification}
                  validation={validation}
                />
              }
            />
            <Route
              path="/operations"
              element={
                <Operations
                  user={user}
                  operations={operations}
                  setOperations={setOperations}
                  machines={machines}
                  clients={clients}
                  agencies={agencies}
                  addNotification={addNotification}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <Reports
                  user={user}
                  machines={machines}
                  clients={clients}
                  operations={operations}
                  agencies={agencies}
                  addNotification={addNotification}
                />
              }
            />
          </Routes>
        </MainLayout>
      </Router>
    </ErrorBoundary>
  );
};

const AppWrapper = () => (
  <NotificationProvider>
    <App />
  </NotificationProvider>
);

export default AppWrapper;
