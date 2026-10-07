// Matches the first frame of the Preloader so there is no flash before it mounts
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-text text-offwhite">
      <p className="heading-3 flex items-center gap-3 dt:heading-2">
        <span className="size-2.5 rounded-full bg-primary" />
        Hello
      </p>
    </div>
  )
}
