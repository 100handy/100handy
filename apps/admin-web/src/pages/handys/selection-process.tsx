import Header from '../../components/header';
import { FileText, Users, ShieldCheck, GraduationCap, Search, Filter } from 'lucide-react';

export default function HandySelectionProcess() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Handy Selection Process" />

            <main className="flex-1 p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Manage the steps for onboarding new Handys to the platform.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Process Stages */}
                        <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                                Process Stages
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Application Review
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            Review initial applications for completeness and basic qualifications.
                                        </p>
                                        <button className="mt-3 text-sm font-medium text-primary hover:underline">
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Interviews
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            Schedule and conduct interviews with promising candidates.
                                        </p>
                                        <button className="mt-3 text-sm font-medium text-primary hover:underline">
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Background Checks
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            Initiate and review background checks for selected applicants.
                                        </p>
                                        <button className="mt-3 text-sm font-medium text-primary hover:underline">
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Onboarding
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            Finalize paperwork and provide initial training materials.
                                        </p>
                                        <button className="mt-3 text-sm font-medium text-primary hover:underline">
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Applicants Table */}
                        <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                        Current Applicants
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                className="w-full max-w-xs pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                                                placeholder="Search applicants..."
                                                type="search"
                                            />
                                        </div>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <Filter className="w-4 h-4" />
                                            Filter
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-900/50">
                                            <tr>
                                                <th className="px-4 py-3 font-medium" scope="col">
                                                    Applicant Name
                                                </th>
                                                <th className="px-4 py-3 font-medium" scope="col">
                                                    Application Date
                                                </th>
                                                <th className="px-4 py-3 font-medium" scope="col">
                                                    Stage
                                                </th>
                                                <th className="px-4 py-3 font-medium text-center" scope="col">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3 font-medium" scope="col">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                                <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                                                    James Peterson
                                                </td>
                                                <td className="px-4 py-4">Oct 28, 2023</td>
                                                <td className="px-4 py-4">Application Review</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300">
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <a className="font-medium text-primary hover:underline" href="#">
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                                <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                                                    Laura Williams
                                                </td>
                                                <td className="px-4 py-4">Oct 26, 2023</td>
                                                <td className="px-4 py-4">Interview</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                                                        Scheduled
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <a className="font-medium text-primary hover:underline" href="#">
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                                <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                                                    Michael Brown
                                                </td>
                                                <td className="px-4 py-4">Oct 25, 2023</td>
                                                <td className="px-4 py-4">Background Check</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                                                        Passed
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <a className="font-medium text-primary hover:underline" href="#">
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                                <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                                                    Jessica Miller
                                                </td>
                                                <td className="px-4 py-4">Oct 24, 2023</td>
                                                <td className="px-4 py-4">Application Review</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                                                        Rejected
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <a className="font-medium text-primary hover:underline" href="#">
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                                <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                                                    David Garcia
                                                </td>
                                                <td className="px-4 py-4">Oct 23, 2023</td>
                                                <td className="px-4 py-4">Onboarding</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                                                        Complete
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <a className="font-medium text-primary hover:underline" href="#">
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
