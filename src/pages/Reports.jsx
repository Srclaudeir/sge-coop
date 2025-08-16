import React, { useState } from "react";
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
  ResponsiveContainer,
} from "recharts";
import {
  Phone,
  Mail,
  CreditCard,
  Users,
  Truck,
  RefreshCw,
} from "lucide-react";

const Reports = ({ user, machines, clients, operations, agencies, addNotification }) => {
  const [reportType, setReportType] = useState("machineHistory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const handleSearch = (e) => {
    e.preventDefault();

    if (reportType === "machineHistory" && !searchTerm) {
      addNotification(
        "warning",
        "Por favor, insira um número de série ou ID da máquina"
      );
      return;
    }

    if (reportType === "machinesByClient" && !searchTerm) {
      addNotification(
        "warning",
        "Por favor, insira um nome ou documento do cliente"
      );
      return;
    }

    if (reportType === "activeContracts" && !dateRange.start) {
      addNotification("warning", "Por favor, selecione uma data de início");
      return;
    }

    if (reportType === "inventoryByAgency" && !searchTerm) {
      addNotification(
        "warning",
        "Por favor, insira o nome ou código da agência"
      );
      return;
    }

    // Simular resultados da busca
    if (reportType === "machineHistory") {
      const machine = machines.find(
        (m) => m.serialNumber.includes(searchTerm) || m.id === searchTerm
      );

      if (machine) {
        setSelectedMachine(machine);
        addNotification(
          "success",
          `Histórico da máquina ${machine.serialNumber} carregado com sucesso!`
        );
      } else {
        addNotification("error", "Máquina não encontrada");
        setSelectedMachine(null);
      }
    }

    if (reportType === "machinesByClient") {
      const client = clients.find(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.document.includes(searchTerm)
      );

      if (client) {
        setSelectedClient(client);
        addNotification(
          "success",
          `Máquinas do cliente ${client.name} carregadas com sucesso!`
        );
      } else {
        addNotification("error", "Cliente não encontrado");
        setSelectedClient(null);
      }
    }

    if (reportType === "inventoryByAgency") {
      const agency = agencies.find(
        (a) =>
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.code.includes(searchTerm)
      );

      if (agency) {
        setSelectedAgency(agency);
        addNotification(
          "success",
          `Inventário da agência ${agency.name} carregado com sucesso!`
        );
      } else {
        addNotification("error", "Agência não encontrada");
        setSelectedAgency(null);
      }
    }
  };

  // Dados para gráficos
  const getMachineStatusData = (machines) => {
    return [
      {
        name: "Em Estoque",
        value: machines.filter((m) => m.status.includes("stock")).length,
        color: "#60A5FA",
      },
      {
        name: "Alugadas",
        value: machines.filter((m) => m.status.startsWith("rented")).length,
        color: "#34D399",
      },
      {
        name: "Manutenção",
        value: machines.filter((m) => m.status.includes("maintenance"))
          .length,
        color: "#F59E0B",
      },
    ];
  };

  const getClientMachinesData = (clientMachines) => {
    return clientMachines.map((machine) => ({
      name: machine.model,
      value: 1,
      color: machine.status === "rented_client" ? "#34D399" : "#60A5FA",
    }));
  };

  const getRevenueData = () => {
    return operations
      .filter((op) => op.status === "active")
      .map((op) => ({
        date: op.startDate,
        revenue: op.monthlyRent,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatórios</h1>

      {/* Tipos de relatório */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setReportType("machineHistory")}
            className={`px-4 py-2 rounded transition-colors ${
              reportType === "machineHistory"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Histórico Completo da Máquina
          </button>
          <button
            onClick={() => setReportType("machinesByClient")}
            className={`px-4 py-2 rounded transition-colors ${
              reportType === "machinesByClient"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Máquinas por Cliente
          </button>
          <button
            onClick={() => setReportType("activeContracts")}
            className={`px-4 py-2 rounded transition-colors ${
              reportType === "activeContracts"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Contratos Ativos
          </button>
          <button
            onClick={() => setReportType("inventoryByAgency")}
            className={`px-4 py-2 rounded transition-colors ${
              reportType === "inventoryByAgency"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Inventário por Agência
          </button>
        </div>

        {/* Formulário de busca */}
        <form onSubmit={handleSearch} className="mb-6">
          {reportType === "machineHistory" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="machine-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Número de Série ou ID da Máquina
                </label>
                <input
                  id="machine-search"
                  type="text"
                  placeholder="Digite o número de série ou ID"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors w-full"
                >
                  Buscar Máquina
                </button>
              </div>
            </div>
          )}

          {reportType === "machinesByClient" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="client-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome ou Documento do Cliente
                </label>
                <input
                  id="client-search"
                  type="text"
                  placeholder="Digite o nome ou documento"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors w-full"
                >
                  Buscar Cliente
                </button>
              </div>
            </div>
          )}

          {reportType === "activeContracts" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="contract-start-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data Início
                </label>
                <input
                  id="contract-start-date"
                  type="date"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="contract-end-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data Fim
                </label>
                <input
                  id="contract-end-date"
                  type="date"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors w-full"
                >
                  Buscar Contratos
                </button>
              </div>
            </div>
          )}

          {reportType === "inventoryByAgency" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="agency-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome ou Código da Agência
                </label>
                <input
                  id="agency-search"
                  type="text"
                  placeholder="Digite o nome ou código da agência"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors w-full"
                >
                  Buscar Inventário
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6">
          <p className="text-gray-500">
            {reportType === "machineHistory" &&
              "Insira o número de série ou ID da máquina para visualizar seu histórico completo."}
            {reportType === "machinesByClient" &&
              "Insira o nome ou documento do cliente para visualizar as máquinas associadas."}
            {reportType === "activeContracts" &&
              "Selecione o período para visualizar os contratos ativos e a receita gerada."}
            {reportType === "inventoryByAgency" &&
              "Insira o nome ou código da agência para visualizar seu inventário de máquinas."}
          </p>
        </div>
      </div>

      {/* Resultados do relatório */}
      {reportType === "machineHistory" && selectedMachine && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Informações da Máquina
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Modelo
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {selectedMachine.model}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nº de Série
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {selectedMachine.serialNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Nº Patrimônio
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {selectedMachine.fixedAssetNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedMachine.status === "in_stock_matrix"
                        ? "bg-blue-100 text-blue-800"
                        : selectedMachine.status.startsWith("rented")
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedMachine.status === "in_stock_matrix"
                      ? "Em Estoque (Matriz)"
                      : selectedMachine.status.startsWith("rented")
                      ? "Alugada"
                      : "Em Manutenção"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Fornecedor
                  </label>
                  <p className="mt-1 text-gray-900">
                    {selectedMachine.supplier}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Data de Aquisição
                  </label>
                  <p className="mt-1 text-gray-900">
                    {new Date(
                      selectedMachine.acquisitionDate
                    ).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Histórico Completo
              </h2>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getMachineStatusData([selectedMachine])}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Últimas Operações
                </h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {operations
                      .filter((op) => op.machineId === selectedMachine.id)
                      .slice(0, 5)
                      .map((operation, index) => {
                        const client = clients.find(
                          (c) => c.id === operation.clientId
                        );
                        return (
                          <li key={operation.id}>
                            <div className="relative pb-8">
                              {index !== 3 && (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                ></span>
                              )}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span
                                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                      operation.type === "rental"
                                        ? "bg-green-500"
                                        : "bg-blue-500"
                                    }`}
                                  >
                                    {operation.type === "rental" ? (
                                      <Truck className="h-5 w-5 text-white" />
                                    ) : (
                                      <RefreshCw className="h-5 w-5 text-white" />
                                    )}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      <span className="font-medium text-gray-900">
                                        {operation.type === "rental"
                                          ? "Aluguel"
                                          : "Devolução"}{" "}
                                        para {client?.name || "Cliente"}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <time>
                                      {new Date(
                                        operation.startDate
                                      ).toLocaleDateString("pt-BR")}
                                    </time>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "machinesByClient" && selectedClient && (
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Máquinas do Cliente
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedClient.name} ({selectedClient.document})
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {
                    operations.filter(
                      (op) =>
                        op.clientId === selectedClient.id &&
                        op.status === "active"
                    ).length
                  }{" "}
                  máquinas ativas
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Informações do Cliente
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Tipo
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedClient.type === "pf"
                          ? "Pessoa Física"
                          : "Pessoa Jurídica"}
                      </p>
                    </div>
                    {selectedClient.type === "pj" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Nome do Responsável
                        </label>
                        <p className="mt-1 text-gray-900">
                          {selectedClient.responsibleName}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Contato
                      </label>
                      <p className="mt-1 text-gray-900">
                        <Phone className="w-4 h-4 inline mr-1 text-gray-400" />
                        {selectedClient.contact.phone} <br />
                        <Mail className="w-4 h-4 inline mr-1 text-gray-400" />
                        {selectedClient.contact.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Endereço de Instalação
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedClient.installationAddress.street},{" "}
                        {selectedClient.installationAddress.number} <br />
                        {selectedClient.installationAddress.neighborhood}{" "}
                        <br />
                        {selectedClient.installationAddress.city}/
                        {selectedClient.installationAddress.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getClientMachinesData(
                          machines.filter((m) => {
                            const operation = operations.find(
                              (op) =>
                                op.machineId === m.id &&
                                op.clientId === selectedClient.id &&
                                op.status === "active"
                            );
                            return !!operation;
                          })
                        )}
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
                        {getClientMachinesData(
                          machines.filter((m) => {
                            const operation = operations.find(
                              (op) =>
                                op.machineId === m.id &&
                                op.clientId === selectedClient.id &&
                                op.status === "active"
                            );
                            return !!operation;
                          })
                        ).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modelo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nº Série
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data do Aluguel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor Mensal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {machines
                        .filter((machine) => {
                          const operation = operations.find(
                            (op) =>
                              op.machineId === machine.id &&
                              op.clientId === selectedClient.id &&
                              op.status === "active"
                          );
                          return !!operation;
                        })
                        .map((machine) => {
                          const operation = operations.find(
                            (op) =>
                              op.machineId === machine.id &&
                              op.clientId === selectedClient.id &&
                              op.status === "active"
                          );

                          return (
                            <tr key={machine.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {machine.model}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {machine.fixedAssetNumber}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                {machine.serialNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                {new Date(
                                  operation.startDate
                                ).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                R$ {operation.monthlyRent.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Ativo
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "activeContracts" && (
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Contratos Ativos
                </h2>
                <p className="text-gray-600 mt-1">
                  Relatório de contratos ativos e receita gerada
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {operations.filter((op) => op.status === "active").length}{" "}
                  contratos ativos
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Total de Máquinas Alugadas
                  </p>
                  <p className="mt-1 text-3xl font-bold text-blue-900">
                    {operations.filter((op) => op.status === "active").length}
                  </p>
                </div>
              </div>
              <div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    Receita Mensal
                  </p>
                  <p className="mt-1 text-3xl font-bold text-green-900">
                    R${" "}
                    {operations
                      .filter((op) => op.status === "active")
                      .reduce((sum, op) => sum + op.monthlyRent, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">
                    Clientes Ativos
                  </p>
                  <p className="mt-1 text-3xl font-bold text-purple-900">
                    {
                      new Set(
                        operations
                          .filter((op) => op.status === "active")
                          .map((op) => op.clientId)
                      ).size
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="h-96 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getRevenueData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(str) =>
                      new Date(str).toLocaleDateString("pt-BR")
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(str) =>
                      `Data: ${new Date(str).toLocaleDateString("pt-BR")}`
                    }
                    formatter={(value) => [`R$ ${value.toFixed(2)}`, "Valor"]}
                  />
                  <Bar dataKey="revenue" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Máquina
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Início
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Mensal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {operations
                    .filter((op) => op.status === "active")
                    .map((operation) => {
                      const machine = machines.find(
                        (m) => m.id === operation.machineId
                      );
                      const client = clients.find(
                        (c) => c.id === operation.clientId
                      );

                      return (
                        <tr key={operation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users className="w-5 h-5 text-gray-400 mr-2" />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {client?.name || "Cliente"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {client?.document}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {machine?.model || "Máquina"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {machine?.serialNumber}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {new Date(operation.startDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            R$ {operation.monthlyRent.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Ativo
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportType === "inventoryByAgency" && selectedAgency && (
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Inventário da Agência
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedAgency.name} ({selectedAgency.code})
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {
                    machines.filter((m) => {
                      const status = m.status;
                      return (
                        status === `in_stock_agency_${selectedAgency.id}` ||
                        status.startsWith(
                          `rented_client_${selectedAgency.id}_`
                        )
                      );
                    }).length
                  }{" "}
                  máquinas
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4 h-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Informações da Agência
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Endereço
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedAgency.address.street},{" "}
                        {selectedAgency.address.number} <br />
                        {selectedAgency.address.neighborhood} <br />
                        {selectedAgency.address.city}/
                        {selectedAgency.address.state}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Contato
                      </label>
                      <p className="mt-1 text-gray-900">
                        <Phone className="w-4 h-4 inline mr-1 text-gray-400" />
                        {selectedAgency.contact.phone} <br />
                        <Mail className="w-4 h-4 inline mr-1 text-gray-400" />
                        {selectedAgency.contact.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Gestor
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedAgency.manager}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Em Estoque
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-900">
                      {
                        machines.filter(
                          (m) =>
                            m.status ===
                            `in_stock_agency_${selectedAgency.id}`
                        ).length
                      }
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-900">
                      Alugadas
                    </p>
                    <p className="mt-1 text-2xl font-bold text-green-900">
                      {
                        machines.filter((m) =>
                          m.status.startsWith(
                            `rented_client_${selectedAgency.id}_`
                          )
                        ).length
                      }
                    </p>
                  </div>
                </div>

                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Em Estoque",
                            value: machines.filter(
                              (m) =>
                                m.status ===
                                `in_stock_agency_${selectedAgency.id}`
                            ).length,
                            color: "#60A5FA",
                          },
                          {
                            name: "Alugadas",
                            value: machines.filter((m) =>
                              m.status.startsWith(
                                `rented_client_${selectedAgency.id}_`
                              )
                            ).length,
                            color: "#34D399",
                          },
                        ]}
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
                        {[
                          {
                            name: "Em Estoque",
                            value: machines.filter(
                              (m) =>
                                m.status ===
                                `in_stock_agency_${selectedAgency.id}`
                            ).length,
                            color: "#60A5FA",
                          },
                          {
                            name: "Alugadas",
                            value: machines.filter((m) =>
                              m.status.startsWith(
                                `rented_client_${selectedAgency.id}_`
                              )
                            ).length,
                            color: "#34D399",
                          },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modelo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nº Série
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {machines
                        .filter((machine) => {
                          const status = machine.status;
                          return (
                            status ===
                              `in_stock_agency_${selectedAgency.id}` ||
                            status.startsWith(
                              `rented_client_${selectedAgency.id}_`
                            )
                          );
                        })
                        .map((machine) => {
                          let client = null;
                          if (machine.status.startsWith("rented_client_")) {
                            const clientId = machine.status.split("_")[3];
                            client = clients.find((c) => c.id === clientId);
                          }

                          return (
                            <tr key={machine.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {machine.model}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {machine.fixedAssetNumber}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                {machine.serialNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    machine.status ===
                                    `in_stock_agency_${selectedAgency.id}`
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {machine.status ===
                                  `in_stock_agency_${selectedAgency.id}`
                                    ? "Em Estoque"
                                    : "Alugada"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {client ? (
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {client.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {client.document}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
