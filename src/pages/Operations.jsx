import React, { useState } from "react";
import { Truck, RefreshCw, Calendar, Users, CreditCard } from "lucide-react";

const Operations = ({
  user,
  operations,
  setOperations,
  machines,
  clients,
  addNotification,
}) => {
  const [currentOperation, setCurrentOperation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentalData, setRentalData] = useState({
    clientId: "",
    machineId: "",
    monthlyRent: "",
    startDate: new Date().toISOString().split("T")[0],
    contract: null,
    operationId: "",
    endDate: new Date().toISOString().split("T")[0],
    chargerReturn: false,
    usbCableReturn: false,
    paperRollsReturn: false,
    simCardReturn: false,
    protectiveFilmReturn: false,
    manualReturn: false,
    returnNotes: "",
  });

  const handleRentMachine = () => {
    setCurrentOperation("rent");
    setIsModalOpen(true);
  };

  const handleReturnMachine = () => {
    setCurrentOperation("return");
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentOperation === "rent") {
      // Validate required fields
      if (
        !rentalData.clientId ||
        !rentalData.machineId ||
        !rentalData.monthlyRent
      ) {
        addNotification(
          "error",
          "Por favor, preencha todos os campos obrigatórios"
        );
        return;
      }

      // Create new rental operation
      const newOperation = {
        id: `OP${operations.length + 1}`,
        machineId: rentalData.machineId,
        clientId: rentalData.clientId,
        agencyId: user.agencyId || "A1", // In a real app, this would come from user context
        type: "rental",
        startDate: rentalData.startDate,
        endDate: null,
        monthlyRent: parseFloat(rentalData.monthlyRent),
        contract: rentalData.contract,
        status: "active",
      };

      // Update machine status
      const updatedMachines = machines.map((machine) => {
        if (machine.id === rentalData.machineId) {
          return {
            ...machine,
            status: `rented_client_${rentalData.clientId}`,
          };
        }
        return machine;
      });

      // Add new operation
      setOperations([...operations, newOperation]);
      addNotification("success", "Aluguel registrado com sucesso!");

      // In a real app, we would update the machines state here
      // For this demo, we're just logging it
      console.log("Updated machines:", updatedMachines);
    } else if (currentOperation === "return") {
      // Handle return operation
      const operation = operations.find(
        (op) => op.id === rentalData.operationId
      );
      const machine = machines.find((m) => m.id === operation.machineId);

      // Update operation with end date
      const updatedOperations = operations.map((op) =>
        op.id === rentalData.operationId
          ? { ...op, endDate: rentalData.endDate, status: "returned" }
          : op
      );

      // Update machine status
      const updatedMachines = machines.map((m) =>
        m.id === machine.id ? { ...m, status: "returned_to_matrix" } : m
      );

      setOperations(updatedOperations);
      addNotification("success", "Devolução registrada com sucesso!");

      // In a real app, we would update the machines state here
      // For this demo, we're just logging it
      console.log("Updated machines:", updatedMachines);
    }

    setIsModalOpen(false);
  };

  const updateRentalData = (field, value) => {
    setRentalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Operações</h1>
        {user?.role === "agency_manager" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRentMachine}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors flex items-center"
            >
              <Truck className="w-5 h-5 mr-2" />
              Alugar Máquina
            </button>
            <button
              onClick={handleReturnMachine}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded shadow transition-colors flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Devolver Máquina
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                  Valor Mensal
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
              {operations.map((operation) => (
                <tr
                  key={operation.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      {new Date(operation.startDate).toLocaleDateString(
                        "pt-BR"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-2" />
                      {clients.find((c) => c.id === operation.clientId)
                        ?.name || `Cliente ${operation.clientId}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                      {machines.find((m) => m.id === operation.machineId)
                        ?.serialNumber || operation.machineId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {operation.monthlyRent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        operation.status === "active"
                          ? "bg-green-100 text-green-800"
                          : operation.status === "returned"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {operation.status === "active"
                        ? "Ativo"
                        : operation.status === "returned"
                        ? "Devolvido"
                        : "Encerrado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        addNotification(
                          "info",
                          `Visualizar contrato ${operation.contract}`
                        )
                      }
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                    >
                      Contrato
                    </button>
                    <button
                      onClick={() =>
                        addNotification(
                          "info",
                          `Visualizar histórico da operação ${operation.id}`
                        )
                      }
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Histórico
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for rental operation */}
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
                      {currentOperation === "rent"
                        ? "Alugar Máquina"
                        : "Devolver Máquina"}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {currentOperation === "rent" ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label
                                  htmlFor="client-select"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Cliente
                                </label>
                                <select
                                  id="client-select"
                                  value={rentalData.clientId}
                                  onChange={(e) =>
                                    updateRentalData(
                                      "clientId",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  required
                                >
                                  <option value="">
                                    Selecione um cliente
                                  </option>
                                  {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                      {client.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label
                                  htmlFor="machine-select"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Máquina
                                </label>
                                <select
                                  id="machine-select"
                                  value={rentalData.machineId}
                                  onChange={(e) =>
                                    updateRentalData(
                                      "machineId",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  required
                                >
                                  <option value="">
                                    Selecione uma máquina disponível
                                  </option>
                                  {machines
                                    .filter((machine) => {
                                      const operation = operations.find(
                                        (op) =>
                                          op.machineId === machine.id &&
                                          !op.endDate
                                      );
                                      return !operation;
                                    })
                                    .map((machine) => {
                                      const operation = operations.find(
                                        (op) =>
                                          op.machineId === machine.id &&
                                          !op.endDate
                                      );
                                      const client = clients.find(
                                        (c) => c.id === operation?.clientId
                                      );
                                      return (
                                        <option
                                          key={machine.id}
                                          value={machine.id}
                                        >
                                          {machine.serialNumber} -{" "}
                                          {client?.name ||
                                            `Cliente ${operation?.clientId}`}
                                        </option>
                                      );
                                    })}
                                </select>
                              </div>
                              <div>
                                <label
                                  htmlFor="monthly-rent"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Valor Mensal (R$)
                                </label>
                                <input
                                  id="monthly-rent"
                                  type="number"
                                  value={rentalData.monthlyRent}
                                  onChange={(e) =>
                                    updateRentalData(
                                      "monthlyRent",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  required
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="rent-start-date"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Data de Início
                                </label>
                                <input
                                  id="rent-start-date"
                                  type="date"
                                  value={rentalData.startDate}
                                  onChange={(e) =>
                                    updateRentalData(
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="contract-file"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Contrato
                              </label>
                              <input
                                id="contract-file"
                                type="file"
                                accept=".pdf"
                                required
                                onChange={(e) =>
                                  updateRentalData(
                                    "contract",
                                    e.target.files[0]
                                  )
                                }
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label
                                  htmlFor="operation-select"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Aluguel Ativo
                                </label>
                                <select
                                  id="operation-select"
                                  value={rentalData.operationId}
                                  onChange={(e) =>
                                    updateRentalData(
                                      "operationId",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  required
                                >
                                  <option value="">
                                    Selecione um aluguel ativo
                                  </option>
                                  {operations
                                    .filter((op) => op.status === "active")
                                    .map((operation) => {
                                      const client = clients.find(
                                        (c) => c.id === operation.clientId
                                      );
                                      return (
                                        <option
                                          key={operation.id}
                                          value={operation.id}
                                        >
                                          {client?.name ||
                                            `Cliente ${operation.clientId}`}{" "}
                                          -{" "}
                                          {
                                            machines.find(
                                              (m) =>
                                                m.id === operation.machineId
                                            )?.serialNumber
                                          }
                                        </option>
                                      );
                                    })}
                                </select>
                              </div>
                              <div>
                                <label
                                  htmlFor="return-date"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Data de Devolução
                                </label>
                                <input
                                  id="return-date"
                                  type="date"
                                  value={rentalData.endDate}
                                  onChange={(e) =>
                                    updateRentalData(
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  required
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Checklist de Devolução
                              </label>
                              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="chargerReturn"
                                    checked={rentalData.chargerReturn}
                                    onChange={(e) =>
                                      updateRentalData(
                                        "chargerReturn",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor="chargerReturn"
                                    className="ml-2 block text-sm text-gray-700"
                                  >
                                    Carregador
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="usbCableReturn"
                                    checked={rentalData.usbCableReturn}
                                    onChange={(e) =>
                                      updateRentalData(
                                        "usbCableReturn",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor="usbCableReturn"
                                    className="ml-2 block text-sm text-gray-700"
                                  >
                                    Cabo USB
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="paperRollsReturn"
                                    checked={rentalData.paperRollsReturn}
                                    onChange={(e) =>
                                      updateRentalData(
                                        "paperRollsReturn",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor="paperRollsReturn"
                                    className="ml-2 block text-sm text-gray-700"
                                  >
                                    Papel Térmico
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="simCardReturn"
                                    checked={rentalData.simCardReturn}
                                    onChange={(e) =>
                                      updateRentalData(
                                        "simCardReturn",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor="simCardReturn"
                                    className="ml-2 block text-sm text-gray-700"
                                  >
                                    Chip de Dados
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="protectiveFilmReturn"
                                    checked={rentalData.protectiveFilmReturn}
                                    onChange={(e) =>
                                      updateRentalData(
                                        "protectiveFilmReturn",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor="protectiveFilmReturn"
                                    className="ml-2 block text-sm text-gray-700"
                                  >
                                    Película Protetora
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="manualReturn"
                                    checked={rentalData.manualReturn}
                                    onChange={(e) =>
                                      updateRentalData(
                                        "manualReturn",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor="manualReturn"
                                    className="ml-2 block text-sm text-gray-700"
                                  >
                                    Manual do Usuário
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="return-notes"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Observações
                              </label>
                              <textarea
                                id="return-notes"
                                value={rentalData.returnNotes}
                                onChange={(e) =>
                                  updateRentalData(
                                    "returnNotes",
                                    e.target.value
                                  )
                                }
                                rows="3"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Observações sobre a condição da máquina..."
                              ></textarea>
                            </div>
                          </>
                        )}
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
                            {currentOperation === "rent"
                              ? "Registrar Aluguel"
                              : "Confirmar Devolução"}
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
    </div>
  );
};

export default Operations;
