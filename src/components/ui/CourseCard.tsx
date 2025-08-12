import Image from "next/image";
import { Bookmark } from "lucide-react";

interface CourseCardProps {
  category: string;
  title: string;
  subtitle?: string;
  progress: number;
  lessons: number;
  totalLessons: number;
  students: string[];
  color: "yellow" | "purple" | "blue" | "orange";
  additionalStudents: number;
  ctaText?: string;
}

const colorVariants = {
  yellow: {
    bg: "bg-brand-yellow/20",
    border: "border-brand-yellow",
    progress: "bg-brand-yellow",
    tag: "bg-brand-yellow/80",
  },
  purple: {
    bg: "bg-brand-purple/20",
    border: "border-brand-purple",
    progress: "bg-brand-purple",
    tag: "bg-brand-purple/80",
  },
  blue: {
    bg: "bg-blue-500/20",
    border: "border-blue-500",
    progress: "bg-blue-500",
    tag: "bg-blue-500/80",
  },
  orange: {
    bg: "bg-brand-orange/20",
    border: "border-brand-orange",
    progress: "bg-brand-orange",
    tag: "bg-brand-orange/80",
  },
};

const CourseCard: React.FC<CourseCardProps> = ({
  category,
  title,
  subtitle,
  progress,
  lessons,
  totalLessons,
  students,
  color,
  additionalStudents,
  ctaText = "Continue",
}) => {
  const variants = colorVariants[color];

  return (
    <div
      className={`p-6 rounded-2xl border ${variants.border} ${variants.bg} flex flex-col justify-between h-full`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full text-black ${variants.tag}`}
          >
            {category}
          </span>
          <button>
            <Bookmark size={24} className="text-brand-black" />
          </button>
        </div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-700 mb-2">{subtitle}</p>
        )}
      </div>
      <div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Progress</p>
          <div className="w-full bg-gray-300 rounded-full h-2.5">
            <div
              className={`${variants.progress} h-2.5 rounded-full`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-right mt-1 text-gray-600">
            {lessons}/{totalLessons} lessons
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {students.map((student, index) => (
              <Image
                key={index}
                src={`https://i.pravatar.cc/40?u=${student}`}
                alt="student"
                width={32}
                height={32}
                className="rounded-full border-2 border-white"
              />
            ))}
            {additionalStudents > 0 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                +{additionalStudents}
              </div>
            )}
          </div>
          <button className="bg-brand-orange text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
