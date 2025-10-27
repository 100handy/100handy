import { useState } from 'react';
import Header from '../../components/header';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Calendar days for November 2023
const calendarDays = [
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    ...Array.from({ length: 30 }, (_, i) => ({ day: i + 1, isCurrentMonth: true })),
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
];

export default function CalendarSettings() {
    const [currentMonth] = useState('November 2023');
    const [notifications, setNotifications] = useState({
        newBooking: true,
        cancellations: false,
        scheduleChanges: true,
    });
    const [defaultAvailability, setDefaultAvailability] = useState('Available');
    const [bookingWindow, setBookingWindow] = useState('24');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Settings saved');
    };

    return (
        <div className="flex-1 flex flex-col">
            <Header title="Calendar & Settings" />

            <main className="flex-1 p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Manage Handy schedules, integrations, and general settings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Calendar Section */}
                        <div className="xl:col-span-2">
                            <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                            Handy Schedule
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[120px] text-center">
                                                {currentMonth}
                                            </span>
                                            <button className="p-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-px text-center text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-t-lg">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="py-2 bg-white dark:bg-background-dark">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border-x border-b border-slate-200 dark:border-slate-700 rounded-b-lg">
                                        {calendarDays.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`bg-white dark:bg-background-dark p-2 h-24 text-sm relative ${!item.isCurrentMonth ? 'text-slate-400 dark:text-slate-500' : ''
                                                    } ${item.day === 13 && item.isCurrentMonth ? 'bg-primary/5' : ''}`}
                                            >
                                                {item.day}
                                                {item.day === 12 && item.isCurrentMonth && (
                                                    <div className="absolute bottom-1 left-1 right-1 flex flex-col gap-0.5">
                                                        <div className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded px-1 truncate">
                                                            J. Doe - Available
                                                        </div>
                                                        <div className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded px-1 truncate">
                                                            S. Jane - Booked
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="xl:col-span-1 space-y-8">
                            {/* Calendar Integrations */}
                            <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                                        Calendar Integrations
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                        Connect your calendars to sync Handy schedules.
                                    </p>
                                    <div className="space-y-4">
                                        {/* Google Calendar */}
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    alt="Google Calendar Logo"
                                                    className="h-8 w-8"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm1FCraN5-s4j1u5WHJxpKp2fetbVfRkEokFpb52irdls9USKJx945doWy820iUsZ1gQQKpwhc-l9HKo_16byv7AvTFib6xDsIru9hFebZPilMnFOyvw8hOL91G6DaTyIOW9yDCW1DneF0C6ZlCYHEt6H0xDSEmny6Uk-SSuk2DpYpgBObDIvjxTrBtMCSu9sB5Q5ERU2Sw_5lL5JNyYdLJ3L1l7h-Hy1pMKDFmDSDERFRrmQ5gk099D8ujAxY3F5ppvecH5RKD6BY"
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-slate-800 dark:text-white">
                                                        Google Calendar
                                                    </h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Not connected</p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 rounded-md text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20">
                                                Connect
                                            </button>
                                        </div>

                                        {/* Outlook Calendar */}
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    alt="Hotmail/Outlook Logo"
                                                    className="h-8 w-8"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeyhlQnKaBLLM9v-pWoNNHnPiExT9UCQpy-yJVjALD0Uwo7lBIzsCtVX_RR2kK0LREKGxQ4lwTujwBEjzF5onBQrDwQIKp-gJapsQ3iMIfwMvCo-GXR93gtq8-PRoFo_ZMztDAzx_4eUnqyl5qHL-Wac7_Lt1tFjSLmGJZFnwl97w_t0ZTwGYIlXsty6Mwzb1UHy4orrdSxJ1MM8BeykssWHyQiUrciO5Fk7fcFsQjz1ZkoYalpXYv-wbrqMMiaGwZin4NoYZR-n66"
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-slate-800 dark:text-white">
                                                        Hotmail/Outlook
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-green-500">Connected</span>
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 rounded-md text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40">
                                                Disconnect
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                                        Settings
                                    </h3>
                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        {/* Notification Settings */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                Notification Settings
                                            </label>
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <input
                                                        checked={notifications.newBooking}
                                                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-primary focus:ring-primary"
                                                        id="new-booking"
                                                        onChange={(e) =>
                                                            setNotifications({ ...notifications, newBooking: e.target.checked })
                                                        }
                                                        type="checkbox"
                                                    />
                                                    <label
                                                        className="ml-3 text-sm text-slate-600 dark:text-slate-400"
                                                        htmlFor="new-booking"
                                                    >
                                                        New booking confirmations
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        checked={notifications.cancellations}
                                                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-primary focus:ring-primary"
                                                        id="cancellations"
                                                        onChange={(e) =>
                                                            setNotifications({ ...notifications, cancellations: e.target.checked })
                                                        }
                                                        type="checkbox"
                                                    />
                                                    <label
                                                        className="ml-3 text-sm text-slate-600 dark:text-slate-400"
                                                        htmlFor="cancellations"
                                                    >
                                                        Cancellations
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        checked={notifications.scheduleChanges}
                                                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-primary focus:ring-primary"
                                                        id="schedule-changes"
                                                        onChange={(e) =>
                                                            setNotifications({
                                                                ...notifications,
                                                                scheduleChanges: e.target.checked,
                                                            })
                                                        }
                                                        type="checkbox"
                                                    />
                                                    <label
                                                        className="ml-3 text-sm text-slate-600 dark:text-slate-400"
                                                        htmlFor="schedule-changes"
                                                    >
                                                        Schedule changes
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Default Availability */}
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                                                htmlFor="default-availability"
                                            >
                                                Default Availability Status
                                            </label>
                                            <select
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-3 py-2"
                                                id="default-availability"
                                                onChange={(e) => setDefaultAvailability(e.target.value)}
                                                value={defaultAvailability}
                                            >
                                                <option>Available</option>
                                                <option>Unavailable</option>
                                            </select>
                                        </div>

                                        {/* Booking Window */}
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                                                htmlFor="booking-window"
                                            >
                                                Minimum Booking Window (hours)
                                            </label>
                                            <input
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-3 py-2"
                                                id="booking-window"
                                                onChange={(e) => setBookingWindow(e.target.value)}
                                                type="number"
                                                value={bookingWindow}
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90"
                                                type="submit"
                                            >
                                                Save Settings
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
