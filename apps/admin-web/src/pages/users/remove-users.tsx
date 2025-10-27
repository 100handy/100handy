import { Search, Trash2, AlertTriangle } from 'lucide-react'
import Header from '@/components/header'

const users = [
  {
    name: 'Sophia Clark',
    email: 'sophia.clark@email.com',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHj2T1GqdjEC209KukuFmItbpjkWEKfvDo-9GGtJadQa7hTLMXTpFDUB0PeeTV8fmDs7etUytfY92f98ZHiT4nPD3Fs-3d-AuEOnm-eopZlyQpwu5toQIx6r_FYKO_1oQPnwDKk9h1eWHKz9sKf2F39_hTcMtJgYkg2vrShRDjXRuWEJqZvTyOj_rf_Qjdi4N_3cxGcSS4746Q93gYoenII2H8Qi1VuojJYixC2Vf_-vgeCzhxR4-HQRTJhYSMUPo79BRiYkSeN-ii',
  },
  {
    name: 'Ethan Bennett',
    email: 'ethan.bennett@email.com',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrbYDNe_wsadWtJcT0O6mjYZ7KamIF17tL8rMkaE1qHsRk2Z7XEUsPMPTOVjNcyA6opeYf7R0XqxnGjdhmzJE75jaMP7S9cebN8GbPbN09O815pznlkFvbbb6baifb17Bndmtw0YuhvqtaYRtdViCx4MnJac5KNAtmRKiMMufqN0agbk9SME1Itzz8VqCpYPCxSBsZMT6n9DGgojHBp42gQbC1OXRbHMUsWOXMnNDXT-hU_YKqiSP_uegYx5sQ44bDLKq6GsH98r2a',
  },
  {
    name: 'Olivia Harper',
    email: 'olivia.harper@email.com',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3n2oqz66yuWQWMZ4Gk6CiPY1DH8YktP3GizpoFsyD7Umqs_q67uNQYZMqx5e-Hn8Iei1g64_-CL5kFfyeEIFgUcW7I8lATveoO5ZrO7bawgGsHvy3h4PagR3kyLurV7hdwZpADpOmI4djsttAqNQBmVZRVDvHGHfhEu-r78pLO1ZmDl9r2DTojTMKXAMfgPxWmRdMUTmxnPlps2ZLLZZjvdf8Q5oyNvA7G3Y0_2l3UtNluVJ58t4wfu4n6EbYsyzeFu4BDYviyQ53',
  },
]

export default function RemoveUsersPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Remove Users" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search users to remove..."
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
                />
              </div>
            </div>

            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-medium shadow-sm hover:bg-red-700 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                    Confirmation Required
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400/80 mt-1">
                    Removing a user is a permanent action and cannot be undone. Please
                    be certain before proceeding. A confirmation prompt will appear
                    after clicking the 'Remove' button.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
