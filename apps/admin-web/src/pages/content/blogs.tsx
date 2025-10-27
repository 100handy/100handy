import { Search, Plus } from 'lucide-react'
import Header from '@/components/header'

const blogPosts = [
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPIjjlEmxle-0o32H69Ai5JzvaKgybcDz42v57-KO0tLyPdUInL7bQCpjhMF1L3Vjx49jpKNCsra2ISMAR_jLApsi05SBadYpPd1QRRCWl0gTtzMzBboTkkquP5YdAlmIq3jAI-qBp5Bx0GkKLCztZl3Ig3w-r_RKFN19jNvvYXnaxh9wT7m-kE_W-oRz9BMiXj0XtqxJsz56SI6F394sKoFT9cprYe4y2rLxYVKHD3V28CZRfOyYTRWnpw4neqhzXVW8736Zr4N3g',
        title: '10 Tips for a Successful Home Renovation',
        author: 'John Doe',
        status: 'Published',
        statusColor: 'green',
        lastModified: '2023-10-27',
    },
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY9FV2tAFSUMYl4zvElnojCp7dA3SqM5RvACtZ4nAVs6h4Tov2uona2ZoWgsA9YNDD_eZ2RVIVDehKnf9SxZh_MfIUJ7q2uKtJmXoTookb3hSFmajHSlETyHpcFfOXWVJg-frrpdOxiqN1Iz1S6MEzZ_hJnDzBePx8R1cHTLRJ9suFTl85CjnvBdpkHkqX_J-MER4PXCAAAjXRzmd4f3nMNrQRT1YxIIJ6pjBmB5In56c0vg5nIy6yNTtY9G8ycft4o6rGl5eXluZp',
        title: 'DIY vs. Hiring a Pro: Which is Right for You?',
        author: 'Jane Smith',
        status: 'Published',
        statusColor: 'green',
        lastModified: '2023-10-25',
    },
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkA52g1Cmfzn4QyktyFJpqMBmRxm7wG9OJfsCEG0ad9nYvk7pHGEY3EKCjSeLdiKXBaNnD2o-OYIAZVhbPMAWTj4wMrsJSSuDZPAR9hpsGocKKokP3OYfe92Sj5wK0W2agAsOrY4RYm16RKX-hARBQ65DlG0v50c7JMPGTt0tydLxsEeBbxB9UCHFEXmvel8WQZbxfAsCtoM70jGE3OiF2YRIM3QnqDY0WjEDazUgExPWXWa7SQY_53KO8vBHnEQob0uj16yuGp2r0',
        title: 'How to Budget for Your Next Big Project',
        author: 'Mike Johnson',
        status: 'Draft',
        statusColor: 'blue',
        lastModified: '2023-10-28',
    },
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6K43ekVPQRw7lcmt8lB6fjZHv0aYmniXkCUb8eHNp49Y8Ph3sjwlgM_muvtwBlb7iUBEVdkEuOoE18hKY1atMNowiPgfZ_H1taMSJYCjDWdqBcJEzpEt247Rffju6aWCZM09sUzM0PbT798Ey7AXmYosJ-zCEs3p1qgXsLxLWggZg4U2Osx_PoVcqOhB1EqK1s2zn1bmJI1IyCao956jtwLeBaLyidR4yl4CbPWzACOwBuY_3oQ96f5ZK3XIKK6FGqA-cCmV2qB-g',
        title: 'The Top 5 Must-Have Tools for Every Homeowner',
        author: 'Sarah Williams',
        status: 'Pending Review',
        statusColor: 'yellow',
        lastModified: '2023-10-29',
    },
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGx6oVTWUurlLp2RNjH7aFjchTJAAfgiAmbao0YyW5seyENuO20Iw4jJPGmkte2QEmIMkBVtZ1FH-xZ5ly9oTY0qyojl9tkCdZqd6pB8UPlRR-Tr9M-oyjAZjEGjcr3X3vmKhp_wtKPEUfV14Mx2Rv5cCx-EroeQnHXkzKVuyEeLiTlfuQsAl7pNrGJPJ8SU_qb_qFud0NL-LuZtqUWVSuG3QrH_ylOk3y7IZHVQ1BnQ5ef0GaiV9JDSyRaw3QtMQlPnW4fGFjfPIw',
        title: 'Choosing the Right Paint Color for Your Space',
        author: 'David Brown',
        status: 'Published',
        statusColor: 'green',
        lastModified: '2023-10-20',
    },
]

export default function BlogsPage() {
    return (
        <div className="flex-1 flex flex-col">
            <Header title="Blog Posts" />
            <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                <div className="w-full">
                    {/* Search and Create Button */}
                    <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                        Create New Post
                    </button>
                </div>

                {/* Blog Posts Table */}
                <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3" scope="col">Image</th>
                                <th className="px-6 py-3" scope="col">Post Title</th>
                                <th className="px-6 py-3" scope="col">Author</th>
                                <th className="px-6 py-3" scope="col">Status</th>
                                <th className="px-6 py-3" scope="col">Last Modified</th>
                                <th className="px-6 py-3" scope="col">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogPosts.map((post, index) => (
                                <tr
                                    key={index}
                                    className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                                >
                                    <td className="px-6 py-4">
                                        <img
                                            src={post.image}
                                            alt="Blog post"
                                            className="h-12 w-20 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4">{post.author}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.statusColor === 'green'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : post.statusColor === 'blue'
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                }`}
                                        >
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{post.lastModified}</td>
                                    <td className="px-6 py-4 text-right">
                                        <a className="font-medium text-primary hover:underline mr-4" href="#">
                                            Edit
                                        </a>
                                        <a className="font-medium text-red-600 dark:text-red-500 hover:underline" href="#">
                                            Delete
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Edit Post & SEO Section */}
                <div className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Post & SEO</h3>
                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left Column - Post Content */}
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Post Title
                                    </label>
                                    <input
                                        type="text"
                                        id="post-title"
                                        defaultValue="10 Tips for a Successful Home Renovation"
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Post Content
                                    </label>
                                    <textarea
                                        id="post-content"
                                        rows={10}
                                        defaultValue="Start with a clear plan and budget. This will help you stay on track and avoid overspending. Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="meta-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        id="meta-title"
                                        defaultValue="10 Home Renovation Tips for Success | TaskPro Blog"
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Meta Description
                                    </label>
                                    <textarea
                                        id="meta-description"
                                        rows={3}
                                        defaultValue="Get the best tips for your next home renovation project. Our guide covers everything from planning to execution for a successful result."
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="meta-keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Meta Keywords
                                    </label>
                                    <input
                                        type="text"
                                        id="meta-keywords"
                                        defaultValue="home renovation, DIY, home improvement, renovation tips"
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Right Column - Featured Image */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Featured Image
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <img
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbzP9zfU4yiw51ixPXoQXO6HDea5w8mPmTnLlT50kQrDCPBTyLrekzWLa62Cw5fwmJhf23xGCJhbIZIlb8qAoMRuO7Qob-9eNvl_3kk9WsqE-6S-7CjpFy9i3HqDumHeE9sxX2Tyo5PQJ6pPNoeUajY7jZnfBP8-yRHxt62FCcHHkE27KMwPuEjDWPlFKdDPgCaU12czmDFBCvmxlF9RD0KIbXakKEO8lPqSsHiKO2NBojNSILFMo2bQ_ZvXoYrsI0AslCUKU2DlqD"
                                                alt="Featured preview"
                                                className="mx-auto h-24 w-auto object-cover rounded-md mb-4"
                                            />
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
}
