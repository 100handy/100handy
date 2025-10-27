import { useState } from 'react';
import Header from '../../components/header';
import { Plus } from 'lucide-react';

const popups = [
    {
        id: 1,
        title: 'Summer Promo: 20% Off',
        platform: 'Website & App',
        status: true,
        schedule: 'Aug 1 - Aug 15, 2024',
    },
    {
        id: 2,
        title: 'New Feature Announcement',
        platform: 'App',
        status: false,
        schedule: 'Not Scheduled',
    },
    {
        id: 3,
        title: 'App Update Required',
        platform: 'App',
        status: true,
        schedule: 'Ongoing',
    },
    {
        id: 4,
        title: 'Cookie Consent',
        platform: 'Website',
        status: true,
        schedule: 'Ongoing',
    },
];

export default function PopupsPage() {
    const [popupList, setPopupList] = useState(popups);
    const [popupTitle, setPopupTitle] = useState('');
    const [platform, setPlatform] = useState('Website & App');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [displayRule, setDisplayRule] = useState('specific');

    const toggleStatus = (id: number) => {
        setPopupList(
            popupList.map((popup) =>
                popup.id === id ? { ...popup, status: !popup.status } : popup
            )
        );
    };

    return (
        <div className="flex-1 flex flex-col">
            <Header title="Pop-ups on Website and App" />

            <main className="flex-1 p-6 space-y-6">
                {/* Manage Pop-ups */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Pop-ups</h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                            <Plus className="w-4 h-4" />
                            <span>New Pop-up</span>
                        </button>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Create, edit, and manage pop-up notifications for the website and mobile app.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-sm text-left">
                            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3">Pop-up Title</th>
                                    <th className="px-6 py-3">Platform</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Schedule</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popupList.map((popup) => (
                                    <tr
                                        key={popup.id}
                                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 last:border-0"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {popup.title}
                                        </td>
                                        <td className="px-6 py-4">{popup.platform}</td>
                                        <td className="px-6 py-4">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={popup.status}
                                                    onChange={() => toggleStatus(popup.id)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    {popup.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4">{popup.schedule}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="text-primary hover:underline">Edit</button>
                                            <button className="text-green-600 hover:underline">Preview</button>
                                            <button className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create / Edit Pop-up */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Create / Edit Pop-up
                    </h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="popup-title"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Pop-up Title
                                </label>
                                <input
                                    type="text"
                                    id="popup-title"
                                    value={popupTitle}
                                    onChange={(e) => setPopupTitle(e.target.value)}
                                    placeholder="e.g., Summer Promotion"
                                    className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="platform"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Platform
                                </label>
                                <select
                                    id="platform"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option>Website & App</option>
                                    <option>Website Only</option>
                                    <option>App Only</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="popup-content"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Content
                            </label>
                            <textarea
                                id="popup-content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter the pop-up message..."
                                rows={4}
                                className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="start-date"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="end-date"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    End Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Display Rules
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="display-all"
                                        name="display-rule"
                                        value="all"
                                        checked={displayRule === 'all'}
                                        onChange={(e) => setDisplayRule(e.target.value)}
                                        className="h-4 w-4 text-primary bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 focus:ring-primary"
                                    />
                                    <label
                                        htmlFor="display-all"
                                        className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                                    >
                                        Show to all users
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="display-specific"
                                        name="display-rule"
                                        value="specific"
                                        checked={displayRule === 'specific'}
                                        onChange={(e) => setDisplayRule(e.target.value)}
                                        className="h-4 w-4 text-primary bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-700 focus:ring-primary"
                                    />
                                    <label
                                        htmlFor="display-specific"
                                        className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                                    >
                                        Show to specific user segments
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                            >
                                Save and Schedule
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
