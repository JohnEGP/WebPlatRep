import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, X, Calendar, AlertCircle, CheckCircle, Info } from "lucide-react";
import type { Notification, NotificationType } from "@shared/crm-types";

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "deadline_reminder",
    title: "Prazo Aproximando",
    message: "O projeto 'Corporate Branding Package' tem prazo para amanhã",
    userId: "current-user",
    read: false,
    createdAt: "2024-01-08T10:00:00Z",
    actionUrl: "/projects/1",
  },
  {
    id: "n2",
    type: "approval_request",
    title: "Aprovação Pendente",
    message: "Menu do restaurante 'Bistro Central' aguarda aprovação do cliente",
    userId: "current-user",
    read: false,
    createdAt: "2024-01-08T09:30:00Z",
    actionUrl: "/projects/2",
  },
  {
    id: "n3",
    type: "stock_alert",
    title: "Stock Baixo",
    message: "Tinta preta está com stock baixo (5 unidades restantes)",
    userId: "current-user",
    read: false,
    createdAt: "2024-01-08T08:15:00Z",
    actionUrl: "/stock/m2",
  },
  {
    id: "n4",
    type: "project_update",
    title: "Projeto Atualizado",
    message: "Sofia Costa atualizou o status do projeto 'Event Banners'",
    userId: "current-user",
    read: true,
    createdAt: "2024-01-07T16:45:00Z",
    actionUrl: "/projects/3",
  },
  {
    id: "n5",
    type: "budget_alert",
    title: "Orçamento Excedido",
    message: "Projeto 'Corporate Branding Package' excedeu 80% do orçamento",
    userId: "current-user",
    read: true,
    createdAt: "2024-01-07T14:20:00Z",
    actionUrl: "/projects/1",
  },
];

interface NotificationDropdownProps {
  onNavigate: (url: string) => void;
}

export default function NotificationDropdown({ onNavigate }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "deadline_reminder":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "approval_request":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "stock_alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "project_update":
        return <Info className="h-4 w-4 text-green-500" />;
      case "budget_alert":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      onNavigate(notification.actionUrl);
    }
    setIsOpen(false);
  };

  const removeNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notificações</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.read ? "text-gray-900" : "text-gray-700"
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => removeNotification(notification.id, e)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-center"
                  onClick={() => {
                    onNavigate("/notifications");
                    setIsOpen(false);
                  }}
                >
                  Ver todas as notificações
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
