interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewCard({ name, rating, comment, date }: ReviewCardProps) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-blue/10 shadow-lg">
      {/* Header: Name + Rating */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">{name}</h3>

        {/* Star rating */}
        <span className="text-yellow-400 text-sm">
          {"★".repeat(rating)}
          <span className="text-gray-600">
            {"★".repeat(10 - rating)}
          </span>
        </span>
      </div>

      {/* Comment */}
      <p className="text-gray-300 leading-relaxed">
        {comment}
      </p>

      {/* Date */}
      <div className="mt-3 text-xs text-gray-500">
        {date}
      </div>
    </div>
  );
}
