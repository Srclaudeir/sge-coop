import React, { useState } from "react";
import { Plus, Settings, CreditCard, Building } from "lucide-react";

const Agencies = ({ user, agencies, setAgencies, addNotification }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAgency, setCurrentAgency] = useState(null);
  const [agencyToEdit, setAgencyToEdit] = useState(null);

  const handleEditAgency = (agency) => {
    setAgencyToEdit(agency);
    setCurrentAgency({ ...agency });
    setIsModalOpen(true);
  };

  const handleNewAgency = () => {
    setAgencyToEdit(null);
    setCurrentAgency({
      id: `A${agencies.length + 1}`,
      name: "",
      code: "",
      address: {
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      },
      contact: {
        phone: "",
        email: "",
      },
      manager: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentAgency?.name || !currentAgency?.code) {
      addNotification("error", "Nome e Código da agência são obrigatórios");
      return;
    }

    if (agencyToEdit) {
      // Update existing agency
      setAgencies(
        agencies.map((a) =>
          a.id === agencyToEdit.id ? { ...currentAgency } : a
        )
      );
      addNotification("success", "Agência atualizada com sucesso!");
    } else {
      // Add new agency
      setAgencies([...agencies, { ...currentAgency }]);
      addNotification("success", "Agência cadastrada com sucesso!");
    }

    setIsModalOpen(false);
  };

  const updateCurrentAgency = (field, value) => {
    setCurrentAgency((prev) => {
      const updated = { ...prev };

      if (field.startsWith("address.")) {
        const subField = field.split(".")[1];
        updated.address = {
          ...updated.address,
          [subField]: value,
        };
      } else if (field.startsWith("contact.")) {
        const subField = field.split(".")[1];
        updated.contact = {
          ...updated.contact,
          [subField]: value,
        };
      } else {
        updated[field] = value;
      }

      return updated;
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Agências</h1>
        {user?.role === "super_admin" && (
          <button
            onClick={handleNewAgency}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Agência
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gestor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agencies.map((agency) => (
                <tr
                  key={agency.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {agency.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Agência #{agency.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {agency.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {agency.address.street}, {agency.address.number} -{" "}
                      {agency.address.city}/{agency.address.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {agency.contact.phone} <br /> {agency.contact.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {agency.manager}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditAgency(agency)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      aria-label="Editar agência"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        addNotification(
                          "info",
                          `Visualizar máquinas da agência ${agency.name}`
                        )
                      }
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="Visualizar máquinas"
                    >
                      <CreditCard className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {agencies.length === 0 && (
          <div className="p-8 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Nenhuma agência cadastrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Nenhuma agência foi cadastrada ainda.
            </p>
            {user?.role === "super_admin" && (
              <div className="mt-6">
                <button
                  onClick={handleNewAgency}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Cadastre sua primeira agência
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para registro/edição de agência */}
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
                      {agencyToEdit ? "Editar Agência" : "Nova Agência"}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="agency-name"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Nome da Agência
                            </label>
                            <input
                              id="agency-name"
                              type="text"
                              required
                              value={currentAgency?.name || ""}
                              onChange={(e) =>
                                updateCurrentAgency("name", e.target.value)
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="agency-code"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Código da Agência
                            </label>
                            <input
                              id="agency-code"
                              type="text"
                              required
                              value={currentAgency?.code || ""}
                              onChange={(e) =>
                                updateCurrentAgency("code", e.target.value)
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Ex: 001"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <h3 className="text-md font-medium text-gray-700 mb-2">
                              Endereço
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label
                                  htmlFor="agency-cep"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  CEP
                                </label>
                                <input
                                  id="agency-cep"
                                  type="text"
                                  value={currentAgency?.address.cep || ""}
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "address.cep",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="agency-street"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Logradouro
                                </label>
                                <input
                                  id="agency-street"
                                  type="text"
                                  value={currentAgency?.address.street || ""}
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "address.street",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="agency-number"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Número
                                </label>
                                <input
                                  id="agency-number"
                                  type="text"
                                  value={currentAgency?.address.number || ""}
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "address.number",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div>
                                <label
                                  htmlFor="agency-complement"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Complemento
                                </label>
                                <input
                                  id="agency-complement"
                                  type="text"
                                  value={
                                    currentAgency?.address.complement || ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "address.complement",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="agency-neighborhood"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Bairro
                                </label>
                                <input
                                  id="agency-neighborhood"
                                  type="text"
                                  value={
                                    currentAgency?.address.neighborhood || ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "address.neighborhood",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="agency-city"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Cidade
                                </label>
                                <input
                                  id="agency-city"
                                  type="text"
                                  value={currentAgency?.address.city || ""}
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "address.city",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <label
                                  htmlFor="agency-state"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Estado
                                </label>
                                <select
                                  id="agency-state"
                                  value={currentAgency?.address.state || ""}
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "address.state",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                  <option value="">
                                    Selecione um estado
                                  </option>
                                  <option value="AC">AC</option>
                                  <option value="AL">AL</option>
                                  <option value="AP">AP</option>
                                  <option value="AM">AM</option>
                                  <option value="BA">BA</option>
                                  <option value="CE">CE</option>
                                  <option value="DF">DF</option>
                                  <option value="ES">ES</option>
                                  <option value="GO">GO</option>
                                  <option value="MA">MA</option>
                                  <option value="MT">MT</option>
                                  <option value="MS">MS</option>
                                  <option value="MG">MG</option>
                                  <option value="PA">PA</option>
                                  <option value="PB">PB</option>
                                  <option value="PR">PR</option>
                                  <option value="PE">PE</option>
                                  <option value="PI">PI</option>
                                  <option value="RJ">RJ</option>
                                  <option value="RN">RN</option>
                                  <option value="RS">RS</option>
                                  <option value="RO">RO</option>
                                  <option value="RR">RR</option>
                                  <option value="SC">SC</option>
                                  <option value="SP">SP</option>
                                  <option value="SE">SE</option>
                                  <option value="TO">TO</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <h3 className="text-md font-medium text-gray-700 mb-2">
                              Contato
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="agency-phone"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Telefone
                                </label>
                                <input
                                  id="agency-phone"
                                  type="text"
                                  value={currentAgency?.contact.phone || ""}
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "contact.phone",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="(11) 99999-9999"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="agency-email"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  E-mail
                                </label>
                                <input
                                  id="agency-email"
                                  type="email"
                                  value={currentAgency?.contact.email || ""}
                                  onChange={(e) =>
                                    updateCurrentAgency(
                                      "contact.email",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="agency-manager"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Gestor Responsável
                            </label>
                            <input
                              id="agency-manager"
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={currentAgency?.manager || ""}
                              onChange={(e) =>
                                updateCurrentAgency("manager", e.target.value)
                              }
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
                            {agencyToEdit
                              ? "Salvar Alterações"
                              : "Registrar Agência"}
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

export default Agencies;
