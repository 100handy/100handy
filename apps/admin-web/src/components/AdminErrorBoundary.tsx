import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface AdminErrorBoundaryProps {
  children: ReactNode
}

interface AdminErrorBoundaryState {
  error: Error | null
}

export class AdminErrorBoundary extends Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  state: AdminErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin screen crashed', error, errorInfo)
  }

  render() {
    if (!this.state.error) {
      return this.props.children
    }

    return (
      <main className="flex min-h-screen flex-1 items-center justify-center bg-background-light p-6 dark:bg-background-dark">
        <section className="w-full max-w-lg rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-gray-900">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-red-100 p-3 text-red-700 dark:bg-red-950/50 dark:text-red-300">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Something went wrong</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This admin screen failed to render. Your session is still active, and you can retry or move to another section.
              </p>
              <pre className="mt-4 max-h-36 overflow-auto rounded-lg bg-gray-100 p-3 text-xs text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                {this.state.error.message || 'Unknown admin screen error'}
              </pre>
              <button
                type="button"
                onClick={() => this.setState({ error: null })}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }
}
