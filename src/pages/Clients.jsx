import React, { useState } from "react";
import { Plus, Settings, Users, CreditCard } from "lucide-react";

const Clients = ({ user, clients, setClients, addNotification, validation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [clientType, setClientType] = useState("pf");

  const handleEditClient = (client) => {
    setClientToEdit(client);
    setClientType(client.type);
    setCurrentClient({ ...client });
    setIsModalOpen(true);
  };

  const handleNewClient = () => {
    setClientToEdit(null);
    setClientType("pf");
    setCurrentClient({
      id: `C${clients.length + 1}`,
      type: "pf",
      name: "",
      document: "",
      contact: {
        phone: "",
        email: "",
      },
      installationAddress: {
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      },
      agencyId: user.agencyId || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentClient?.name || !currentClient?.document) {
      addNotification("error", "Nome e Documento são obrigatórios");
      return;
    }

    // Validação de CPF/CNPJ
    if (
      clientType === "pf" &&
      !validation.validateCPF(currentClient.document.replace(/\D/g, ""))
    ) {
      addNotification("error", "CPF inválido");
      return;
    }

    if (
      clientType === "pj" &&
      !validation.validateCNPJ(currentClient.document.replace(/\D/g, ""))
    ) {
      addNotification("error", "CNPJ inválido");
      return;
    }

    if (!validation.validateEmail(currentClient.contact.email)) {
      addNotification("error", "E-mail inválido");
      return;
    }

    if (!validation.validatePhone(currentClient.contact.phone)) {
      addNotification("error", "Telefone inválido");
      return;
    }

    const updatedClient = {
      ...currentClient,
      type: clientType,
      document:
        clientType === "pf"
          ? currentClient.document
              .replace(/\D/g, "")
              .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
          : currentClient.document
              .replace(/\D/g, "")
              .replace(
                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                "$1.$2.$3/$4-$5"
              ),
    };

    if (clientToEdit) {
      // Update existing client
      setClients(
        clients.map((c) => (c.id === clientToEdit.id ? updatedClient : c))
      );
      addNotification("success", "Cliente atualizado com sucesso!");
    } else {
      // Add new client
      setClients([...clients, updatedClient]);
      addNotification("success", "Cliente cadastrado com sucesso!");
    }

    setIsModalOpen(false);
  };

  const updateCurrentClient = (field, value) => {
    setCurrentClient((prev) => {
      const updated = { ...prev };

      if (field.startsWith("contact.")) {
        const subField = field.split(".")[1];
        updated.contact = {
          ...updated.contact,
          [subField]: value,
        };
      } else if (field.startsWith("installationAddress.")) {
        const subField = field.split(".")[1];
        updated.installationAddress = {
          ...updated.installationAddress,
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
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        {user?.role === "super_admin" || user?.agencyId ? (
          <button
            onClick={handleNewClient}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Cliente
          </button>
        ) : null}
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
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.type === "pf"
                            ? "Pessoa Física"
                            : "Pessoa Jurídica"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {client.document}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.contact.phone} <br /> {client.contact.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.installationAddress.street},{" "}
                    {client.installationAddress.number} -{" "}
                    {client.installationAddress.city}/
                    {client.installationAddress.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      aria-label="Editar cliente"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        addNotification(
                          "info",
                          `Visualizar máquinas do cliente ${client.name}`
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

        {clients.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Nenhum cliente cadastrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Nenhum cliente foi cadastrado ainda.
            </p>
            {(user?.role === "super_admin" || user?.agencyId) && (
              <div className="mt-6">
                <button
                  onClick={handleNewClient}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Cadastre seu primeiro cliente
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para registro/edição de cliente */}
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
                      {clientToEdit ? "Editar Cliente" : "Novo Cliente"}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo de Cliente
                            </label>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center">
                                <input
                                  id="pf"
                                  name="clientType"
                                  type="radio"
                                  checked={clientType === "pf"}
                                  onChange={() => setClientType("pf")}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label
                                  htmlFor="pf"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Pessoa Física
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="pj"
                                  name="clientType"
                                  type="radio"
                                  checked={clientType === "pj"}
                                  onChange={() => setClientType("pj")}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label
                                  htmlFor="pj"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Pessoa Jurídica
                                </label>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="client-name"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              {clientType === "pf"
                                ? "Nome Completo"
                                : "Razão Social"}
                            </label>
                            <input
                              id="client-name"
                              type="text"
                              required
                              value={currentClient?.name || ""}
                              onChange={(e) =>
                                updateCurrentClient("name", e.target.value)
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>

                          {clientType === "pj" && (
                            <div>
                              <label
                                htmlFor="responsible-name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Nome do Responsável
                              </label>
                              <input
                                id="responsible-name"
                                type="text"
                                value={currentClient?.responsibleName || ""}
                                onChange={(e) =>
                                  updateCurrentClient(
                                    "responsibleName",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          )}

                          <div>
                            <label
                              htmlFor="client-document"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              {clientType === "pf" ? "CPF" : "CNPJ"}
                            </label>
                            <input
                              id="client-document"
                              type="text"
                              required
                              value={currentClient?.document || ""}
                              onChange={(e) =>
                                updateCurrentClient(
                                  "document",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder={
                                clientType === "pf"
                                  ? "000.000.000-00"
                                  : "00.000.000/0000-00"
                              }
                            />
                          </div>

                          <div className="md:col-span-2">
                            <h3 className="text-md font-medium text-gray-700 mb-2">
                              Contato
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="client-phone"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Telefone
                                </label>
                                <input
                                  id="client-phone"
                                  type="text"
                                  required
                                  value={currentClient?.contact.phone || ""}
                                  onChange={(e) =>
                                    updateCurrentClient(
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
                                  htmlFor="client-email"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  E-mail
                                </label>
                                <input
                                  id="client-email"
                                  type="email"
                                  required
                                  value={currentClient?.contact.email || ""}
                                  onChange={(e) =>
                                    updateCurrentClient(
                                      "contact.email",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <h3 className="text-md font-medium text-gray-700 mb-2">
                              Endereço de Instalação
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label
                                  htmlFor="installation-cep"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  CEP
                                </label>
                                <input
                                  id="installation-cep"
                                  type="text"
                                  value={
                                    currentClient?.installationAddress.cep ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentClient(
                                      "installationAddress.cep",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="installation-street"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Logradouro
                                </label>
                                <input
                                  id="installation-street"
                                  type="text"
                                  value={
                                    currentClient?.installationAddress
                                      .street || ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentClient(
                                      "installationAddress.street",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="installation-number"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Número
                                </label>
                                <input
                                  id="installation-number"
                                  type="text"
                                  value={
                                    currentClient?.installationAddress
                                      .number || ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentClient(
                                      "installationAddress.number",
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
                                  htmlFor="installation-complement"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Complemento
                                </label>
                                <input
                                  id="installation-complement"
                                  type="text"
                                  value={
                                    currentClient?.installationAddress
                                      .complement || ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentClient(
                                      "installationAddress.complement",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="installation-neighborhood"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Bairro
                                </label>
                                <input
                                  id="installation-neighborhood"
                                  type="text"
                                  value={
                                    currentClient?.installationAddress
                                      .neighborhood || ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentClient(
                                      "installationAddress.neighborhood",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="installation-city"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Cidade
                                </label>
                                <input
                                  id="installation-city"
                                  type="text"
                                  value={
                                    currentClient?.installationAddress.city ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentClient(
                                      "installationAddress.city",
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
                                  htmlFor="installation-state"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Estado
                                </label>
                                <select
                                  id="installation-state"
                                  value={
                                    currentClient?.installationAddress
                                      .state || ""
                                  }
                                  onChange={(e) =>
                                    updateCurrentClient(
                                      "installationAddress.state",
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
                            {clientToEdit
                              ? "Salvar Alterações"
                              : "Cadastrar Cliente"}
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

export default Clients;
