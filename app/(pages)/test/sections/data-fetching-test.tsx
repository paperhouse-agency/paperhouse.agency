export async function DataFetchingTest() {
  return (
    <div className="space-y-4 p-6 border border-current/20 rounded-lg">
      <div className="space-y-2">
        <h3 className="font-bold">Data Fetching</h3>
        <p className="text-sm opacity-70">No CMS configured</p>
      </div>

      <div className="text-xs opacity-50 pt-4 border-t border-current/10">
        ℹ️ cacheSignal automatically aborts requests when cache expires
      </div>
    </div>
  )
}
