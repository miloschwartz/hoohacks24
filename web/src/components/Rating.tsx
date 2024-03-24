import * as model from "../../../model";

interface RatingProps {
  rating: model.Rating;
  size: "xs" | "sm" | "md" | "lg";
}

function Rating({ rating, size }: RatingProps) {
  // use tailwind colors
  const getRatingColor = (rating: model.Rating) => {
    switch (rating) {
      case model.Rating.VERY_LOW:
        return "bg-red-500";
      case model.Rating.LOW:
        return "bg-yellow-500";
      case model.Rating.MEDIUM:
        return "bg-yellow-500";
      case model.Rating.HIGH:
        return "bg-green-500";
      case model.Rating.VERY_HIGH:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`rating rating-${size} ml-auto gap-1.5`}>
      <input
        type="radio"
        className={`mask mask-circle ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.VERY_LOW}
        disabled
      />
      <input
        type="radio"
        className={`mask mask-circle  ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.LOW}
        disabled
      />
      <input
        type="radio"
        className={`mask mask-circle  ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.MEDIUM}
        disabled
      />
      <input
        type="radio"
        className={`mask mask-circle  ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.HIGH}
        disabled
      />
      <input
        type="radio"
        className={`mask mask-circle  ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.VERY_HIGH}
        disabled
      />
    </div>
  );
}

export default Rating;
