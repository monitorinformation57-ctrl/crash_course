export default function Loading() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex items-center gap-3 text-[#18356B]">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#18356B]/20 border-t-[#18356B]" />
        <span className="text-lg font-semibold uppercase tracking-wide">
          Loading...
        </span>
      </div>
    </div>
  );
}
