import React, { useState, useEffect, createContext, useContext } from "react";
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
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Truck,
  Database,
  Users,
  Settings,
  Home,
  FileText,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  File,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Bell,
  Building,
  Plus,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Contexto para notificações
const NotificationContext = createContext();

// Provider de notificações
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message, duration = 5000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationList
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

// Componente de notificações
const NotificationList = ({ notifications, removeNotification }) => {
  const getNotificationStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-l-4 border-green-500";
      case "error":
        return "bg-red-50 border-l-4 border-red-500";
      case "info":
        return "bg-blue-50 border-l-4 border-blue-500";
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-500";
      default:
        return "bg-gray-50 border-l-4 border-gray-500";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 ${getNotificationStyle(
                notification.type
              )}`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.type.charAt(0).toUpperCase() +
                        notification.type.slice(1)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <span className="sr-only">Fechar</span>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Hook para validação de CPF/CNPJ
const useValidation = () => {
  const validateCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/\D/g, "");
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    return re.test(phone);
  };

  const validateCEP = (cep) => {
    const re = /^\d{5}-?\d{3}$/;
    return re.test(cep);
  };

  return {
    validateCPF,
    validateCNPJ,
    validateEmail,
    validatePhone,
    validateCEP,
  };
};

// Error Boundary para capturar erros
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Oops! Algo deu errado.
            </h2>
            <p className="text-gray-600 mb-4">
              Desculpe, ocorreu um erro inesperado.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
const App = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [machines, setMachines] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [clients, setClients] = useState([]);
  const [operations, setOperations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const { addNotification } = useContext(NotificationContext) || {
    addNotification: () => {},
  };
  const validation = useValidation();

  // Inicialização dos dados
  useEffect(() => {
    // Simular dados iniciais
    setMachines([
      {
        id: "1",
        model: "Ingenico APOS A8",
        serialNumber: "SN123456789",
        fixedAssetNumber: "FA1001",
        connectionType: ["3G/4G", "Wi-Fi", "Ethernet"],
        accessories: {
          charger: true,
          usbCable: true,
          paperRolls: 3,
          manual: true,
          protectiveFilm: true,
          simCard: {
            carrier: "Vivo",
            number: "SIM123456789",
          },
        },
        status: "in_stock_matrix",
        supplier: "Cielo",
        acquisitionDate: "2023-03-15",
        warrantyMonths: 24,
      },
      {
        id: "2",
        model: "Gertec GPOS700",
        serialNumber: "SN987654321",
        fixedAssetNumber: "FA1002",
        connectionType: ["Wi-Fi"],
        accessories: {
          charger: true,
          usbCable: false,
          paperRolls: 1,
          manual: true,
          protectiveFilm: false,
          simCard: {
            carrier: "Claro",
            number: "SIM987654321",
          },
        },
        status: "in_stock_matrix",
        supplier: "Stone",
        acquisitionDate: "2023-04-01",
        warrantyMonths: 18,
      },
    ]);

    setAgencies([
      {
        id: "A1",
        name: "Sicoob Agência Central",
        code: "001",
        address: {
          cep: "01001-000",
          street: "Praça dos Correios",
          number: "001",
          complement: "",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
        },
        contact: {
          phone: "(11) 3003-9000",
          email: "central@sicoob.com.br",
        },
        manager: "Gestor1",
      },
      {
        id: "A2",
        name: "Sicoob Agência Paulista",
        code: "002",
        address: {
          cep: "01311-928",
          street: "Avenida Paulista",
          number: "1000",
          complement: "10º andar",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
        },
        contact: {
          phone: "(11) 3003-9001",
          email: "paulista@sicoob.com.br",
        },
        manager: "Gestor2",
      },
    ]);

    setClients([
      {
        id: "C1",
        type: "pf",
        name: "João Silva",
        document: "123.456.789-00",
        contact: {
          phone: "(11) 99999-9999",
          email: "joaosilva@email.com",
        },
        installationAddress: {
          cep: "01001-000",
          street: "Praça dos Correios",
          number: "001",
          complement: "",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
        },
        agencyId: "A1",
      },
      {
        id: "C2",
        type: "pj",
        name: "Empresa de Tecnologia LTDA",
        document: "12.345.678/0001-90",
        responsibleName: "Carlos Oliveira",
        contact: {
          phone: "(11) 98888-8888",
          email: "empresa@email.com",
        },
        installationAddress: {
          cep: "04546-002",
          street: "Avenida das Nações Unidas",
          number: "12345",
          complement: "Edifício Empresarial",
          neighborhood: "Vila Gertrudes",
          city: "São Paulo",
          state: "SP",
        },
        agencyId: "A2",
      },
    ]);

    setOperations([
      {
        id: "OP1",
        machineId: "1",
        clientId: "C1",
        agencyId: "A1",
        type: "rental",
        startDate: "2023-04-01",
        endDate: null,
        monthlyRent: 50.0,
        contract: "contract1.pdf",
        status: "active",
      },
      {
        id: "OP2",
        machineId: "2",
        clientId: "C2",
        agencyId: "A2",
        type: "rental",
        startDate: "2023-05-15",
        endDate: null,
        monthlyRent: 45.0,
        contract: "contract2.pdf",
        status: "active",
      },
    ]);

    // Simular login do usuário
    setUser({
      id: "U1",
      name: "Admin Sicoob",
      role: "super_admin",
      agencyId: null,
    });
  }, []);

  // Dashboard Component
  const Dashboard = ({ user, machines, agencies, clients, operations }) => {
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
    const inStockAgency = machines.filter((m) =>
      m.status.startsWith("in_stock_agency_")
    ).length;
    const rented = machines.filter((m) =>
      m.status.startsWith("rented_client_")
    ).length;
    const maintenance = machines.filter((m) =>
      m.status.includes("maintenance")
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

  // Machines Component com melhorias
  const Machines = ({ user, machines, setMachines }) => {
    const [filterStatus, setFilterStatus] = useState("");
    const [filterModel, setFilterModel] = useState("");
    const [filterAgency, setFilterAgency] = useState("");
    const [filterSerial, setFilterSerial] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMachine, setCurrentMachine] = useState(null);
    const [machineToEdit, setMachineToEdit] = useState(null);
    const [showMaintenanceHistory, setShowMaintenanceHistory] = useState(false);
    const [maintenanceHistory, setMaintenanceHistory] = useState([]);

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

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!currentMachine.model || !currentMachine.serialNumber) {
        addNotification("error", "Modelo e Número de Série são obrigatórios");
        return;
      }

      if (machineToEdit) {
        // Atualizar máquina existente
        setMachines(
          machines.map((m) =>
            m.id === machineToEdit.id ? { ...currentMachine } : m
          )
        );
        addNotification("success", "Máquina atualizada com sucesso!");
      } else {
        // Adicionar nova máquina
        setMachines([...machines, { ...currentMachine }]);
        addNotification("success", "Máquina cadastrada com sucesso!");
      }

      setIsModalOpen(false);
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

  // Agencies Component
  const Agencies = ({ user, agencies, setAgencies }) => {
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
  }; // Clients Component
  const Clients = ({ user, clients, setClients }) => {
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

  // Operations Component
  const Operations = ({
    user,
    operations,
    setOperations,
    machines,
    clients,
    agencies,
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

  // Relatórios Component com melhorias
  const Reports = ({ user, machines, clients, operations, agencies }) => {
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

  // Componente de login simplificado para demonstração
  const Login = () => {
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
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
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
                Admin: usuário <strong>admin</strong> / senha{" "}
                <strong>admin</strong>
              </p>
              <p>
                Gestor: usuário <strong>gestor</strong> / senha{" "}
                <strong>gestor</strong>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Componente de sidebar com melhorias de acessibilidade
  const Sidebar = () => {
    const menuItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "machines", label: "Máquinas", icon: CreditCard },
      { id: "agencies", label: "Agências", icon: Building },
      { id: "clients", label: "Clientes", icon: Users },
      { id: "operations", label: "Operações", icon: FileText },
      { id: "reports", label: "Relatórios", icon: File },
    ];

    return (
      <aside
        className={`bg-gray-800 text-white ${
          isSidebarOpen ? "w-64" : "w-16"
        } fixed h-full transition-all duration-300 z-10`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-400" />
              <span className="ml-2 font-bold text-xl">Sicoob POS</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <nav className="mt-5 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                currentView === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } ${!isSidebarOpen && "justify-center"}`}
              aria-current={currentView === item.id ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center px-4 py-2">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="font-bold">{user?.name.charAt(0)}</span>
                </div>
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">
                    {user?.role === "super_admin"
                      ? "Administrador"
                      : "Gestor de Agência"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </nav>
      </aside>
    );
  };

  // Render different views based on currentView state
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            user={user}
            machines={machines}
            agencies={agencies}
            clients={clients}
            operations={operations}
          />
        );
      case "machines":
        return (
          <Machines user={user} machines={machines} setMachines={setMachines} />
        );
      case "agencies":
        return (
          <Agencies user={user} agencies={agencies} setAgencies={setAgencies} />
        );
      case "clients":
        return (
          <Clients user={user} clients={clients} setClients={setClients} />
        );
      case "operations":
        return (
          <Operations
            user={user}
            operations={operations}
            setOperations={setOperations}
            machines={machines}
            clients={clients}
            agencies={agencies}
          />
        );
      case "reports":
        return (
          <Reports
            user={user}
            machines={machines}
            clients={clients}
            operations={operations}
            agencies={agencies}
          />
        );
      default:
        return (
          <Dashboard
            user={user}
            machines={machines}
            agencies={agencies}
            clients={clients}
            operations={operations}
          />
        );
    }
  };

  // Renderização principal
  if (!user) {
    return <Login />;
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />

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

            <main className="p-6">{renderView()}</main>
          </div>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
};
export default App;
