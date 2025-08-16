import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

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

export default NotificationList;
