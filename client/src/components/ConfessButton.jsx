import { Play } from "lucide-react";

export function ConfessButton({ onClick, disabled, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        flex items-center justify-center gap-2.5 px-5 py-3
        text-white font-bold text-base uppercase tracking-wider
        bg-yellow-400 hover:bg-yellow-500
        border-2 border-black rounded-full
        cursor-pointer relative overflow-hidden
        transition-all duration-500 ease
        active:scale-90 active:transition-all active:duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl
      "
    >
      <svg
        className="
          w-5 h-5 transition-all duration-500 ease
          group-hover:scale-300 group-hover:translate-x-1/2
          z-20
        "
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M7 4v16l11-8z" />
      </svg>

      <span
        className="
          now absolute left-0 transition-all duration-500 ease
          -translate-x-full
          group-hover:translate-x-2.5
          group-hover:transition-delay-300
          z-20
        "
      >
        Now
      </span>

      <span
        className="
          play transition-all duration-500 ease
          group-hover:translate-x-full
          group-hover:transition-delay-300
        "
      >
        {isLoading ? "..." : "Post"}
      </span>
    </button>
  );
}
