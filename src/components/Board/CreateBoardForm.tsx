import { ChevronLeft, X, ChevronDown } from "lucide-react";
import FloatingContainer from "../FloatingContainer";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { fetchBoards } from "../../store/slices/boardSlice";
import { IconButton } from "../UI/IconButton";
import VisibilityDropdown from "./VisibilityDropdown";

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
  className?: string;
}

export default function CreateBoardForm({
  onBack = () => {},
  onClose = () => {},
  onCreate,
  className
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
  const [selectedVisibility, setSelectedVisibility] = useState<string>("");

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
    <FloatingContainer className={`text-white w-72  ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4 text-gray-700">
        <IconButton className="hover:bg-gray-200">
          <ChevronLeft
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
          />
        </IconButton>
        <div></div>
        <h4 className="text-[15px] text-gray-700 font-semibold">
          Create board
        </h4>
        <IconButton className="hover:bg-gray-200">
          <X
            className="text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
        </IconButton>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5"
        // onClick={(e) => e.stopPropagation()}
      >
        {/* Board Name */}
        <div>
          <label className="block mb-1 text-sm text-gray-800">
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
            className="w-full px-3 py-2 text-sm text-gray-800 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Workspace */}
        <div className="relative">
          <label className="block mb-1 text-sm text-gray-800">Workspace</label>
          <div
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowWorkspaceDropdown((prev) => !prev);
            }}
          >
            <span className="flex-1 text-sm text-gray-800">
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
              className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-up-down z-50 py-2"
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
                    className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-200 hover:bg-blue-200 border-2 border-r-0 border-y-0 border-l-blue-600 text-blue-600 outline-none"
                        : "hover:bg-gray-100 text-gray-600"
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
        <div className="relative ">
          <label className="block mb-1 text-sm text-gray-800">Visibility</label>
          <div
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowVisibilityDropdown((prev) => !prev);
            }}
          >
            <span className="flex-1 text-sm text-gray-800">
              {selectedVisibility || "Select visibility"}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>

          {showVisibilityDropdown && (
            <VisibilityDropdown
              selectedVisibility={selectedVisibility}
              setSelectedVisibility={setSelectedVisibility}
              setShowVisibilityDropdown={setShowVisibilityDropdown}
            />
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Creating board..." : "Create board"}
        </button>
      </form>
    </FloatingContainer>
  );
}
