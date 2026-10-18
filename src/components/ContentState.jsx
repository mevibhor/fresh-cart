const ContentState = ({
  isLoading,
  error,
  isEmpty,
  emptyMessage = "Nothing to display yet.",
  onRetry,
  children,
}) => {
  if (isLoading) {
    return (
      <div
        className="flex min-h-40 items-center justify-center gap-3 py-10 text-sm text-gray-500"
        role="status"
      >
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center"
        role="alert"
      >
        <p className="text-sm text-red-700">
          {error.message || "Something went wrong. Please try again."}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-md bg-white px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200 hover:bg-red-100"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <p className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
        {emptyMessage}
      </p>
    );
  }

  return children;
};

export default ContentState;
