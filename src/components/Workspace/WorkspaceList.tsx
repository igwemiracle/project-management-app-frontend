import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  User,
  Settings,
  LayoutDashboard,
  Rocket
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchWorkspaces } from "../../store/slices/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import CreateBoardForm from "../Navbar/CreateBoardForm";
import { createBoard } from "../../store/slices/boardSlice";
import WorkspaceSkeleton from "../SkeletonLoader/WorkspaceSkeleton";

export const WorkspaceList = () => {
  const dispatch = useAppDispatch();
  const { workspaces, loading } = useAppSelector((state) => state.workspaces);
  const navigate = useNavigate();
  const { openModal } = useModal();

  // Track which workspace has its form open
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleSelectWorkspace = (workspaceId: string) => {
    navigate(`/workspaces/${workspaceId}/boards`);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Boards" },
    { icon: User, label: "Members" },
    { icon: Settings, label: "Settings" },
    { icon: Rocket, label: "Upgrade" }
  ];

  return (
    <div className="min-h-screen py-4 xs:py-6 sm:py-6 md:py-8 bg-gradient-to-br from-[hsl(var(--workspace-gradient-from))] to-[hsl(var(--workspace-gradient-to))]">
      {/* Header */}
      <div className="w-full">
        <div className="flex flex-col gap-3 mb-4 xs:gap-4 xs:mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
          <div className="min-w-0">
            <h1 className="mb-1 text-lg font-bold leading-tight text-gray-800 xl:text-xl text-foreground sm:mb-2">
              Your Workspaces
            </h1>
            <p className="text-sm text-muted-foreground">
              Select a workspace to start collaborating
            </p>
          </div>
        </div>

        {/* Empty State */}
        {loading ? (
          // 🌀 Show skeleton while loading
          <WorkspaceSkeleton />
        ) : !workspaces || workspaces.length === 0 ? (
          // 📭 Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 text-center xs:py-12 sm:py-16"
          >
            <Briefcase className="w-40 h-12 mx-auto mb-3 xs:w-14 xs:h-14 sm:w-16 sm:h-16 sm:mb-4 text-muted-foreground/60" />
            <h3 className="mb-2 text-lg font-semibold xs:text-xl text-foreground">
              No workspaces yet
            </h3>
            <p className="mb-4 text-sm xs:text-base xs:mb-6 text-muted-foreground">
              Create your first workspace to get started
            </p>
          </motion.div>
        ) : (
          // ✅ Actual Workspaces Grid
          <div className="grid grid-cols-1 xs:gap-y-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {workspaces.map((workspace, index) => {
              const isFormOpen = selectedWorkspaceId === workspace._id;

              return (
                <div key={workspace._id} className="relative">
                  {/* Workspace Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-base font-bold">{workspace.name}</h1>
                  </div>

                  {/* Quick Menu */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {menuItems.map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        onClick={() =>
                          label === "Boards" &&
                          handleSelectWorkspace(workspace._id)
                        }
                        className="flex items-center gap-2 p-1 transition bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                      >
                        <Icon size={16} />
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* "Create new board" Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedWorkspaceId(workspace._id)}
                    className="relative flex items-center justify-center h-40 p-4 text-gray-600 transition-all bg-gray-100 border rounded-lg shadow-sm cursor-pointer bg-card border-border xs:p-5 sm:p-6 xs:rounded-xl hover:shadow-lg hover:border-primary/20"
                  >
                    Create new board
                  </motion.div>

                  {/* Form Overlay */}
                  <AnimatePresence>
                    {isFormOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="absolute inset-0 z-20 flex items-center justify-center rounded-lg shadow-xl bg-white/100 h-96 backdrop-blur-sm"
                      >
                        <CreateBoardForm
                          className="w-full h-full max-w-md p-4"
                          onClose={() => setSelectedWorkspaceId(null)}
                          onCreate={async (data) => {
                            try {
                              const resultAction = await dispatch(
                                createBoard({
                                  title: data.title,
                                  workspaceId: workspace._id,
                                  description: data.description,
                                  color: data.color
                                })
                              );

                              const createdBoard = resultAction.payload;
                              if (createdBoard?._id) {
                                navigate(`/boards/${createdBoard._id}`);
                              }
                            } catch (error) {
                              console.error("Failed to create board:", error);
                            } finally {
                              setSelectedWorkspaceId(null);
                            }
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
