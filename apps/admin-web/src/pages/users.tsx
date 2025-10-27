import { Search, Plus, Trash2 } from 'lucide-react'
import Header from '@/components/header'

const users = [
  {
    name: 'Sophia Clark',
    email: 'sophia.clark@email.com',
    phone: '+1-555-123-4567',
    status: 'Active',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHj2T1GqdjEC209KukuFmItbpjkWEKfvDo-9GGtJadQa7hTLMXTpFDUB0PeeTV8fmDs7etUytfY92f98ZHiT4nPD3Fs-3d-AuEOnm-eopZlyQpwu5toQIx6r_FYKO_1oQPnwDKk9h1eWHKz9sKf2F39_hTcMtJgYkg2vrShRDjXRuWEJqZvTyOj_rf_Qjdi4N_3cxGcSS4746Q93gYoenII2H8Qi1VuojJYixC2Vf_-vgeCzhxR4-HQRTJhYSMUPo79BRiYkSeN-ii',
  },
  {
    name: 'Ethan Bennett',
    email: 'ethan.bennett@email.com',
    phone: '+1-555-987-6543',
    status: 'Inactive',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrbYDNe_wsadWtJcT0O6mjYZ7KamIF17tL8rMkaE1qHsRk2Z7XEUsPMPTOVjNcyA6opeYf7R0XqxnGjdhmzJE75jaMP7S9cebN8GbPbN09O815pznlkFvbbb6baifb17Bndmtw0YuhvqtaYRtdViCx4MnJac5KNAtmRKiMMufqN0agbk9SME1Itzz8VqCpYPCxSBsZMT6n9DGgojHBp42gQbC1OXRbHMUsWOXMnNDXT-hU_YKqiSP_uegYx5sQ44bDLKq6GsH98r2a',
  },
  {
    name: 'Olivia Harper',
    email: 'olivia.harper@email.com',
    phone: '+1-555-246-8013',
    status: 'Active',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3n2oqz66yuWQWMZ4Gk6CiPY1DH8YktP3GizpoFsyD7Umqs_q67uNQYZMqx5e-Hn8Iei1g64_-CL5kFfyeEIFgUcW7I8lATveoO5ZrO7bawgGsHvy3h4PagR3kyLurV7hdwZpADpOmI4djsttAqNQBmVZRVDvHGHfhEu-r78pLO1ZmDl9r2DTojTMKXAMfgPxWmRdMUTmxnPlps2ZLLZZjvdf8Q5oyNvA7G3Y0_2l3UtNluVJ58t4wfu4n6EbYsyzeFu4BDYviyQ53',
  },
  {
    name: 'Liam Foster',
    email: 'liam.foster@email.com',
    phone: '+1-555-135-7924',
    status: 'Active',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAl7ZpjS67R3rgiWvcxqAn8c7I2rulj--7BwitPAO5euwOiiCoDri4MHVCmBQ6opT7hSgCZjYJsEt7H5mLSrLi7RzhjKGjep1IW9A0XnmJWYmEIid2b5eq2A34K4Yxwp78iLeHmom-GyIOaZz5clt-iExVlRQfjKc_hH_77cTnXDEFtUsvvPiGduccS-5YxufqtlMIwmfd0a-EXWbaVkO4dGflnNgC3SETo_5x_UZ5cfSUnxls5vMv5tNCuTOnINjiJBLfUTo3NZWq',
  },
  {
    name: 'Ava Morgan',
    email: 'ava.morgan@email.com',
    phone: '+1-555-369-1215',
    status: 'Inactive',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_MJ4UddhouBF6iCGZf5Eq0B6hnABUIjH0_99a97B7WwnufA69_yBVUSGh8tnyfelpCxv28yfodqy8HGRw5NMGyIoKqwUvElzD8_vRv-7YQffBVsZR7S4s-wGnbRFzaJ7Iwjm6jCbxCuYQBRg5pZwchuRprlP6cKawUnRWSYLXn81BOPCIqnWSD-qLzpMxpkckonMrf5DPsUT4QY_eRzDW7PtlR__KvHLf4ZbacwAAUXKrlJ7kHUeBDmtlVTUIn-nNRRaxP2wr4BrV',
  },
]

export default function UsersPage() {
  return (
    <main className="flex-1 flex flex-col">
      <header className="flex items-center justify-end h-16 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button className="text-slate-600 dark:text-slate-300 hover:text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDyCXgHayZKfjcMUs8WckCUtSPgThwRklQifUtklBQAPLYcG2KqI2ju_KcUa_wW6GwMsA4OZ3Y6yrhQkzUvMjG7fxYXf7Z07kOBlquQ_g7_H1zxn7Fiz9K1bEQnNI6RdCjw_gSxEJlXEeXVCY4ojoP33sI3yAyc7Tk-p2-fpiDegJkT919DqXwhncPIpRPlQ2XPDDvFtj4wIAj4Nt_JazNKzPsTWAYxf4VwatvxfbsNrzFM1doZ8d1A7C7HF92f18mX96ANq9pGlzf6")',
            }}
          />
        </div>
      </header>

      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">All Users</h2>
            <div className="flex gap-2">
              <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
              <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-primary/30 text-slate-700 dark:text-slate-200 bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-medium shadow-sm transition-colors">
                <Trash2 className="w-4 h-4" />
                <span>Remove Users</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search users by name, email or phone..."
                className="w-full h-12 pl-10 pr-4 rounded-lg bg-white dark:bg-background-dark border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a href="#" className="font-medium text-primary hover:underline">
                        View Profile
                      </a>
                      <button className="ml-4 text-slate-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Showing 1 to 5 of 10 entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="px-3 py-1 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Previous
              </button>
              <button className="px-3 py-1 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
