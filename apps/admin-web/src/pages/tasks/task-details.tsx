import { Edit, Calendar, X, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'

const chatMessages = [
    {
        sender: 'Sarah J.',
        message:
            "Hi Alex, just wanted to confirm our appointment for tomorrow at 2 PM. I'll be there a few minutes early.",
        time: 'March 15, 2024, 5:30 PM',
        isHandy: false,
        avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBRYtvMJpACqNwJAPXMfaPVhYezl0OU9Z3pF4Wbmj0vKfNImL5SwtsPfz8gq9cJspaLw-o-U36vHjGwe-LpRNnhUjg0Ggz8YOIRbZpEdttXrnynWZsZkRl0CdCplfzwjDu_0aosA0ixeUcUQ9rvg9iTaIOxdI9-f81VSy5f8JcPXfoQWRQ1dgrNdZac-NJPjiuphaRhLbXHSShk7uY6CdAe3iw0lfHJ678kSvNiz13IgFN7zbvVikNBJqtqavfTzQU3ACSWkI61YkMO',
    },
    {
        sender: 'Alex P. (Handy)',
        message:
            'Hi Sarah, sounds great! See you then. Let me know if you need anything from my side.',
        time: 'March 15, 2024, 5:32 PM',
        isHandy: true,
        avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBRYtvMJpACqNwJAPXMfaPVhYezl0OU9Z3pF4Wbmj0vKfNImL5SwtsPfz8gq9cJspaLw-o-U36vHjGwe-LpRNnhUjg0Ggz8YOIRbZpEdttXrnynWZsZkRl0CdCplfzwjDu_0aosA0ixeUcUQ9rvg9iTaIOxdI9-f81VSy5f8JcPXfoQWRQ1dgrNdZac-NJPjiuphaRhLbXHSShk7uY6CdAe3iw0lfHJ678kSvNiz13IgFN7zbvVikNBJqtqavfTzQU3ACSWkI61YkMO',
    },
]

const mediaImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBdssZCN2PwYJU7HMc4PF9IA_LyvZSgvk3e-QHbfVWE3jVNTCL3h52bBWjfAzkLLz3mIHMrLcvWOnlRxQtlSdwKuBzj9qG_pcMZ5BQDAE1lwilserc3wY8yo-FHxCl4R2KysDs627MxbaaFzpp8QWOEjg9zvlBQMPiVsXxbcDFsuhUWtyP_IZsErqlHAVbY_bKTCrdVM6TnBBTRTvYTdBwzEID1qaUYAvc4txJkjHtVm_4yMM570PPyRDjXHu3HsJ5vJyibMpdOfjS6',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAURRGDJjUa_1xRqmMW2U-_-yVrPiBdEukzh6f_RnZ8VfvakElFy866SwhG3sftQM6c6iTSCzfi0aWpNXDRqlFHvgvQSZr-R0x36N1PFuUiH7iIB9vhfvwcvCE0XykO5Y6W3umcUTUIEvpX3pLnLBlubJeClpPYJcCMBQu4Wwmk4v-gcAziwtFfcJuNmEfi5Ry0MCHBckDWaxex2IWarjaPwsU8SkLQsV14gTlp2kxLFkTjkZIY_ttUjR2TCBHFBeCxn04AtwxqRT-F',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDVIXcoc67Mtsv_tEuDIMT8U7VYsVZda9MsYsrgBCZxpcdCTzapwFC0zWEk-lsCquEn2LB9qPRGNvoCMYIcazVHkFQ7X2Rb_bOB0X1YZq3E4eXHLPpyYzB10dQe6kKgrKwoFBTpnpxVraOn96ZtMsNOjWtq-a8qXzdSk4KzBIRSVrB3DR3MJPYLOsllLXRPzPYMWRzjWf0jN-nm3MHshN9B9fRRWFbqE9KUmyy1rummfQjVeB3rxR-l_awDtV6CdkHqrDjfMsVoAlnh',
]

