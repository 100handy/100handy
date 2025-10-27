import { Upload, Bold, Italic, Underline, List, ListOrdered, Link2, Image, Video } from 'lucide-react'

export default function CreatePagePage() {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <form className="space-y-6">
            {/* Page Title */}
            <div>
              <label htmlFor="page-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Title
              </label>
              <input
                type="text"
                id="page-title"
                placeholder="Enter page title"
                className="w-full pl-3 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label htmlFor="page-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <button type="button" className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                  <button type="button" className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <List className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                  <button type="button" className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Link2 className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Image className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Video className="w-4 h-4" />
                  </button>
                </div>
                {/* Textarea */}
                <textarea
                  id="page-content"
                  placeholder="Start writing your content..."
                  className="w-full h-64 p-4 border-0 bg-white dark:bg-gray-900/50 resize-y focus:outline-none focus:ring-0 text-gray-800 dark:text-gray-200"
                ></textarea>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Settings</h3>
              
              <div>
                <label htmlFor="meta-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="meta-title"
                  placeholder="Enter meta title"
                  className="w-full pl-3 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Description
                </label>
                <textarea
                  id="meta-description"
                  placeholder="Enter meta description"
                  className="w-full pl-3 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-y"
                ></textarea>
              </div>
            </div>

            {/* URL Slug and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="url-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  id="url-slug"
                  placeholder="/example-page"
                  className="w-full pl-3 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Pending Review</option>
                </select>
              </div>
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Featured Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-800/50 rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-base">publish</span>
                Publish Page
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
