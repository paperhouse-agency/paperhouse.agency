export async function DataFetchingTest() {
  return (
    <div className="space-y-4 p-6 border border-current/20 rounded-lg">
      <div className="space-y-2">
        <h3 className="font-bold">cacheSignal Integration</h3>
        <p className="text-sm opacity-70">
          cacheSignal automatically aborts requests when cache expires
        </p>
        <code className="text-xs block p-2 bg-black/20 rounded">
          fetch() with cacheSignal uses auto-cleanup on cache expiry
        </code>
      </div>

      <div className="text-xs opacity-50 pt-4 border-t border-current/10">
        ℹ️ cacheSignal automatically aborts requests when cache expires
      </div>
    </div>
  )
}
