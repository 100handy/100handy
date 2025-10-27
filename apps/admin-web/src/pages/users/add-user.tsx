import { UserPlus } from 'lucide-react'
import Header from '@/components/header'

export default function AddUserPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Add New User" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g., John Doe"
                  className="w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g., john.doe@example.com"
                  className="w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter a secure password"
                  className="w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Roles & Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <input
                      type="checkbox"
                      id="role-admin"
                      name="roles"
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="role-admin"
                      className="ml-3 text-sm text-slate-800 dark:text-slate-200"
                    >
                      Administrator
                    </label>
                  </div>

                  <div className="flex items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <input
                      type="checkbox"
                      id="role-handy"
                      name="roles"
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="role-handy"
                      className="ml-3 text-sm text-slate-800 dark:text-slate-200"
                    >
                      Handy
                    </label>
                  </div>

                  <div className="flex items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <input
                      type="checkbox"
                      id="role-customer"
                      name="roles"
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="role-customer"
                      className="ml-3 text-sm text-slate-800 dark:text-slate-200"
                    >
                      Customer
                    </label>
                  </div>

                  <div className="flex items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <input
                      type="checkbox"
                      id="role-support"
                      name="roles"
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="role-support"
                      className="ml-3 text-sm text-slate-800 dark:text-slate-200"
                    >
                      Support Agent
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-primary text-white text-sm font-medium shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Add User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