export default function TaskDetailsPage() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Task Details #12346" />
            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Viewing details for task #12346
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Task Information */}
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                    Task Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Task ID
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white font-medium">
                                            #12346
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Status
                                        </label>
                                        <p className="mt-1">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                                                Scheduled
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Category
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white">Moving Help</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Scheduled Date & Time
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            March 16, 2024, 2:00 PM
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Location
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            123 Main St, Los Angeles, CA 90001
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Description
                                        </label>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                                            Need help moving a couch, a bed frame, and a few boxes from a
                                            2nd-floor apartment to a moving truck. No stairs involved, but
                                            the couch is heavy.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat History */}
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                                <h3 className="text-xl font-semibold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                    Chat History
                                </h3>
                                <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                                    {chatMessages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex gap-3 ${msg.isHandy ? 'justify-end' : ''}`}
                                        >
                                            {!msg.isHandy && (
                                                <div
                                                    className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                                                    style={{ backgroundImage: `url('${msg.avatar}')` }}
                                                />
                                            )}
                                            <div className={msg.isHandy ? 'text-right' : ''}>
                                                <div
                                                    className={`${msg.isHandy
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 dark:bg-gray-700'
                                                        } rounded-lg p-3 max-w-xs`}
                                                >
                                                    <p
                                                        className={`text-sm ${msg.isHandy ? '' : 'text-gray-800 dark:text-gray-200'
                                                            }`}
                                                    >
                                                        {msg.message}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {msg.sender} - {msg.time}
                                                </p>
                                            </div>
                                            {msg.isHandy && (
                                                <div
                                                    className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                                                    style={{ backgroundImage: `url('${msg.avatar}')` }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="w-full pl-4 pr-12 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80">
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Media */}
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                    Media
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {mediaImages.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Task media ${index + 1}`}
                                            className="rounded-lg object-cover aspect-square"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Assigned Handy */}
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                    Assigned Handy
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-full bg-cover bg-center"
                                        style={{
                                            backgroundImage:
                                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRYtvMJpACqNwJAPXMfaPVhYezl0OU9Z3pF4Wbmj0vKfNImL5SwtsPfz8gq9cJspaLw-o-U36vHjGwe-LpRNnhUjg0Ggz8YOIRbZpEdttXrnynWZsZkRl0CdCplfzwjDu_0aosA0ixeUcUQ9rvg9iTaIOxdI9-f81VSy5f8JcPXfoQWRQ1dgrNdZac-NJPjiuphaRhLbXHSShk7uY6CdAe3iw0lfHJ678kSvNiz13IgFN7zbvVikNBJqtqavfTzQU3ACSWkI61YkMO')",
                                        }}
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            Alex Parker
                                        </p>
                                        <div className="flex items-center gap-1 text-sm text-yellow-500">
                                            <span>⭐</span>
                                            <span>4.9 (125 reviews)</span>
                                        </div>
                                        <a
                                            href="#"
                                            className="text-primary text-sm font-medium hover:underline"
                                        >
                                            View Profile
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Customer */}
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                    Customer
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-full bg-cover bg-center"
                                        style={{
                                            backgroundImage:
                                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRYtvMJpACqNwJAPXMfaPVhYezl0OU9Z3pF4Wbmj0vKfNImL5SwtsPfz8gq9cJspaLw-o-U36vHjGwe-LpRNnhUjg0Ggz8YOIRbZpEdttXrnynWZsZkRl0CdCplfzwjDu_0aosA0ixeUcUQ9rvg9iTaIOxdI9-f81VSy5f8JcPXfoQWRQ1dgrNdZac-NJPjiuphaRhLbXHSShk7uY6CdAe3iw0lfHJ678kSvNiz13IgFN7zbvVikNBJqtqavfTzQU3ACSWkI61YkMO')",
                                        }}
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            Sarah Johnson
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Member since 2022
                                        </p>
                                        <a
                                            href="#"
                                            className="text-primary text-sm font-medium hover:underline"
                                        >
                                            View Profile
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                    Actions
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        to="/tasks/edit/12346"
                                        className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90"
                                    >
                                        <Edit className="w-5 h-5" />
                                        Edit Task
                                    </Link>
                                    <Link
                                        to="/tasks/reschedule/12346"
                                        className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-yellow-600"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Reschedule Task
                                    </Link>
                                    <Link
                                        to="/tasks/cancel/12346"
                                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-600"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel Task
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
