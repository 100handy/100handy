import { CheckCircle, CreditCard, Star, MessageSquare } from 'lucide-react'
import Header from '@/components/header'

const activityHistory = [
  {
    icon: CheckCircle,
    title: 'Booked Task: Assemble IKEA Bookshelf',
    date: 'October 28, 2023',
  },
  {
    icon: CreditCard,
    title: 'Payment Sent: $75.00 to Handyperson John D.',
    date: 'October 28, 2023',
  },
  {
    icon: MessageSquare,
    title: 'Review left for John D.',
    date: 'October 29, 2023',
  },
]

const reviews = [
  {
    handyperson: 'John D.',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrbYDNe_wsadWtJcT0O6mjYZ7KamIF17tL8rMkaE1qHsRk2Z7XEUsPMPTOVjNcyA6opeYf7R0XqxnGjdhmzJE75jaMP7S9cebN8GbPbN09O815pznlkFvbbb6baifb17Bndmtw0YuhvqtaYRtdViCx4MnJac5KNAtmRKiMMufqN0agbk9SME1Itzz8VqCpYPCxSBsZMT6n9DGgojHBp42gQbC1OXRbHMUsWOXMnNDXT-hU_YKqiSP_uegYx5sQ44bDLKq6GsH98r2a',
    rating: 5,
    comment:
      '"John was fantastic! He assembled my bookshelf perfectly and was very efficient. I\'d definitely book him again."',
  },
  {
    handyperson: 'Jane S.',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3n2oqz66yuWQWMZ4Gk6CiPY1DH8YktP3GizpoFsyD7Umqs_q67uNQYZMqx5e-Hn8Iei1g64_-CL5kFfyeEIFgUcW7I8lATveoO5ZrO7bawgGsHvy3h4PagR3kyLurV7hdwZpADpOmI4djsttAqNQBmVZRVDvHGHfhEu-r78pLO1ZmDl9r2DTojTMKXAMfgPxWmRdMUTmxnPlps2ZLLZZjvdf8Q5oyNvA7G3Y0_2l3UtNluVJ58t4wfu4n6EbYsyzeFu4BDYviyQ53',
    rating: 4.5,
    comment:
      '"Jane did a great job mounting my TV. She was very careful and made sure everything was level. The only reason for 4.5 stars is she was a bit late."',
  },
]

export default function UserProfilePage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Profile" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
              {/* Profile Card */}
              <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex flex-col items-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHj2T1GqdjEC209KukuFmItbpjkWEKfvDo-9GGtJadQa7hTLMXTpFDUB0PeeTV8fmDs7etUytfY92f98ZHiT4nPD3Fs-3d-AuEOnm-eopZlyQpwu5toQIx6r_FYKO_1oQPnwDKk9h1eWHKz9sKf2F39_hTcMtJgYkg2vrShRDjXRuWEJqZvTyOj_rf_Qjdi4N_3cxGcSS4746Q93gYoenII2H8Qi1VuojJYixC2Vf_-vgeCzhxR4-HQRTJhYSMUPo79BRiYkSeN-ii"
                    alt="Liam Johnson"
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Liam Johnson
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    liam.johnson@email.com
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    (555) 123-4567
                  </p>
                </div>
              </div>

              {/* Commonly Booked Services */}
              <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Commonly Booked Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    Furniture Assembly
                  </span>
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    TV Mounting
                  </span>
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    Painting
                  </span>
                </div>
              </div>

              {/* Edit Information */}
              <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Edit Information
                </h4>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      defaultValue="Liam Johnson"
                      className="w-full h-10 px-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue="liam.johnson@email.com"
                      className="w-full h-10 px-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="number"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Number
                    </label>
                    <input
                      type="tel"
                      id="number"
                      defaultValue="(555) 123-4567"
                      className="w-full h-10 px-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Activity History */}
              <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Activity History
                </h4>
                <div className="space-y-4">
                  {activityHistory.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-shrink-0 size-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {activity.title}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Client Stats */}
              <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Client Stats
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">8</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tasks Booked
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">$50</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Referral Earnings
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-primary gap-1">
                      <p className="text-3xl font-bold">4.9</p>
                      <Star className="w-8 h-8 fill-current" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Avg. Rating Given
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Reviews of Handypersons
                </h4>
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={index} className="flex gap-4">
                      <img
                        src={review.avatar}
                        alt={review.handyperson}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-slate-800 dark:text-slate-200">
                            Review for {review.handyperson} (Handyperson)
                          </h5>
                          <div className="flex text-yellow-500">
                            {[...Array(Math.floor(review.rating))].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                            {review.rating % 1 !== 0 && (
                              <Star className="w-4 h-4 fill-current opacity-50" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
