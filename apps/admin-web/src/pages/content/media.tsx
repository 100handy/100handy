import { Search, Plus, Edit, Trash2, Film } from 'lucide-react'
import Header from '@/components/header'

const mediaItems = [
  {
    type: 'image',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPIjjlEmxle-0o32H69Ai5JzvaKgybcDz42v57-KO0tLyPdUInL7bQCpjhMF1L3Vjx49jpKNCsra2ISMAR_jLApsi05SBadYpPd1QRRCWl0gTtzMzBboTkkquP5YdAlmIq3jAI-qBp5Bx0GkKLCztZl3Ig3w-r_RKFN19jNvvYXnaxh9wT7m-kE_W-oRz9BMiXj0XtqxJsz56SI6F394sKoFT9cprYe4y2rLxYVKHD3V28CZRfOyYTRWnpw4neqhzXVW8736Zr4N3g',
    filename: 'renovation_tip_1.jpg',
  },
  {
    type: 'image',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY9FV2tAFSUMYl4zvElnojCp7dA3SqM5RvACtZ4nAVs6h4Tov2uona2ZoWgsA9YNDD_eZ2RVIVDehKnf9SxZh_MfIUJ7q2uKtJmXoTookb3hSFmajHSlETyHpcFfOXWVJg-frrpdOxiqN1Iz1S6MEzZ_hJnDzBePx8R1cHTLRJ9suFTl85CjnvBdpkHkqX_J-MER4PXCAAAjXRzmd4f3nMNrQRT1YxIIJ6pjBmB5In56c0vg5nIy6yNTtY9G8ycft4o6rGl5eXluZp',
    filename: 'diy_vs_pro.png',
  },
  {
    type: 'video',
    filename: 'project_budget.mp4',
  },
  {
    type: 'image',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6K43ekVPQRw7lcmt8lB6fjZHv0aYmniXkCUb8eHNp49Y8Ph3sjwlgM_muvtwBlb7iUBEVdkEuOoE18hKY1atMNowiPgfZ_H1taMSJYCjDWdqBcJEzpEt247Rffju6aWCZM09sUzM0PbT798Ey7AXmYosJ-zCEs3p1qgXsLxLWggZg4U2Osx_PoVcqOhB1EqK1s2zn1bmJI1IyCao956jtwLeBaLyidR4yl4CbPWzACOwBuY_3oQ96f5ZK3XIKK6FGqA-cCmV2qB-g',
    filename: 'must_have_tools.jpg',
  },
  {
    type: 'image',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGx6oVTWUurlLp2RNjH7aFjchTJAAfgiAmbao0YyW5seyENuO20Iw4jJPGmkte2QEmIMkBVtZ1FH-xZ5ly9oTY0qyojl9tkCdZqd6pB8UPlRR-Tr9M-oyjAZjEGjcr3X3vmKhp_wtKPEUfV14Mx2Rv5cCx-EroeQnHXkzKVuyEeLiTlfuQsAl7pNrGJPJ8SU_qb_qFud0NL-LuZtqUWVSuG3QrH_ylOk3y7IZHVQ1BnQ5ef0GaiV9JDSyRaw3QtMQlPnW4fGFjfPIw',
    filename: 'paint_color.jpeg',
  },
  {
    type: 'image',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkA52g1Cmfzn4QyktyFJpqMBmRxm7wG9OJfsCEG0ad9nYvk7pHGEY3EKCjSeLdiKXBaNnD2o-OYIAZVhbPMAWTj4wMrsJSSuDZPAR9hpsGocKKokP3OYfe92Sj5wK0W2agAsOrY4RYm16RKX-hARBQ65DlG0v50c7JMPGTt0tydLxsEeBbxB9UCHFEXmvel8WQZbxfAsCtoM70jGE3OiF2YRIM3QnqDY0WjEDazUgExPWXWa7SQY_53KO8vBHnEQob0uj16yuGp2r0',
    filename: 'budget_planning.jpg',
  },
  {
    type: 'video',
    filename: 'intro_video.mov',
  },
  {
    type: 'image',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbzP9zfU4yiw51ixPXoQXO6HDea5w8mPmTnLlT50kQrDCPBTyLrekzWLa62Cw5fwmJhf23xGCJhbIZIlb8qAoMRuO7Qob-9eNvl_3kk9WsqE-6S-7CjpFy9i3HqDumHeE9sxX2Tyo5PQJ6pPNoeUajY7jZnfBP8-yRHxt62FCcHHkE27KMwPuEjDWPlFKdDPgCaU12czmDFBCvmxlF9RD0KIbXakKEO8lPqSsHiKO2NBojNSILFMo2bQ_ZvXoYrsI0AslCUKU2DlqD',
    filename: 'featured_image.png',
  },
]

export default function MediaPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header title="Media Library" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="w-full">
          {/* Search, Filters, and Upload Button */}
          <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search media..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                All
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                Images
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                Videos
              </button>
            </div>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Upload Media
          </button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {mediaItems.map((item, index) => (
            <div key={index} className="relative group aspect-square">
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt="Media file"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <Film className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col justify-between p-3 text-white">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium">{item.filename}</p>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button className="p-1.5 rounded-full bg-white/20 hover:bg-white/30">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-full bg-white/20 hover:bg-white/30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav aria-label="Page navigation">
            <ul className="inline-flex items-center -space-x-px">
              <li>
                <a
                  href="#"
                  className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="py-2 px-3 leading-tight text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="py-2 px-3 leading-tight text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="py-2 px-3 text-primary bg-blue-50 dark:bg-gray-700 border border-gray-300 dark:border-primary hover:bg-blue-100 hover:text-blue-700"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="py-2 px-3 leading-tight text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  4
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="py-2 px-3 leading-tight text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  5
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="py-2 px-3 leading-tight text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    </div>
  )
}
