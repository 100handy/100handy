import { useState } from 'react';
import Header from '../../components/header';
import { Plus, Megaphone, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Platform Update',
    message: "We've just released new features to improve task management. Check out the new \"Recurring Tasks\" option in your dashboard.",
    time: '2 hours ago',
    type: 'info',
    isRead: false,
  },
  {
    id: 2,
    title: 'Scheduled Maintenance',
    message: 'The platform will be temporarily unavailable for scheduled maintenance on July 30th from 2:00 AM to 4:00 AM EST.',
    time: '1 day ago',
    type: 'warning',
    isRead: false,
  },
  {
    id: 3,
    title: 'New Handy Verification Process',
    message: 'We have updated our verification process for new Handys to ensure higher quality service. This change has been applied.',
    time: '3 days ago',
    type: 'success',
    isRead: true,
  },
  {
    id: 4,
    title: 'Policy Update: Cancellation Fees',
    message: 'Please review the updated cancellation policy. Changes will take effect on August 1st.',
    time: '1 week ago',
    type: 'error',
    isRead: false,
  },
  {
    id: 5,
    title: 'Summer Promotion Results',
    message: 'The "Summer Sparkle" promotion has concluded. We saw a 20% increase in cleaning tasks. Thank you!',
    time: '2 weeks ago',
    type: 'info',
    isRead: true,
  },
];

export default function AnnouncementsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismiss = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Megaphone className="w-5 h-5 text-primary" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/10';
      case 'success':
        return 'bg-green-500/10';
      case 'error':
        return 'bg-red-500/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Announcements & Notifications" />

      <main className="flex-1 p-6 space-y-8">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Manage Notifications
            </h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90">
              <Plus className="w-5 h-5" />
              <span>New Announcement</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    notification.isRead
                      ? 'bg-gray-50 dark:bg-gray-800/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${getIconBgColor(
                        notification.type
                      )} flex items-center justify-center shrink-0`}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div
                      className={`flex-1 ${
                        notification.isRead
                          ? 'text-gray-500 dark:text-gray-400'
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p
                          className={`font-semibold ${
                            notification.isRead
                              ? ''
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          notification.isRead
                            ? ''
                            : 'text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Mark as Read
                          </button>
                          <button
                            onClick={() => dismiss(notification.id)}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="text-sm font-medium text-primary hover:underline">
              View All Notifications
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
