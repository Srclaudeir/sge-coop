import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Truck,
  Database,
  Users,
  CreditCard,
  MapPin,
  ArrowRight,
  Calendar,
  Clock,
  File,
} from "lucide-react";

const Dashboard = ({ user, machines, agencies, clients, operations, addNotification }) => {
  // Dados para gráficos
  const machineStatusData = [
    {
      name: "Em Estoque (Matriz)",
      value: machines.filter((m) => m.status === "in_stock_matrix").length,
      color: "#93C5FD",
    },
    {
      name: "Em Estoque (Agência)",
      value: machines.filter((m) => m.status.startsWith("in_stock_agency_"))
        .length,
      color: "#60A5FA",
    },
    {
      name: "Alugadas",
      value: machines.filter((m) => m.status.startsWith("rented_client_"))
        .length,
      color: "#3B82F6",
    },
    {
      name: "Em Manutenção",
      value: machines.filter(
        (m) =>
          m.status === "maintenance_agency" ||
          m.status === "maintenance_matrix"
      ).length,
      color: "#1D4ED8",
    },
  ];

  const machineModelData = [
    {
      name: "Ingenico APOS A8",
      value: machines.filter((m) => m.model === "Ingenico APOS A8").length,
      color: "#86EFAC",
    },
    {
      name: "Gertec GPOS700",
      value: machines.filter((m) => m.model === "Gertec GPOS700").length,
      color: "#4ADE80",
    },
    {
      name: "Outros",
      value: machines.filter(
        (m) => !["Ingenico APOS A8", "Gertec GPOS700"].includes(m.model)
      ).length,
      color: "#15803D",
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 1500 },
    { month: "Fev", revenue: 1800 },
    { month: "Mar", revenue: 1650 },
    { month: "Abr", revenue: 2100 },
    { month: "Mai", revenue: 2300 },
    { month: "Jun", revenue: 2500 },
  ];

  // Calculando métricas
  const totalMachines = machines.length;
  const inStockMatrix = machines.filter(
    (m) => m.status === "in_stock_matrix"
  ).length;
  const rented = machines.filter((m) =>
    m.status.startsWith("rented_client_")
  ).length;

  // Calculando receita mensal
  const monthlyRevenue = operations
    .filter((op) => op.status === "active")
    .reduce((sum, op) => sum + op.monthlyRent, 0);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Truck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total de Máquinas
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {totalMachines}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
              <Database className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Em Estoque (Matriz)
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {inStockMatrix}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alugadas</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {rented}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-violet-100 text-violet-600">
              <CreditCard className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Receita Mensal
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                R$ {monthlyRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico de status das máquinas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Distribuição por Status
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={machineStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {machineStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de receita */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Receita Mensal (Últimos 6 Meses)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico de modelos */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Distribuição por Modelo
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={machineModelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {machineModelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mapa de distribuição simulado */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Mapa de Distribuição por Estado
          </h2>
          <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              Mapa de distribuição geográfica das máquinas
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">SP - 12 máquinas</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">RJ - 8 máquinas</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm">MG - 6 máquinas</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm">RS - 4 máquinas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Últimas operações */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Últimas Operações
          </h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            Ver todas <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Máquina
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operations.slice(0, 5).map((operation) => {
                const machine = machines.find(
                  (m) => m.id === operation.machineId
                );
                const client = clients.find(
                  (c) => c.id === operation.clientId
                );

                return (
                  <tr
                    key={operation.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(operation.startDate).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        {client?.name || operation.clientId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                        {machine?.serialNumber || operation.machineId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {operation.type === "rental"
                          ? "Aluguel"
                          : "Devolução"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          operation.status === "active"
                            ? "bg-green-100 text-green-800"
                            : operation.status === "returned"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {operation.status === "active"
                          ? "Ativo"
                          : "Encerrado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          addNotification(
                            "info",
                            `Visualizando contrato da operação ${operation.id}`
                          )
                        }
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                        aria-label="Visualizar contrato"
                      >
                        <File className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          addNotification(
                            "info",
                            `Visualizando histórico da operação ${operation.id}`
                          )
                        }
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Visualizar histórico"
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
