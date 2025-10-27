import Link from "next/link";

export default function AllPagesPage() {
  const pages = {
    "Main Pages": [
      { path: "/", label: "Home" },
      { path: "/landing-v2", label: "Landing V2" },
      { path: "/welcome", label: "Welcome" },
      { path: "/dashboard", label: "Dashboard" },
    ],
    "Auth Pages": [
      { path: "/sign-in", label: "Sign In" },
      { path: "/sign-up", label: "Sign Up" },
      { path: "/forgot-password", label: "Forgot Password" },
      { path: "/reset-password", label: "Reset Password" },
      { path: "/verify-code", label: "Verify Code" },
    ],
    "User Pages": [
      { path: "/account", label: "Account" },
      { path: "/my-tasks", label: "My Tasks" },
    ],
    "Service Pages": [
      { path: "/services", label: "Services" },
      { path: "/all-services", label: "All Services" },
      { path: "/browse-pros", label: "Browse Pros" },
      { path: "/book-task", label: "Book Task" },
      { path: "/task-form", label: "Task Form" },
      { path: "/confirm-booking", label: "Confirm Booking" },
    ],
    "Tasker Pages": [
      { path: "/become-tasker", label: "Become Tasker" },
      { path: "/taskers", label: "Taskers" },
    ],
    "Location-Based Pages": [
      { path: "/handyman-london", label: "Handyman London" },
      { path: "/wallpapering-near-me", label: "Wallpapering Near Me" },
      { path: "/services-by-city", label: "Services By City" },
    ],
    "Info Pages": [
      { path: "/about-us", label: "About Us" },
      { path: "/contact", label: "Contact" },
      { path: "/help", label: "Help" },
      { path: "/help/trust-safety", label: "Help - Trust & Safety" },
      { path: "/press", label: "Press" },
      { path: "/for-business", label: "For Business" },
      { path: "/referral", label: "Referral" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            All Pages - Navigation
          </h1>
          <p className="text-gray-600">
            Quick navigation to all pages in the application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(pages).map(([category, pageList]) => (
            <div
              key={category}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {category}
              </h2>
              <ul className="space-y-2">
                {pageList.map((page) => (
                  <li key={page.path}>
                    <Link
                      href={page.path}
                      className="text-blue-600 hover:text-blue-800 hover:underline block py-1 transition-colors"
                    >
                      {page.label}
                    </Link>
                    <span className="text-xs text-gray-500 block">
                      {page.path}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

