import { Lock, Users, Globe } from "lucide-react";

const visibilityOptions = [
  {
    title: "Private",
    description:
      "Only board members can see this board. Workspace admins can close the board or remove members.",
    icon: Lock
  },
  {
    title: "Workspace",
    description:
      "All members of the Trello Workspace can see and edit this board.",
    icon: Users
  },
  {
    title: "Public",
    description:
      "Anyone on the internet can see this board. Only board members can edit.",
    icon: Globe
  }
];

export default function VisibilityDropdown({
  selectedVisibility,
  setSelectedVisibility,
  setShowVisibilityDropdown
}: {
  selectedVisibility: string;
  setSelectedVisibility: (v: string) => void;
  setShowVisibilityDropdown: (v: boolean) => void;
}) {
  return (
    <div
      className="absolute top-full left-0 mt-2 w-full bg-white rounded-md shadow-up-down z-50 border border-gray-200 cursor-pointer py-2"
      onClick={(e) => e.stopPropagation()}
    >
      {visibilityOptions.map(({ title, description, icon: Icon }) => (
        <div
          key={title}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedVisibility(title);
            setShowVisibilityDropdown(false);
          }}
          className={`flex items-start gap-3 px-4 py-3 transition-colors ${
            selectedVisibility === title
              ? "bg-blue-200 hover:bg-blue-200 border-2 border-r-0 border-y-0 border-l-blue-600 text-blue-600 outline-none"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          {/* Icon */}
          <Icon
            className={`w-6 h-6 mt-1 ${
              selectedVisibility === title ? "text-blue-600" : "text-black"
            }`}
          />

          {/* Texts */}
          <div>
            <h4
              className={`font-semibold text-sm ${
                selectedVisibility === title ? "text-blue-700" : "text-gray-900"
              }`}
            >
              {title}
            </h4>
            <p
              className={`text-xs leading-snug text-blue-600${
                selectedVisibility === description
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
