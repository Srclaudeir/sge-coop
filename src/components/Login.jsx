import React, { useState } from "react";
import { AlertCircle, CreditCard } from "lucide-react";

const Login = ({ setUser, addNotification }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      (username === "admin" && password === "admin") ||
      (username === "gestor" && password === "gestor")
    ) {
      setUser({
        id: username === "admin" ? "U1" : "U2",
        name: username === "admin" ? "Admin Sicoob" : "Gestor de Agência",
        role: username === "admin" ? "super_admin" : "agency_manager",
        agencyId: username === "admin" ? null : "A1",
      });
      addNotification("success", "Login realizado com sucesso!");
    } else {
      setError("Credenciais inválidas. Tente novamente.");
      addNotification("error", "Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <CreditCard className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Gestão de Máquinas POS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sicoob - Cooperativas de Crédito
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Para demonstração:</p>
            <p>
              Admin: usuário <strong>admin</strong> / senha <strong>admin</strong>
            </p>
            <p>
              Gestor: usuário <strong>gestor</strong> / senha <strong>gestor</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
