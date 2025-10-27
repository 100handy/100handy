import { useState } from 'react';
import Header from '../../components/header';
import { Save, PlusCircle, Download, Edit2, Trash2, ChevronDown } from 'lucide-react';

const conversionRates = [
    { base: 'USD ($)', target: 'CAD ($)', rate: '1.35' },
    { base: 'USD ($)', target: 'GBP (£)', rate: '0.79' },
];

const rateHistory = [
    {
        date: '2024-07-15',
        category: 'Cleaning (Base - USA)',
        previousRate: '$30.00 USD',
        newRate: '$35.00 USD',
        changedBy: 'Admin',
        isIncrease: true,
    },
    {
        date: '2024-06-20',
        category: 'Plumbing (London, UK)',
        previousRate: '£45.00',
        newRate: '£50.00',
        changedBy: 'Admin',
        isIncrease: true,
    },
    {
        date: '2024-05-01',
        category: 'Assembly (Base - CAD)',
        previousRate: '$40.00 CAD',
        newRate: '$38.00 CAD',
        changedBy: 'Admin',
        isIncrease: false,
    },
];

export default function RatesAdjustments() {
    const [category, setCategory] = useState('Plumbing');
    const [region, setRegion] = useState('United States');
    const [location, setLocation] = useState('');
    const [currency, setCurrency] = useState('USD ($)');
    const [newRate, setNewRate] = useState('');
    const [baseCurrency, setBaseCurrency] = useState('USD ($)');
    const [targetCurrency, setTargetCurrency] = useState('CAD ($)');
    const [conversionRate, setConversionRate] = useState('');

    const handleApplyRate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Apply new rate');
    };

    const handleAddConversion = () => {
        console.log('Add conversion rate');
    };

    return (
        <div className="flex-1 flex flex-col">
            <Header title="Rates Adjustments" />

            <main className="flex-1 p-6 space-y-6">
                {/* Adjust Rates Section */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Adjust Rates by Category & Location
                    </h3>
                    <form onSubmit={handleApplyRate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Task Category */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="category"
                                >
                                    Task Category
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        className="appearance-none w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        id="category"
                                        onChange={(e) => setCategory(e.target.value)}
                                        value={category}
                                    >
                                        <option>Plumbing</option>
                                        <option>Cleaning</option>
                                        <option>Assembly</option>
                                        <option>Electrical</option>
                                        <option>Moving</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Region/Country */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="region"
                                >
                                    Region/Country
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        className="appearance-none w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        id="region"
                                        onChange={(e) => setRegion(e.target.value)}
                                        value={region}
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Specific Location */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="location"
                                >
                                    Specific Location (Optional)
                                </label>
                                <input
                                    className="w-full mt-1 px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    id="location"
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., New York, London"
                                    type="text"
                                    value={location}
                                />
                            </div>

                            {/* Currency */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="currency"
                                >
                                    Currency
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        className="appearance-none w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        id="currency"
                                        onChange={(e) => setCurrency(e.target.value)}
                                        value={currency}
                                    >
                                        <option>USD ($)</option>
                                        <option>CAD ($)</option>
                                        <option>GBP (£)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Current Base Rate */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="current-rate"
                                >
                                    Current Base Rate (per hour)
                                </label>
                                <input
                                    className="w-full mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                                    disabled
                                    id="current-rate"
                                    type="text"
                                    value="$45.00"
                                />
                            </div>

                            {/* New Base Rate */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="new-rate"
                                >
                                    New Base Rate (per hour)
                                </label>
                                <input
                                    className="w-full mt-1 px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    id="new-rate"
                                    onChange={(e) => setNewRate(e.target.value)}
                                    placeholder="e.g., 50.00"
                                    type="text"
                                    value={newRate}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                                type="submit"
                            >
                                <Save className="w-4 h-4" />
                                <span>Apply New Rate</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Currency Conversion Management */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Currency Conversion Management
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            {/* Base Currency */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="base-currency"
                                >
                                    Base Currency
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        className="appearance-none w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        id="base-currency"
                                        onChange={(e) => setBaseCurrency(e.target.value)}
                                        value={baseCurrency}
                                    >
                                        <option>USD ($)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Target Currency */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="target-currency"
                                >
                                    Target Currency
                                </label>
                                <div className="relative mt-1">
                                    <select
                                        className="appearance-none w-full bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        id="target-currency"
                                        onChange={(e) => setTargetCurrency(e.target.value)}
                                        value={targetCurrency}
                                    >
                                        <option>CAD ($)</option>
                                        <option>GBP (£)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Conversion Rate */}
                            <div>
                                <label
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="conversion-rate"
                                >
                                    Conversion Rate (1 Base = X Target)
                                </label>
                                <input
                                    className="w-full mt-1 px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    id="conversion-rate"
                                    onChange={(e) => setConversionRate(e.target.value)}
                                    placeholder="e.g., 1.35"
                                    type="text"
                                    value={conversionRate}
                                />
                            </div>

                            {/* Add Button */}
                            <div className="flex justify-end">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm w-full md:w-auto"
                                    onClick={handleAddConversion}
                                    type="button"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Add Conversion Rate</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Conversion Rates Table */}
                    <div className="overflow-x-auto mt-6">
                        <table className="w-full min-w-[600px] text-sm text-left">
                            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3">Base Currency</th>
                                    <th className="px-6 py-3">Target Currency</th>
                                    <th className="px-6 py-3">Conversion Rate</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conversionRates.map((rate, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {rate.base}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {rate.target}
                                        </td>
                                        <td className="px-6 py-4">{rate.rate}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 text-primary hover:bg-primary/10 rounded-full inline-flex items-center justify-center">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-red-500 hover:bg-red-500/10 rounded-full inline-flex items-center justify-center ml-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Rate Change History */}
                <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Rate Change History
                        </h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
                            <Download className="w-4 h-4" />
                            <span>Export History</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-sm text-left">
                            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Category / Location</th>
                                    <th className="px-6 py-3">Previous Rate</th>
                                    <th className="px-6 py-3">New Rate</th>
                                    <th className="px-6 py-3">Changed By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rateHistory.map((history, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 last:border-0"
                                    >
                                        <td className="px-6 py-4">{history.date}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {history.category}
                                        </td>
                                        <td className="px-6 py-4">{history.previousRate}</td>
                                        <td
                                            className={`px-6 py-4 font-semibold ${history.isIncrease ? 'text-green-500' : 'text-red-500'
                                                }`}
                                        >
                                            {history.newRate}
                                        </td>
                                        <td className="px-6 py-4">{history.changedBy}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
