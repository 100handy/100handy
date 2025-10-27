import { useState } from 'react';
import Header from '../../components/header';
import { Plus, Edit2, Trash2, Save, ChevronDown } from 'lucide-react';

const paymentMethods = [
    { name: 'Stripe Connect', type: 'Gateway', status: 'Active', statusColor: 'green' },
    { name: 'PayPal', type: 'Gateway', status: 'Active', statusColor: 'green' },
    {
        name: 'Bank Transfer (ACH)',
        type: 'Payout',
        status: 'Pending Configuration',
        statusColor: 'yellow',
    },
];

const statusColors = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

export default function PaymentMethods() {
    const [methodName, setMethodName] = useState('');
    const [methodType, setMethodType] = useState('Payment Gateway');
    const [apiKey, setApiKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [enableMethod, setEnableMethod] = useState(false);

    const handleSaveMethod = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Save payment method');
    };

    return (
        <div className="flex-1 flex flex-col">
            <Header title="Payment Methods" />

            <main className="flex-1 p-6 space-y-6">
                {/* Manage Payment Methods Table */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Manage Payment Methods
                        </h3>
                        <button className="flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                            <Plus className="w-4 h-4" />
                            <span>Add New Method</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm text-left">
                            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3">Method Name</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentMethods.map((method, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {method.name}
                                        </td>
                                        <td className="px-6 py-4">{method.type}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[method.statusColor as keyof typeof statusColors]
                                                    }`}
                                            >
                                                {method.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="p-1 text-primary hover:bg-primary/10 rounded-full inline-flex items-center justify-center">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-red-500 hover:bg-red-500/10 rounded-full inline-flex items-center justify-center">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Payment Method Form */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Add/Edit Payment Method
                    </h3>

                    <form className="space-y-4" onSubmit={handleSaveMethod}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Method Name */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="method-name"
                                >
                                    Method Name
                                </label>
                                <input
                                    className="w-full mt-1 px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    id="method-name"
                                    onChange={(e) => setMethodName(e.target.value)}
                                    placeholder="e.g., Stripe"
                                    type="text"
                                    value={methodName}
                                />
                            </div>

                            {/* Method Type */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="method-type"
                                >
                                    Method Type
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        className="appearance-none w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        id="method-type"
                                        onChange={(e) => setMethodType(e.target.value)}
                                        value={methodType}
                                    >
                                        <option>Payment Gateway</option>
                                        <option>Payout Option</option>
                                        <option>Client Preference</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Configuration Section */}
                        <div>
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">
                                Configuration
                            </h4>
                            <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                {/* API Key */}
                                <div>
                                    <label
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        htmlFor="api-key"
                                    >
                                        API Key
                                    </label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        id="api-key"
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Enter API Key"
                                        type="password"
                                        value={apiKey}
                                    />
                                </div>

                                {/* Secret Key */}
                                <div>
                                    <label
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        htmlFor="secret-key"
                                    >
                                        Secret Key
                                    </label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        id="secret-key"
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        placeholder="Enter Secret Key"
                                        type="password"
                                        value={secretKey}
                                    />
                                </div>

                                {/* Enable Method Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        checked={enableMethod}
                                        className="h-4 w-4 text-primary bg-background-light dark:bg-background-dark border-gray-300 dark:border-gray-600 rounded focus:ring-primary"
                                        id="enable-method"
                                        onChange={(e) => setEnableMethod(e.target.checked)}
                                        type="checkbox"
                                    />
                                    <label
                                        className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                                        htmlFor="enable-method"
                                    >
                                        Enable this payment method
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                                type="submit"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save Method</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
