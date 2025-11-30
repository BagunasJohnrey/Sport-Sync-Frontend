import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trash2, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export default function NotificationPanel({ onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', title: 'Low Stock Alert', message: 'Coca Cola has only 5 units remaining', time: 'Just now', read: false },
    { id: 2, type: 'info', title: 'System Update', message: 'System maintenance scheduled for tonight', time: '1h ago', read: false },
    { id: 3, type: 'success', title: 'Order Completed', message: 'Order #12345 has been successfully processed', time: '2h ago', read: true }
  ]);


useEffect(() => {
  const handleOutside = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) {
      setNotifications(false);
    }
  };
  document.addEventListener("mousedown", handleOutside);
  return () => document.removeEventListener("mousedown", handleOutside);
}, []);


  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => setNotifications([]);
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBorderColor = (type) => {
    switch(type) {
      case 'warning': return 'border-l-amber-500';
      case 'info': return 'border-l-blue-500';
      case 'success': return 'border-l-emerald-500';
      default: return 'border-l-slate-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center">
      {/* Notification Panel */}
      <div className="w-96 bg-softWhite rounded-xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-slate-800 to-slate-700">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-slate-800 rounded-full"></span>
              )}
            </div>
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button onClick={clearAll} className="p-1.5 hover:bg-slate-600 rounded-lg transition-all duration-200">
  <Trash2 className="w-4 h-4 text-white" />
</button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-slate-600 rounded-lg transition-all duration-200">
  <X className="w-4 h-4 text-white" />
</button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 font-medium">No notifications</p>
              <p className="text-sm text-slate-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 border-l-4 ${getBorderColor(notification.type)} 
                  ${notification.read ? 'bg-white' : 'bg-blue-50'} 
                  hover:bg-slate-50 transition-all duration-200 cursor-pointer border-b border-slate-100`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-sm ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="flex-shrink-0 p-1 hover:bg-slate-200 rounded-lg transition-all duration-200 opacity-60 hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={markAllAsRead}
              className="w-full text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200 py-2 hover:bg-white rounded-lg"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
