import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, ArrowLeft } from 'lucide-react'
import Header from '@/components/header'
import { useCreateUser } from '@/lib/api/users'
import type { UserRole } from '@/lib/database.types'

export default function AddUserPage() {
  const navigate = useNavigate()
  const createUser = useCreateUser()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    postcode: '',
    role: 'customer' as UserRole,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      await createUser.mutateAsync(formData)

      // Success - redirect to users list
      navigate('/users', {
        replace: true,
        state: { message: 'User created successfully!' },
      })
    } catch (error: unknown) {
      console.error('Failed to create user:', error)
      const message = error instanceof Error ? error.message : 'Failed to create user. Please try again.'
      setErrors({
        submit: message,
      })
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Add New User" />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/users"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>

          <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="e.g., John"
                    className={`w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border ${errors.firstName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      } focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="e.g., Doe"
                    className={`w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border ${errors.lastName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      } focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="e.g., john.doe@example.com"
                  className={`w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                    } focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter a secure password (min 6 characters)"
                  className={`w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border ${errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                    } focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g., +1-555-123-4567"
                    className="w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
                  />
                </div>

                <div>
                  <label
                    htmlFor="postcode"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Postcode
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => handleInputChange('postcode', e.target.value)}
                    placeholder="e.g., SW1A 1AA"
                    className="w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  User Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('role', 'customer')}
                    className={`flex items-center p-4 rounded-lg border-2 transition-colors ${formData.role === 'customer'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.role === 'customer'
                            ? 'border-primary'
                            : 'border-slate-300 dark:border-slate-700'
                          }`}
                      >
                        {formData.role === 'customer' && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Customer</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('role', 'handy')}
                    className={`flex items-center p-4 rounded-lg border-2 transition-colors ${formData.role === 'handy'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.role === 'handy'
                            ? 'border-primary'
                            : 'border-slate-300 dark:border-slate-700'
                          }`}
                      >
                        {formData.role === 'handy' && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Handy</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('role', 'admin')}
                    className={`flex items-center p-4 rounded-lg border-2 transition-colors ${formData.role === 'admin'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.role === 'admin'
                            ? 'border-primary'
                            : 'border-slate-300 dark:border-slate-700'
                          }`}
                      >
                        {formData.role === 'admin' && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Admin</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link
                  to="/users"
                  className="h-12 px-6 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-primary text-white text-sm font-medium shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createUser.isPending ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Add User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
