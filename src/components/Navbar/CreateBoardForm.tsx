import { ChevronLeft, X, ChevronDown } from "lucide-react";
import FloatingContainer from "../FloatingContainer";
import { useState } from "react";

interface CreateBoardFormProps {
  onBack?: () => void;
  onClose?: () => void;
  // optional: pass workspaces or other data from parent instead of using hardcoded data
  workspaces?: { id: number; name: string }[];
}

export default function CreateBoardForm({
  onBack = () => {},
  onClose = () => {},
  workspaces = [
    { id: 1, name: "Marketing Team" },
    { id: 2, name: "Development Hub" },
    { id: 3, name: "Design Studio" }
  ]
}: CreateBoardFormProps) {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );
  const [selectedVisibility, setSelectedVisibility] = useState<string | null>(
    null
  );

  return (
    <FloatingContainer className="top-0 right-0 w-[320px] text-white bg-[#1D2125] p-4 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 w-full">
        <ChevronLeft
          className="cursor-pointer hover:text-gray-400"
          onClick={(e) => {
            e.stopPropagation(); // prevent bubbling to parent handlers
            onBack();
          }}
        />
        <h4 className="text-[15px] font-semibold">Create board</h4>
        <X
          className="cursor-pointer hover:text-gray-400"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      </div>

      {/* Form */}
      <form
        className="space-y-5 w-full"
        onClick={(e) => e.stopPropagation()} // ensure clicks inside don't bubble out
        onSubmit={(e) => {
          e.preventDefault();
          // handle submit here or lift up via a passed callback prop
        }}
      >
        {/* Board Name */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Board Name</label>
          <input
            type="text"
            required
            placeholder="My Awesome Board"
            className="w-full bg-[#2C2F33] border border-[#3A3F44] rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Workspace */}
        <div className="relative">
          <label className="block text-sm mb-1 text-gray-300">Workspace</label>
          <div
            className="flex items-center bg-[#2C2F33] border border-[#3A3F44] rounded-md px-3 py-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowWorkspaceDropdown((prev) => !prev);
            }}
          >
            <span className="text-sm text-gray-200 flex-1">
              {selectedWorkspace || "Select workspace"}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>

          {showWorkspaceDropdown && (
            <div
              className="absolute top-full left-0 mt-1 w-full bg-[#2C2F33] border border-[#3A3F44] rounded-md shadow-md z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWorkspace(workspace.name);
                    setShowWorkspaceDropdown(false);
                  }}
                  className="px-3 py-2 text-sm text-gray-200 hover:bg-[#34363a] cursor-pointer"
                >
                  {workspace.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="relative">
          <label className="block text-sm mb-1 text-gray-300">Visibility</label>
          <div
            className="flex items-center bg-[#2C2F33] border border-[#3A3F44] rounded-md px-3 py-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowVisibilityDropdown((prev) => !prev);
            }}
          >
            <span className="text-sm text-gray-200 flex-1">
              {selectedVisibility || "Select visibility"}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>

          {showVisibilityDropdown && (
            <div
              className="absolute top-full left-0 mt-1 w-full bg-[#2C2F33] border border-[#3A3F44] rounded-md shadow-md z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {["Private", "Workspace", "Public"].map((option) => (
                <div
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVisibility(option);
                    setShowVisibilityDropdown(false);
                  }}
                  className="px-3 py-2 text-sm text-gray-200 hover:bg-[#34363a] cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-md transition-colors"
        >
          Create Board
        </button>
      </form>
    </FloatingContainer>
  );
}
