import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Plus,
  Settings,
  RefreshCw,
  Clock,
  CreditCard,
  Database,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMachines, createMachine, updateMachine } from "../services/api";

const Machines = ({ user, addNotification, agencies }) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterAgency, setFilterAgency] = useState("");
  const [filterSerial, setFilterSerial] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [machineToEdit, setMachineToEdit] = useState(null);
  const [showMaintenanceHistory, setShowMaintenanceHistory] = useState(false);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [expandedFilters, setExpandedFilters] = useState(false);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
      } catch (error) {
        setError(error.message);
        addNotification("error", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, [addNotification]);

  // Dados para gráficos de máquina
  const warrantyStatusData = [
    {
      name: "Dentro da Garantia",
      value: machines.filter((m) => {
        const acquisitionDate = new Date(m.acquisitionDate);
        const warrantyEndDate = new Date(acquisitionDate);
        warrantyEndDate.setMonth(
          acquisitionDate.getMonth() + m.warrantyMonths
        );
        return warrantyEndDate > new Date();
      }).length,
      color: "#4ADE80",
    },
    {
      name: "Fora da Garantia",
      value: machines.filter((m) => {
        const acquisitionDate = new Date(m.acquisitionDate);
        const warrantyEndDate = new Date(acquisitionDate);
        warrantyEndDate.setMonth(
          acquisitionDate.getMonth() + m.warrantyMonths
        );
        return warrantyEndDate <= new Date();
      }).length,
      color: "#F87171",
    },
  ];

  // Filtrar máquinas
  const filteredMachines = machines.filter((machine) => {
    return (
      (filterStatus === "" || machine.status === filterStatus) &&
      (filterModel === "" || machine.model === filterModel) &&
      (filterAgency === "" || machine.status.includes(filterAgency)) &&
      (filterSerial === "" || machine.serialNumber.includes(filterSerial))
    );
  });

  // Manipuladores
  const handleEditMachine = (machine) => {
    setMachineToEdit(machine);
    setCurrentMachine({ ...machine });
    setIsModalOpen(true);
  };

  const handleNewMachine = () => {
    setMachineToEdit(null);
    setCurrentMachine({
      id: `M${machines.length + 1}`,
      model: "",
      serialNumber: "",
      fixedAssetNumber: "",
      connectionType: [],
      accessories: {
        charger: false,
        usbCable: false,
        paperRolls: 0,
        manual: false,
        protectiveFilm: false,
        simCard: {
          carrier: "",
          number: "",
        },
      },
      status: "in_stock_matrix",
      supplier: "",
      acquisitionDate: new Date().toISOString().split("T")[0],
      warrantyMonths: 24,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentMachine.model || !currentMachine.serialNumber) {
      addNotification("error", "Modelo e Número de Série são obrigatórios");
      return;
    }

    try {
      if (machineToEdit) {
        const updatedMachine = await updateMachine(
          machineToEdit.id,
          currentMachine
        );
        setMachines(
          machines.map((m) =>
            m.id === machineToEdit.id ? updatedMachine : m
          )
        );
        addNotification("success", "Máquina atualizada com sucesso!");
      } else {
        const newMachine = await createMachine(currentMachine);
        setMachines([...machines, newMachine]);
        addNotification("success", "Máquina cadastrada com sucesso!");
      }
      setIsModalOpen(false);
    } catch (error) {
      addNotification("error", error.message);
    }
  };

  const updateCurrentMachine = (field, value) => {
    setCurrentMachine((prev) => {
      const updated = { ...prev };

      if (field.includes(".")) {
        const [mainField, subField] = field.split(".");

        if (mainField === "accessories") {
          updated.accessories = {
            ...updated.accessories,
            [subField]: value,
          };
        } else if (mainField === "simCard") {
          updated.accessories.simCard = {
            ...updated.accessories.simCard,
            [subField]: value,
          };
        }
      } else {
        updated[field] = value;
      }

      return updated;
    });
  };

  const handleViewMaintenance = (machine) => {
    // Gerar histórico fictício para demonstração
    setMaintenanceHistory([
      {
        id: "MH1",
        machineId: machine.id,
        date: "2023-05-10",
        description: "Substituição da bateria",
        cost: 150.0,
        technician: "João da Manutenção",
      },
      {
        id: "MH2",
        machineId: machine.id,
        date: "2023-08-15",
        description: "Limpeza interna e atualização de firmware",
        cost: 80.0,
        technician: "Maria Técnica",
      },
    ]);
    setShowMaintenanceHistory(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_stock_matrix":
        return "bg-blue-100 text-blue-800";
      case "in_stock_agency":
        return "bg-cyan-100 text-cyan-800";
      case "rented_client":
        return "bg-green-100 text-green-800";
      case "maintenance_agency":
      case "maintenance_matrix":
        return "bg-yellow-100 text-yellow-800";
      case "returned_to_matrix":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status, machine) => {
    switch (status) {
      case "in_stock_matrix":
        return "Em Estoque (Matriz)";
      case "in_stock_agency":
        return `Em Estoque (Agência)`;
      case "rented_client":
        return "Alugada - Cliente";
      case "maintenance_agency":
        return "Em Manutenção - Agência";
      case "maintenance_matrix":
        return "Em Manutenção - Matriz";
      case "returned_to_matrix":
        return "Devolvida à Matriz";
      default:
        return status;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Máquinas</h1>
        {user?.role === "super_admin" && (
          <button
            onClick={handleNewMachine}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Máquina
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Filtros de Busca
          </h2>
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {expandedFilters ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Ocultar filtros
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Mostrar filtros
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {expandedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="status-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos os Status</option>
                    <option value="in_stock_matrix">
                      Em Estoque (Matriz)
                    </option>
                    <option value="in_stock_agency">
                      Em Estoque (Agência)
                    </option>
                    <option value="rented_client">Alugada - Cliente</option>
                    <option value="maintenance_agency">
                      Em Manutenção - Agência
                    </option>
                    <option value="maintenance_matrix">
                      Em Manutenção - Matriz
                    </option>
                    <option value="returned_to_matrix">
                      Devolvida à Matriz
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="model-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Modelo
                  </label>
                  <select
                    id="model-filter"
                    value={filterModel}
                    onChange={(e) => setFilterModel(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos os Modelos</option>
                    <option value="Ingenico APOS A8">Ingenico APOS A8</option>
                    <option value="Gertec GPOS700">Gertec GPOS700</option>
                    <option value="Outros">Outros Modelos</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="agency-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Agência
                  </label>
                  <select
                    id="agency-filter"
                    value={filterAgency}
                    onChange={(e) => setFilterAgency(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas as Agências</option>
                    {agencies.map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="serial-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nº de Série
                  </label>
                  <input
                    id="serial-filter"
                    type="text"
                    value={filterSerial}
                    onChange={(e) => setFilterSerial(e.target.value)}
                    placeholder="Digite o número de série"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gráficos de análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Status das Máquinas
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Em Estoque",
                      value: machines.filter((m) =>
                        m.status.includes("stock")
                      ).length,
                      color: "#60A5FA",
                    },
                    {
                      name: "Alugadas",
                      value: machines.filter((m) =>
                        m.status.startsWith("rented")
                      ).length,
                      color: "#34D399",
                    },
                    {
                      name: "Manutenção",
                      value: machines.filter((m) =>
                        m.status.includes("maintenance")
                      ).length,
                      color: "#F59E0B",
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    {
                      name: "Em Estoque",
                      value: machines.filter((m) =>
                        m.status.includes("stock")
                      ).length,
                      color: "#60A5FA",
                    },
                    {
                      name: "Alugadas",
                      value: machines.filter((m) =>
                        m.status.startsWith("rented")
                      ).length,
                      color: "#34D399",
                    },
                    {
                      name: "Manutenção",
                      value: machines.filter((m) =>
                        m.status.includes("maintenance")
                      ).length,
                      color: "#F59E0B",
                    },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Status da Garantia
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={warrantyStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {warrantyStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela de máquinas */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Lista de Máquinas
          </h2>
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
                  Agência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMachines.map((machine) => {
                const agencyId = machine.status.includes("agency_")
                  ? machine.status.split("_")[2]
                  : null;
                const agency = agencyId
                  ? agencies.find((a) => a.id === agencyId)
                  : null;

                return (
                  <tr
                    key={machine.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {machine.serialNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          machine.status
                        )}`}
                      >
                        {getStatusText(machine.status, machine)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {agency ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {agency.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {agency.code}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditMachine(machine)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                        aria-label="Editar máquina"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleViewMaintenance(machine)}
                        className="text-yellow-600 hover:text-yellow-900 mr-4 transition-colors"
                        aria-label="Histórico de manutenção"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          addNotification(
                            "info",
                            `Visualizar histórico da máquina ${machine.serialNumber}`
                          )
                        }
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Histórico completo"
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

        {filteredMachines.length === 0 && (
          <div className="p-8 text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Nenhuma máquina encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Nenhuma máquina corresponde aos critérios de filtro
              selecionados.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setFilterStatus("");
                  setFilterModel("");
                  setFilterAgency("");
                  setFilterSerial("");
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para registro/edição de máquina */}
      {isModalOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {machineToEdit ? "Editar Máquina" : "Nova Máquina"}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="machine-model"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Modelo da Máquina
                            </label>
                            <select
                              id="machine-model"
                              required
                              value={currentMachine?.model || ""}
                              onChange={(e) =>
                                updateCurrentMachine("model", e.target.value)
                              }
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                              <option value="">Selecione um modelo</option>
                              <option value="Ingenico APOS A8">
                                Ingenico APOS A8
                              </option>
                              <option value="Gertec GPOS700">
                                Gertec GPOS700
                              </option>
                              <option value="Outros">Outros Modelos</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="machine-serial"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Número de Série
                            </label>
                            <input
                              id="machine-serial"
                              type="text"
                              required
                              value={currentMachine?.serialNumber || ""}
                              onChange={(e) =>
                                updateCurrentMachine(
                                  "serialNumber",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="SN123456789"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="machine-asset"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Nº Patrimônio
                            </label>
                            <input
                              id="machine-asset"
                              type="text"
                              value={currentMachine?.fixedAssetNumber || ""}
                              onChange={(e) =>
                                updateCurrentMachine(
                                  "fixedAssetNumber",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="FA1001"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="machine-status"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Status
                            </label>
                            <select
                              id="machine-status"
                              value={
                                currentMachine?.status || "in_stock_matrix"
                              }
                              onChange={(e) =>
                                updateCurrentMachine("status", e.target.value)
                              }
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                              <option value="in_stock_matrix">
                                Em Estoque (Matriz)
                              </option>
                              <option value="in_stock_agency">
                                Em Estoque (Agência)
                              </option>
                              <option value="rented_client">
                                Alugada - Cliente
                              </option>
                              <option value="maintenance_agency">
                                Em Manutenção - Agência
                              </option>
                              <option value="maintenance_matrix">
                                Em Manutenção - Matriz
                              </option>
                              <option value="returned_to_matrix">
                                Devolvida à Matriz
                              </option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Acessórios Inclusos
                            </label>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="charger"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  checked={
                                    currentMachine?.accessories.charger ||
                                    false
                                  }
                                  onChange={(e) =>
                                    updateCurrentMachine(
                                      "accessories.charger",
                                      e.target.checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor="charger"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Carregador/Fonte de Alimentação
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="usbCable"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  checked={
                                    currentMachine?.accessories.usbCable ||
                                    false
                                  }
                                  onChange={(e) =>
                                    updateCurrentMachine(
                                      "accessories.usbCable",
                                      e.target.checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor="usbCable"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Cabo USB
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="paperRolls"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  checked={
                                    currentMachine?.accessories.paperRolls >
                                      0 || false
                                  }
                                  onChange={(e) =>
                                    updateCurrentMachine(
                                      "accessories.paperRolls",
                                      e.target.checked ? 1 : 0
                                    )
                                  }
                                />
                                <label
                                  htmlFor="paperRolls"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Rolo(s) de Papel
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="manual"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  checked={
                                    currentMachine?.accessories.manual ||
                                    false
                                  }
                                  onChange={(e) =>
                                    updateCurrentMachine(
                                      "accessories.manual",
                                      e.target.checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor="manual"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Manual do Usuário
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="protectiveFilm"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  checked={
                                    currentMachine?.accessories
                                      .protectiveFilm || false
                                  }
                                  onChange={(e) =>
                                    updateCurrentMachine(
                                      "accessories.protectiveFilm",
                                      e.target.checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor="protectiveFilm"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Película Protetora
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="simCard"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  checked={
                                    currentMachine?.accessories.simCard
                                      .carrier !== "" || false
                                  }
                                  onChange={(e) => {
                                    if (!e.target.checked) {
                                      updateCurrentMachine(
                                        "simCard.carrier",
                                        ""
                                      );
                                      updateCurrentMachine(
                                        "simCard.number",
                                        ""
                                      );
                                    } else {
                                      updateCurrentMachine(
                                        "simCard.carrier",
                                        "Vivo"
                                      );
                                      updateCurrentMachine(
                                        "simCard.number",
                                        "SIM123456789"
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="simCard"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Chip de Dados
                                </label>
                              </div>

                              {currentMachine?.accessories.simCard
                                .carrier && (
                                <div className="col-span-2 mt-2 ml-6">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label
                                        htmlFor="sim-carrier"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        Operadora
                                      </label>
                                      <input
                                        id="sim-carrier"
                                        type="text"
                                        placeholder="Operadora"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={
                                          currentMachine?.accessories.simCard
                                            .carrier
                                        }
                                        onChange={(e) =>
                                          updateCurrentMachine(
                                            "simCard.carrier",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="sim-number"
                                        className="block text-sm font-medium text-gray-700"
                                      >
                                        Número
                                      </label>
                                      <input
                                        id="sim-number"
                                        type="text"
                                        placeholder="Número"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={
                                          currentMachine?.accessories.simCard
                                            .number
                                        }
                                        onChange={(e) =>
                                          updateCurrentMachine(
                                            "simCard.number",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="machine-supplier"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Fornecedor
                            </label>
                            <input
                              id="machine-supplier"
                              type="text"
                              value={currentMachine?.supplier || ""}
                              onChange={(e) =>
                                updateCurrentMachine(
                                  "supplier",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="acquisition-date"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Data de Aquisição
                            </label>
                            <input
                              id="acquisition-date"
                              type="date"
                              value={currentMachine?.acquisitionDate || ""}
                              onChange={(e) =>
                                updateCurrentMachine(
                                  "acquisitionDate",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="warranty-months"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Garantia (meses)
                            </label>
                            <input
                              id="warranty-months"
                              type="number"
                              min="0"
                              value={currentMachine?.warrantyMonths || ""}
                              onChange={(e) =>
                                updateCurrentMachine(
                                  "warrantyMonths",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-4 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            {machineToEdit
                              ? "Salvar Alterações"
                              : "Cadastrar Máquina"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de histórico de manutenção */}
      {showMaintenanceHistory && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="maintenance-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="maintenance-modal-title"
                    >
                      Histórico de Manutenção
                    </h3>
                    <div className="mt-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descrição
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Custo
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Técnico
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {maintenanceHistory.map((record) => (
                              <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(record.date).toLocaleDateString(
                                    "pt-BR"
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {record.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  R$ {record.cost.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {record.technician}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {maintenanceHistory.length === 0 && (
                        <div className="text-center py-8">
                          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <h3 className="text-lg font-medium text-gray-900">
                            Nenhum histórico de manutenção
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Esta máquina não possui registros de manutenção.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowMaintenanceHistory(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Machines;
