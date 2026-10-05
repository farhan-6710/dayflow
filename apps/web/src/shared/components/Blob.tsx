import { cn } from "@/shared/lib/utils";

type BlobProps = {
  className?: string;
};

export function Blob({ className }: BlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="animate-blob-1 absolute -left-20 -top-20 size-128 rounded-full bg-blue-500/20 blur-[100px] filter dark:bg-slate-700/18 sm:size-160" />
      <div className="animate-blob-2 absolute -right-20 top-20 size-120 rounded-full bg-indigo-500/15 blur-[100px] filter dark:bg-zinc-700/15 sm:size-152" />
      <div className="animate-blob-3 absolute -bottom-16 left-16 size-128 rounded-full bg-sky-400/18 blur-[110px] filter dark:bg-slate-800/25 sm:size-168" />
      <div className="animate-blob-4 absolute bottom-1/4 -right-16 size-112 rounded-full bg-blue-400/12 blur-[100px] filter dark:bg-slate-700/12 sm:size-144" />
    </div>
  );
}

export default Blob;
