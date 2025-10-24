import { ChevronLeft, X, ChevronDown } from "lucide-react";
import FloatingContainer from "../FloatingContainer";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { fetchBoards } from "../../store/slices/boardSlice";

interface CreateBoardFormProps {
  onBack?: () => void;
  onClose?: () => void;
  onCreate: (data: {
    title: string;
    description?: string;
    color?: string;
    workspaceName: string;
    visibility: string;
  }) => void;
}

export default function CreateBoardForm({
  onBack = () => {},
  onClose = () => {},
  onCreate
}: CreateBoardFormProps) {
  const dispatch = useAppDispatch();

  const { boardId } = useParams<{ boardId: string }>();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { workspaces } = useAppSelector((state) => state.workspaces);
  const { loading } = useAppSelector((state) => state.boards);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );
  const [selectedVisibility, setSelectedVisibility] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: ""
  });

  // ✅ Fetch board data if boardId exists
  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoards(boardId));
    }
  }, [dispatch, boardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      workspaceName: selectedWorkspace || "",
      visibility: selectedVisibility || ""
    });
  };

  useEffect(() => {
    if (workspaces?.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0].name);
    }
  }, [workspaces, selectedWorkspace]);

  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchBoards(workspaceId));
    }
  }, [dispatch, workspaceId]);

  // 🧠 Determine if button should be enabled
  const isFormValid = formData.title && selectedWorkspace && selectedVisibility;

  return (
    <FloatingContainer className="top-0 right-0 w-[320px] text-white bg-[#1D2125] p-4 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <ChevronLeft
          className="cursor-pointer hover:text-gray-400"
          onClick={(e) => {
            e.stopPropagation();
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
        onSubmit={handleSubmit}
        className="w-full space-y-5"
        // onClick={(e) => e.stopPropagation()}
      >
        {/* Board Name */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">
            Board title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="My Awesome Board"
            className="w-full bg-[#2C2F33] border border-[#3A3F44] rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Workspace */}
        <div className="relative">
          <label className="block mb-1 text-sm text-gray-300">Workspace</label>
          <div
            className="flex items-center bg-[#2C2F33] border border-[#3A3F44] rounded-md px-3 py-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowWorkspaceDropdown((prev) => !prev);
            }}
          >
            <span className="flex-1 text-sm text-gray-200">
              {selectedWorkspace
                ? selectedWorkspace
                : workspaces?.length > 0
                ? workspaces[0].name
                : "No workspace found"}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>

          {showWorkspaceDropdown && (
            <div
              className="absolute top-full left-0 mt-1 w-full bg-[#2C2F33] border border-[#3A3F44] rounded-md shadow-md z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {workspaces.map((workspace) => {
                const isSelected = selectedWorkspace === workspace.name;
                return (
                  <div
                    key={workspace._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorkspace(workspace.name);
                      setShowWorkspaceDropdown(false);
                    }}
                    className={`px-3 py-2 text-sm text-gray-200 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white" // Highlight selected workspace
                        : "hover:bg-[#34363a]"
                    }`}
                  >
                    {workspace.name}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="relative">
          <label className="block mb-1 text-sm text-gray-300">Visibility</label>
          <div
            className="flex items-center bg-[#2C2F33] border border-[#3A3F44] rounded-md px-3 py-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowVisibilityDropdown((prev) => !prev);
            }}
          >
            <span className="flex-1 text-sm text-gray-200">
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

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 text-sm font-medium text-white rounded-md transition-colors ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? "Creating board..." : "Create board"}
        </button>
      </form>
    </FloatingContainer>
  );
}
