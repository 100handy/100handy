import { useState } from 'react';
import Header from '../../components/header';
import { Plus } from 'lucide-react';

const emailTemplates = [
    {
        type: 'Welcome Email',
        recipient: 'New Users & Handys',
        isActive: true,
        lastModified: '2024-07-15',
    },
    {
        type: 'Task Confirmation',
        recipient: 'Users',
        isActive: true,
        lastModified: '2024-07-20',
    },
    {
        type: 'New Task Alert',
        recipient: 'Handys',
        isActive: true,
        lastModified: '2024-07-22',
    },
    {
        type: 'Password Reset',
        recipient: 'All',
        isActive: true,
        lastModified: '2024-06-30',
    },
    {
        type: 'Weekly Newsletter',
        recipient: 'All',
        isActive: false,
        lastModified: '2024-07-28',
    },
];

export default function EmailNotifications() {
    const [templates, setTemplates] = useState(emailTemplates);
    const [recipientType, setRecipientType] = useState('All Users');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleToggle = (index: number) => {
        const newTemplates = [...templates];
        newTemplates[index].isActive = !newTemplates[index].isActive;
        setTemplates(newTemplates);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Send email', { recipientType, subject, message });
    };

    return (
        <div className="flex-1 flex flex-col">
            <Header title="Email Notifications" />

            <main className="flex-1 p-6 space-y-6">
                {/* Manage Email Notifications */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Manage Email Notifications
                        </h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                            <Plus className="w-4 h-4" />
                            <span>New Email Template</span>
                        </button>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Configure, edit, and send various types of email alerts to users and Handys.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-sm text-left">
                            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3">Email Type</th>
                                    <th className="px-6 py-3">Recipient</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Last Modified</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((template, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {template.type}
                                        </td>
                                        <td className="px-6 py-4">{template.recipient}</td>
                                        <td className="px-6 py-4">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    checked={template.isActive}
                                                    className="sr-only peer"
                                                    onChange={() => handleToggle(idx)}
                                                    type="checkbox"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    {template.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4">{template.lastModified}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="text-primary hover:underline">Edit</button>
                                            <button className="text-green-600 hover:underline">Send Test</button>
                                            <button className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Send One-Time Email */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Send a One-Time Email
                    </h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                htmlFor="recipient-type"
                            >
                                Recipient Group
                            </label>
                            <select
                                className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                id="recipient-type"
                                onChange={(e) => setRecipientType(e.target.value)}
                                value={recipientType}
                            >
                                <option>All Users</option>
                                <option>All Handys</option>
                                <option>Specific Users/Handys</option>
                            </select>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                htmlFor="email-subject"
                            >
                                Subject
                            </label>
                            <input
                                className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                id="email-subject"
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Enter email subject"
                                type="text"
                                value={subject}
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                htmlFor="email-body"
                            >
                                Message
                            </label>
                            <textarea
                                className="w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                id="email-body"
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Compose your email message..."
                                rows={6}
                                value={message}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
                                type="button"
                            >
                                Save as Draft
                            </button>
                            <button
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                                type="submit"
                            >
                                Send Email
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
