import { Recommendation } from "@/lib/types";

interface ResultCardProps {
  rec: Recommendation;
  rank: number;
}

export default function ResultCard({ rec, rank }: ResultCardProps) {
  const isBest = rank === 1;

  const rankStyles = {
    1: "bg-purple-50 text-purple-800 border-0",
    2: "bg-gray-100 text-gray-500 border border-gray-200",
    3: "bg-gray-100 text-gray-500 border border-gray-200",
  }[rank] ?? "bg-gray-100 text-gray-400 border border-gray-200";

  const badgeStyles = isBest
    ? "bg-purple-50 text-purple-800"
    : "bg-blue-50 text-blue-800";

  const cleanUrl = rec.url.replace(/^https?:\/\//, "");

  return (
    <div
      className={`bg-white rounded-xl p-5 ${
        isBest
          ? "border-2 border-purple-600"
          : "border border-gray-200"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        {/* Rank badge */}
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${rankStyles}`}
        >
          #{rank}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-base font-medium text-gray-900">
              {rec.tool}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStyles}`}
            >
              {rec.label}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {rec.category}&nbsp;·&nbsp;
            <a
              href={rec.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {cleanUrl}
            </a>
          </div>
        </div>

        {/* Score */}
        <div className="flex-shrink-0 text-center">
          <div className="text-xl font-medium text-purple-800">{rec.score}</div>
          <div className="text-xs text-gray-400">match</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Why section */}
      <div className="mb-3">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
          {isBest ? "Why it's the best pick" : "Why consider this"}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{rec.why}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {rec.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-400 border border-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
