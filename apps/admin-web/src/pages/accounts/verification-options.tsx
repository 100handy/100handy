import Header from '../../components/header';
import { ChevronRight } from 'lucide-react';

const verificationStatuses = [
    {
        user: 'John Doe',
        type: 'ID Check',
        status: 'Pending Review',
        statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        dateSubmitted: '2023-10-26',
        action: 'Review',
    },
    {
        user: 'Jane Smith',
        type: 'Profile Photo',
        status: 'Verified',
        statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        dateSubmitted: '2023-10-25',
        action: 'View',
    },
    {
        user: 'Sam Wilson',
        type: 'ID Check',
        status: 'Rejected',
        statusColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        dateSubmitted: '2023-10-24',
        action: 'Details',
    },
];

export default function VerificationOptions() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Account Verification Options" />

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center text-sm mb-4">
                        <a className="text-slate-500 dark:text-slate-400 hover:text-primary" href="/accounts">
                            Accounts
                        </a>
                        <ChevronRight className="w-4 h-4 mx-2 text-slate-400 dark:text-slate-500" />
                        <span className="text-slate-800 dark:text-slate-200">Account Verification Options</span>
                    </div>

                    <div className="space-y-10">
                        {/* ID Verification Section */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                                ID Verification
                            </h3>
                            <div className="bg-background-light/50 dark:bg-background-dark/50 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">
                                            Government ID Check
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Verify user's identity using a government-issued ID.
                                        </p>
                                    </div>
                                    <button className="h-9 px-4 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30">
                                        Manage
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">Liveness Check</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Ensure the user is physically present during verification.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            Enabled
                                        </span>
                                        <button className="h-9 px-4 rounded-lg bg-red-500/10 dark:bg-red-400/20 text-red-500 dark:text-red-400 text-sm font-medium hover:bg-red-500/20 dark:hover:bg-red-400/30">
                                            Disable
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Profile Verification Section */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                                Profile Verification
                            </h3>
                            <div className="bg-background-light/50 dark:bg-background-dark/50 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">
                                            Profile Photo Check
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Ensure profile photo meets platform standards.
                                        </p>
                                    </div>
                                    <button className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">
                                        Enable
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">
                                            Social Media Verification
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Allow users to connect their social media accounts for verification.
                                        </p>
                                    </div>
                                    <button className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Verification Status Section */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                                Verification Status
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                                        <tr>
                                            <th className="px-6 py-3" scope="col">
                                                User
                                            </th>
                                            <th className="px-6 py-3" scope="col">
                                                Verification Type
                                            </th>
                                            <th className="px-6 py-3" scope="col">
                                                Status
                                            </th>
                                            <th className="px-6 py-3" scope="col">
                                                Date Submitted
                                            </th>
                                            <th className="px-6 py-3" scope="col">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {verificationStatuses.map((item, idx) => (
                                            <tr
                                                key={idx}
                                                className="bg-white border-b dark:bg-background-dark dark:border-slate-700 last:border-0"
                                            >
                                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                                                    {item.user}
                                                </td>
                                                <td className="px-6 py-4">{item.type}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${item.statusColor}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{item.dateSubmitted}</td>
                                                <td className="px-6 py-4">
                                                    <a className="font-medium text-primary hover:underline" href="#">
                                                        {item.action}
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
