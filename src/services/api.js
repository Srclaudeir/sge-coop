const API_URL = "http://localhost:3001";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

export const getMachines = () => fetch(`${API_URL}/machines`).then(handleResponse);
export const getMachine = (id) =>
  fetch(`${API_URL}/machines/${id}`).then(handleResponse);
export const createMachine = (machine) =>
  fetch(`${API_URL}/machines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(machine),
  }).then(handleResponse);
export const updateMachine = (id, machine) =>
  fetch(`${API_URL}/machines/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(machine),
  }).then(handleResponse);
export const deleteMachine = (id) =>
  fetch(`${API_URL}/machines/${id}`, { method: "DELETE" }).then(handleResponse);

export const getAgencies = () => fetch(`${API_URL}/agencies`).then(handleResponse);
export const getAgency = (id) =>
  fetch(`${API_URL}/agencies/${id}`).then(handleResponse);
export const createAgency = (agency) =>
  fetch(`${API_URL}/agencies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agency),
  }).then(handleResponse);
export const updateAgency = (id, agency) =>
  fetch(`${API_URL}/agencies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agency),
  }).then(handleResponse);
export const deleteAgency = (id) =>
  fetch(`${API_URL}/agencies/${id}`, { method: "DELETE" }).then(handleResponse);

export const getClients = () => fetch(`${API_URL}/clients`).then(handleResponse);
export const getClient = (id) =>
  fetch(`${API_URL}/clients/${id}`).then(handleResponse);
export const createClient = (client) =>
  fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  }).then(handleResponse);
export const updateClient = (id, client) =>
  fetch(`${API_URL}/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  }).then(handleResponse);
export const deleteClient = (id) =>
  fetch(`${API_URL}/clients/${id}`, { method: "DELETE" }).then(handleResponse);

export const getOperations = () =>
  fetch(`${API_URL}/operations`).then(handleResponse);
export const getOperation = (id) =>
  fetch(`${API_URL}/operations/${id}`).then(handleResponse);
export const createOperation = (operation) =>
  fetch(`${API_URL}/operations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(operation),
  }).then(handleResponse);
export const updateOperation = (id, operation) =>
  fetch(`${API_URL}/operations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(operation),
  }).then(handleResponse);
export const deleteOperation = (id) =>
  fetch(`${API_URL}/operations/${id}`, { method: "DELETE" }).then(
    handleResponse
  );
