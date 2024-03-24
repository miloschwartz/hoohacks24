import * as model from "../../../model";

interface RatingProps {
  rating: model.Rating;
}

function Rating({ rating }: RatingProps) {
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
    <div className="rating ml-auto">
      <input
        type="radio"
        className={`mask mask-star opacity-50 ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.VERY_LOW}
      />
      <input
        type="radio"
        className={`mask mask-star opacity-50 ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.LOW}
      />
      <input
        type="radio"
        className={`mask mask-star opacity-50 ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.MEDIUM}
      />
      <input
        type="radio"
        className={`mask mask-star opacity-50 ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.HIGH}
      />
      <input
        type="radio"
        className={`mask mask-star opacity-50 ${getRatingColor(rating)}`}
        defaultChecked={rating === model.Rating.VERY_HIGH}
      />
    </div>
  );
}

export default Rating;
