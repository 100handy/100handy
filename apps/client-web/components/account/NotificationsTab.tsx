"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationSettings } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <div
    className={cn(
      "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
      checked ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
    )}
  >
    {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
  </div>
);

export function NotificationsTab() {
  const { settings: notificationSettings, updateSettings } = useNotificationSettings();
  
  const [localNotifications, setLocalNotifications] = useState({
    taskUpdates: {
      email: false,
      sms: false,
      push: false,
    },
    promotional: {
      email: false,
      sms: false,
      push: false,
    },
  });

  useEffect(() => {
    if (notificationSettings) {
      setLocalNotifications({
        taskUpdates: {
          email: notificationSettings.email_notifications,
          sms: notificationSettings.sms_notifications,
          push: notificationSettings.push_notifications,
        },
        promotional: {
          email: notificationSettings.marketing_emails,
          sms: notificationSettings.marketing_sms,
          push: notificationSettings.marketing_push,
        },
      });
    }
  }, [notificationSettings]);

  const toggleNotification = (category: "taskUpdates" | "promotional", type: "email" | "sms" | "push") => {
    setLocalNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const handleSaveNotifications = () => {
    updateSettings({
      email_notifications: localNotifications.taskUpdates.email,
      sms_notifications: localNotifications.taskUpdates.sms,
      push_notifications: localNotifications.taskUpdates.push,
      marketing_emails: localNotifications.promotional.email,
      marketing_sms: localNotifications.promotional.sms,
      marketing_push: localNotifications.promotional.push,
    });
  };

  const handleCancelNotifications = () => {
    if (notificationSettings) {
      setLocalNotifications({
        taskUpdates: {
          email: notificationSettings.email_notifications,
          sms: notificationSettings.sms_notifications,
          push: notificationSettings.push_notifications,
        },
        promotional: {
          email: notificationSettings.marketing_emails,
          sms: notificationSettings.marketing_sms,
          push: notificationSettings.marketing_push,
        },
      });
    }
  };

  return (
    <>
      <div className="mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">Notifications</h2>
      </div>

      <div className="space-y-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 sm:px-4 text-brand-dark font-semibold text-sm sm:text-base">
                  Form of communication
                </th>
                <th className="text-center py-3 px-2 sm:px-4 text-brand-dark font-semibold text-sm sm:text-base">
                  Email
                </th>
                <th className="text-center py-3 px-2 sm:px-4 text-brand-dark font-semibold text-sm sm:text-base">
                  SMS
                </th>
                <th className="text-center py-3 px-2 sm:px-4 text-brand-dark font-semibold text-sm sm:text-base">
                  Push Notification
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-2 sm:px-4 text-brand-dark text-sm sm:text-base">Task Updates</td>
                <td className="py-4 px-2 sm:px-4 text-center">
                  <button
                    onClick={() => toggleNotification("taskUpdates", "email")}
                    className="inline-flex items-center justify-center mx-auto"
                  >
                    <CheckboxIcon checked={localNotifications.taskUpdates.email} />
                  </button>
                </td>
                <td className="py-4 px-2 sm:px-4 text-center">
                  <button
                    onClick={() => toggleNotification("taskUpdates", "sms")}
                    className="inline-flex items-center justify-center mx-auto"
                  >
                    <CheckboxIcon checked={localNotifications.taskUpdates.sms} />
                  </button>
                </td>
                <td className="py-4 px-2 sm:px-4 text-center">
                  <button
                    onClick={() => toggleNotification("taskUpdates", "push")}
                    className="inline-flex items-center justify-center mx-auto"
                  >
                    <CheckboxIcon checked={localNotifications.taskUpdates.push} />
                  </button>
                </td>
              </tr>

              <tr className="border-b border-gray-200">
                <td className="py-4 px-2 sm:px-4 text-brand-dark text-sm sm:text-base">
                  Promotional Emails and Notifications
                </td>
                <td className="py-4 px-2 sm:px-4 text-center">
                  <button
                    onClick={() => toggleNotification("promotional", "email")}
                    className="inline-flex items-center justify-center mx-auto"
                  >
                    <CheckboxIcon checked={localNotifications.promotional.email} />
                  </button>
                </td>
                <td className="py-4 px-2 sm:px-4 text-center">
                  <button
                    onClick={() => toggleNotification("promotional", "sms")}
                    className="inline-flex items-center justify-center mx-auto"
                  >
                    <CheckboxIcon checked={localNotifications.promotional.sms} />
                  </button>
                </td>
                <td className="py-4 px-2 sm:px-4 text-center">
                  <button
                    onClick={() => toggleNotification("promotional", "push")}
                    className="inline-flex items-center justify-center mx-auto"
                  >
                    <CheckboxIcon checked={localNotifications.promotional.push} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleCancelNotifications}
            className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNotifications}
            className="bg-brand-terracotta hover:bg-brand-coral text-white w-full sm:w-auto px-8"
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}

