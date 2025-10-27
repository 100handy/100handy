import { PlusCircle } from 'lucide-react'

const campaigns = [
  {
    name: 'Summer25',
    type: 'Discount Code',
    status: 'Active',
    statusColor: 'green',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    usage: '1,254 / 5,000',
    actions: ['Edit', 'View Stats'],
  },
  {
    name: 'Refer a Friend',
    type: 'Referral Program',
    status: 'Active',
    statusColor: 'green',
    startDate: '2024-01-01',
    endDate: 'Ongoing',
    usage: '876 successful referrals',
    actions: ['Edit', 'View Stats'],
  },
  {
    name: 'FirstTask10',
    type: 'Discount Code',
    status: 'Expired',
    statusColor: 'gray',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    usage: '2,312 / 2,500',
    actions: ['View Stats'],
  },
  {
    name: 'Handy Welcome Bonus',
    type: 'Referral Bonus',
    status: 'Upcoming',
    statusColor: 'blue',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    usage: '0',
    actions: ['Edit', 'Cancel'],
  },
]

const topCodes = [
  { code: 'Summer25', uses: 1254, percentage: 75 },
  { code: 'REFER-A-FRIEND', uses: 876, percentage: 50 },
  { code: 'WELCOME15', uses: 432, percentage: 25 },
]

export default function PromotionsManagementPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Campaign Management
        </h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
            <PlusCircle className="w-4 h-4" />
            <span>Create New Campaign</span>
          </button>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Active Campaigns</h4>
          <div className="flex items-center gap-4 text-sm">
            <button className="text-primary font-medium">All</button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-primary">
              Promotions
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-primary">
              Referrals
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3">Campaign Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">End Date</th>
                <th className="px-6 py-3">Usage/Redemptions</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4">{campaign.type}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.statusColor === 'green'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : campaign.statusColor === 'blue'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{campaign.startDate}</td>
                  <td className="px-6 py-4">{campaign.endDate}</td>
                  <td className="px-6 py-4">{campaign.usage}</td>
                  <td className="px-6 py-4 text-right">
                    {campaign.actions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`${
                          idx > 0 ? 'ml-4' : ''
                        } ${
                          action === 'Cancel' ? 'text-red-500' : 'text-primary'
                        } hover:underline`}
                      >
                        {action}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Overall Promotion Performance
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Total Discounts Given</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$12,450.75</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Total Referral Bonuses Paid
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$4,380.00</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  New Customers from Promotions
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
              </div>
              <p className="text-2xl font-bold text-green-500">+1,876</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Codes
          </h4>
          <div className="space-y-3">
            {topCodes.map((code, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                  {code.code}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${code.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{code.uses} uses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
