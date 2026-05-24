export function FieldErrorText({ error }: { error?: string | null }) {
  if (!error) return null

  return (
    <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
      {error}
    </p>
  )
}
