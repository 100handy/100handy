import Header from '../../components/header';
import { ChevronRight } from 'lucide-react';

export default function SecurityOptions() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Account Security Options" />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm mb-4">
            <a className="text-slate-500 dark:text-slate-400 hover:text-primary" href="/accounts">
              Accounts
            </a>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-400 dark:text-slate-500" />
            <span className="text-slate-800 dark:text-slate-200">Account Security Options</span>
          </div>

          <div className="space-y-10">
            {/* Password Section */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                Password
              </h3>
              <div className="flex items-center justify-between bg-background-light/50 dark:bg-background-dark/50 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Change password</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Last changed 3 months ago
                  </p>
                </div>
                <button className="h-9 px-4 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30">
                  Change
                </button>
              </div>
            </section>

            {/* Two-Factor Authentication Section */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between bg-background-light/50 dark:bg-background-dark/50 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    Enable two-factor authentication
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Two-factor authentication is currently disabled.
                  </p>
                </div>
                <button className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">
                  Enable
                </button>
              </div>
            </section>

            {/* Login History Section */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                Login History
              </h3>
              <div className="flex items-center justify-between bg-background-light/50 dark:bg-background-dark/50 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    View your account's login history
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Review recent sign-in activity for suspicious behavior.
                  </p>
                </div>
                <button className="h-9 px-4 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium hover:bg-primary/20 dark:hover:bg-primary/30">
                  View History
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
