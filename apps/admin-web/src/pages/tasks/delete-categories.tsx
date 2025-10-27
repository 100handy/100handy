import { useState } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import Header from '@/components/header'

const categories = [
  { id: 1, name: 'Home Services', tasks: 125, isParent: true },
  { id: 2, name: 'Moving & Packing', tasks: 82, isParent: true },
  { id: 3, name: 'Packing & Unpacking', tasks: 45, isParent: false },
  { id: 4, name: 'Assembly', tasks: 210, isParent: true },
  { id: 5, name: 'Outdoor & Yard', tasks: 78, isParent: true },
]

export default function DeleteCategoriesPage() {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedCategories(categories.map((c) => c.id))
    } else {
      setSelectedCategories([])
    }
  }

  const handleSelectCategory = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((cid) => cid !== id))
      setSelectAll(false)
    } else {
      const newSelected = [...selectedCategories, id]
      setSelectedCategories(newSelected)
      if (newSelected.length === categories.length) {
        setSelectAll(true)
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Delete Categories" />
      <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Select categories to delete. Deleting a category will also delete all
              its sub-categories and disassociate any tasks linked to them.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Categories
                </h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="select-all"
                    className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Select All
                  </label>
                </div>
              </div>

              <ul className="space-y-3">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg ${
                      !category.isParent ? 'ml-8' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleSelectCategory(category.id)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                      />
                      <span
                        className={
                          category.isParent
                            ? 'font-medium text-gray-800 dark:text-gray-200'
                            : 'text-gray-600 dark:text-gray-400'
                        }
                      >
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.tasks} Tasks
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
              {selectedCategories.length > 0 && (
                <div className="bg-red-100/50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        Warning: Deletion is permanent
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>
                          You have selected{' '}
                          <strong>{selectedCategories.length} categories</strong> for
                          deletion. This action cannot be undone. Please confirm you
                          want to proceed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedCategories.length === 0}
                  className="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedCategories.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
