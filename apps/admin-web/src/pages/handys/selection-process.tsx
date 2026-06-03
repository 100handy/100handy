import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header';
import { FileText, Users, ShieldCheck, GraduationCap, Search, Filter, Loader2, ChevronDown } from 'lucide-react';
import {
  useHandyApplicants,
  useApplicantStageCounts,
  type ApplicantStage,
  type ApplicantStatus,
} from '@/lib/api/handys-extended';

const getStatusColor = (status: ApplicantStatus): string => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
    case 'Scheduled':
      return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
    case 'Passed':
    case 'Complete':
      return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
    case 'Rejected':
      return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  }
};

const stageIcons: Record<ApplicantStage, React.ComponentType<{ className?: string }>> = {
  'Application Review': FileText,
  'Interview': Users,
  'Background Check': ShieldCheck,
  'Onboarding': GraduationCap,
};

const stageDescriptions: Record<ApplicantStage, string> = {
  'Application Review': 'Review initial applications for completeness and basic qualifications.',
  'Interview': 'Schedule and conduct interviews with promising candidates.',
  'Background Check': 'Initiate and review background checks for selected applicants.',
  'Onboarding': 'Finalize paperwork and provide initial training materials.',
};

export default function HandySelectionProcess() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<ApplicantStage | undefined>(undefined);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const { data: stageCounts, isLoading: stageCountsLoading } = useApplicantStageCounts();
  const { data: applicants, isLoading: applicantsLoading } = useHandyApplicants(
    stageFilter,
    undefined,
    searchQuery || undefined
  );

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
                {(['Application Review', 'Interview', 'Background Check', 'Onboarding'] as ApplicantStage[]).map(
                  (stage) => {
                    const Icon = stageIcons[stage];
                    const count = stageCounts?.find((s) => s.stage === stage)?.count || 0;

                    return (
                      <div key={stage} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {stage}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {stageDescriptions[stage]}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {stageCountsLoading ? (
                              <span className="text-sm text-slate-400">Loading...</span>
                            ) : (
                              <span className="text-sm font-medium text-primary">{count} applicants</span>
                            )}
                            <button
                              onClick={() => setStageFilter(stageFilter === stage ? undefined : stage)}
                              className={`text-sm font-medium hover:underline ${
                                stageFilter === stage ? 'text-primary' : 'text-slate-500'
                              }`}
                            >
                              {stageFilter === stage ? 'Clear Filter' : 'Filter'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Current Applicants Table */}
            <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Current Applicants
                    {stageFilter && (
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        - Filtered by: {stageFilter}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full max-w-xs pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                        placeholder="Search applicants..."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <Filter className="w-4 h-4" />
                        Filter
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showFilterMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                          <div className="p-2">
                            <button
                              onClick={() => {
                                setStageFilter(undefined);
                                setShowFilterMenu(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                                !stageFilter
                                  ? 'bg-primary/10 text-primary'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              All Stages
                            </button>
                            {(['Application Review', 'Interview', 'Background Check', 'Onboarding'] as ApplicantStage[]).map(
                              (stage) => (
                                <button
                                  key={stage}
                                  onClick={() => {
                                    setStageFilter(stage);
                                    setShowFilterMenu(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg ${
                                    stageFilter === stage
                                      ? 'bg-primary/10 text-primary'
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  {stage}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
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
                      {applicantsLoading ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                            <p className="mt-2 text-slate-500">Loading applicants...</p>
                          </td>
                        </tr>
                      ) : applicants && applicants.length > 0 ? (
                        applicants.map((applicant) => (
                          <tr
                            key={applicant.id}
                            className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                          >
                            <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                              {applicant.name}
                            </td>
                            <td className="px-4 py-4">{applicant.applicationDate}</td>
                            <td className="px-4 py-4">{applicant.stage}</td>
                            <td className="px-4 py-4 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}
                              >
                                {applicant.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <Link className="font-medium text-primary hover:underline" to={`/handys/${applicant.id}`}>
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                            No applicants found
                          </td>
                        </tr>
                      )}
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
