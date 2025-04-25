import React from "react";

interface EmotionBadgeProps {
  emotion: string;
  size?: "sm" | "md" | "lg";
}

const EmotionBadge: React.FC<EmotionBadgeProps> = ({
  emotion,
  size = "md",
}) => {
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "bg-emotion-happy text-black dark:text-white";
      case "sad":
        return "bg-emotion-sad text-black dark:text-white";
      case "angry":
        return "bg-emotion-angry text-black dark:text-white";
      case "fear":
        return "bg-emotion-fear text-black dark:text-white";
      case "surprise":
        return "bg-emotion-surprise text-black dark:text-white";
      case "neutral":
      default:
        return "bg-emotion-neutral text-black dark:text-white";
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "lg":
        return "text-base px-3 py-1.5";
      case "md":
      default:
        return "text-sm px-2.5 py-1";
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium capitalize
        ${getEmotionColor(emotion)} ${getSizeClass(size)}`}
    >
      {emotion}
    </span>
  );
};

export default EmotionBadge;
