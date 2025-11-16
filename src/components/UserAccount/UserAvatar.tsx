import { twMerge } from "tailwind-merge";

const getUserInitials = (fullName?: string) => {
  if (!fullName) return "";

  const names = fullName.trim().split(" ").filter(Boolean);
  const [first, second] = names;

  if (!first) return "";
  if (!second) return first[0].toUpperCase();

  return `${first[0].toUpperCase()}${second[0].toUpperCase()}`;
};

export default function UserAvatar({
  user,
  className
}: {
  user?: { fullName?: string } | null;
  className?: string;
}) {
  // Define the base classes that apply to every avatar
  const baseClasses =
    "flex items-center justify-center rounded-full bg-blue-600 text-white font-bold uppercase";

  // Define the default size classes (the ones you want to be easily overridden)
  const defaultSizeClasses = "w-10 h-10 text-sm";

  // 3. Merge the default classes and any passed-in className
  // twMerge will automatically handle overwriting conflicting classes (e.g., if you pass 'w-16 h-16',
  // it will override the default 'w-10 h-10').
  const finalClasses = twMerge(baseClasses, defaultSizeClasses, className);
  return (
    <div className={finalClasses}>{getUserInitials(user?.fullName) || "?"}</div>
  );
}
