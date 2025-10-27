import { Search, Download, ChevronDown } from 'lucide-react'

const handyEarnings = [
    {
        id: '#12345',
        name: 'James Miller',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPWr7e0ykIbzaY1-XitrOGEUByUcZas4wSxdgoSbhyKdgIjar4uFSEW05JjHtFnS4BebD0kM-vW0_Oc6A9eXYltbEwCT4PGNs1Xaks6ARoJmOIH-xV3eVGVJkbFG5lL_mNAC-Nt87xFfD_wLm4jTjFS0jQp-sW5p_mUD_0xCTudFahpkG646VYG_piw2pun5MUh4Hq5i1PrLwd1rM-z5nhBMjt-h7jxeXwCPG0njvb9gmTMX1EBHAAYuJ3PILOvHCBwzgwM5wtmvcQ',
        earnings: '$1,250.75',
        tasks: '32',
        lastPayout: '2024-07-25',
        status: 'Paid',
        statusColor: 'green',
    },
    {
        id: '#67890',
        name: 'Emily Rodriguez',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAENd1NCOXumeJMeJbEqDv1sHXPXg88Hy1MCyWOPfyIe4nGyvCBemlZcz-IP_P9CuTZfaNaxilpv4QJOLPKr07Lh3erS2qi5t6dOcBBoPiB7cuhr0K6Hkp__0oFF6hD5ZO0P3ZVFzkyU4HnCwEN-yLccU66JRAYAU0hq3sVlzNmkypjv8z2JbTm7whW5jHvJ4Eg1lVbQOXB-FP_EXhp5_bflG0wz2wtH21JTs75GOeuItbfVpZT8pwfAx5LznZkp1-LKGFmITcSar0L',
        earnings: '$875.00',
        tasks: '21',
        lastPayout: '2024-07-24',
        status: 'Paid',
        statusColor: 'green',
    },
    {
        id: '#11223',
        name: 'Michael Chen',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAF0RWbkBmnW5wlPbaQWbhfUssKk9h7tUVo1xiFmvbTq4Kl_fzSHP5cPvPztG7W9j7e8yxhP_YGbEvkZRrQObNP1PCmDPRviqxIdNpSH5yu_JN6Z0ME-4k1W8H6_PctF_8rj6UYFgh33LO2XabKHSwzPb-UTRt9xUpQceCtQqLOyyl7pnCmIqgbNbi0RDH-kvoDMvFKtt6brgBscY6WNeMVCcplDsWPBVAKa_3ddTEWEaDmhyUPBFHEfsRYlNtOo4a9ezkWQbZR8uv',
        earnings: '$2,110.20',
        tasks: '45',
        lastPayout: '2024-07-26',
        status: 'Pending',
        statusColor: 'yellow',
    },
    {
        id: '#44556',
        name: 'Sarah Davis',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTQ2Lz7Z-td-fI2LmQYB0XLt_3sp4nasjVbNZE2okIGuODPeUEuWoXQ9PutIOYFOOCgGW1silCiGdk4w_YopyM_kWn-BmCR2e92EE_3Mjz5CzDiTR0qxU9n5HfgfxJwra5-Hee1HoCcTgYzJEK0srDF8r6na3aScZ-N5sA56TZomsZD9tE0iiRlPhuTKh8R_tkpfGzqwm-7bRAr-VlUkQiYPphPEa-l2AJ52lkes4sB3dUpAgDc4T2fAurDhJ70y15Fh4umu4AWC5w',
        earnings: '$530.50',
        tasks: '15',
        lastPayout: '2024-07-23',
        status: 'Paid',
        statusColor: 'green',
    },
    {
        id: '#77889',
        name: 'David Wilson',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnctuywaYyy2FnFW5cZbZnfxakUsQRuHpTp1dmKEvHkvAadbYtxVYmAbIJOXfKfn_xaiJAWaIfKUiJsIASZa5YxntXdprImqAIkPSIQeJP8IamTI4Lod0JICLcW2R2Nwds6i2Pha7hrXnJQcd25kg8ODsS0scAYUUaePrFegy8ckUqAE9grD2HyYy0NvJVy9ufLRpr6H8zE9ut_rPieQiOpdCf1A7RbajAvjhCH5j8eiLLNzH4dKlNIzBHq-oWLogqIL_jhSPg_GF_',
        earnings: '$990.00',
        tasks: '28',
        lastPayout: '2024-07-22',
        status: 'Failed',
        statusColor: 'red',
    },
]

const statusColors = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
}

export default function EarningsDashboardPage() {
    return (
        <main className="flex-1">
            <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings Dashboard (per Handy)</h2>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-3">
                        <img
                            alt="Admin"
                            className="w-10 h-10 rounded-full"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuByNGef88GluCXVsixImwv295iGNJfQnhtCu0xKI4Oq3-gD6mH-crS1c1CgFlSU_mDvopWYPqr7uIH42HcfXgrkzEWltxHo3i1k8b0b_3c8v18_hCBVZcjxAYsTAKNYHrAC2QjT6jrEbWt6PUQ9bjximaHID-NZd35HZlTmIY_ake4qylGu4TdSi0f-Jguf1IwK__e6sJf4kAcSOEwdkqPXasJ7N6ybchHaLqy7DBhh0xjN0v8Io7kt3wmwBq5VsQle_wQMqG-jqVNk"
                        />
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Admin</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">admin@taskconnect.com</p>
                        </div>
                    </div>
                    <button className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Handy..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="relative">
                            <select className="appearance-none w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
                                <option>Sort by: Earnings (High to Low)</option>
                                <option>Sort by: Earnings (Low to High)</option>
                                <option>Sort by: Name (A-Z)</option>
                                <option>Sort by: Name (Z-A)</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                        <Download className="w-5 h-5" />
                        <span>Export Data</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                        <table className="w-full min-w-[800px] text-sm text-left">
                            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Handy
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Total Earnings
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Tasks Completed
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Last Payout
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {handyEarnings.map((handy) => (
                                    <tr
                                        key={handy.id}
                                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    alt={handy.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    src={handy.avatar}
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{handy.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {handy.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                                            {handy.earnings}
                                        </td>
                                        <td className="px-6 py-4">{handy.tasks}</td>
                                        <td className="px-6 py-4">{handy.lastPayout}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[handy.statusColor as keyof typeof statusColors]
                                                    }`}
                                            >
                                                {handy.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-medium text-primary hover:underline">
                                                View Details
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>Showing 1 to 5 of 50 Handys</p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled
                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
