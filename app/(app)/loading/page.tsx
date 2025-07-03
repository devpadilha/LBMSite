function LoadingSpinner() {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC610D]"></div>
  );
}
export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <LoadingSpinner />
    </div>
  );
}