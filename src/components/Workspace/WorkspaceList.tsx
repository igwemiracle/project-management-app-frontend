import { useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Calendar } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchWorkspaces } from "../../store/slices/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";

export const WorkspaceList = () => {
  const dispatch = useAppDispatch();
  const { workspaces, loading } = useAppSelector((state) => state.workspaces);
  const navigate = useNavigate();
  const { openModal } = useModal();

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleSelectWorkspace = (workspaceId: string) => {
    navigate(`/workspaces/${workspaceId}/boards`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-4 xs:px-4 xs:py-6 sm:p-6 md:p-8 bg-gradient-to-br from-[hsl(var(--workspace-gradient-from))] to-[hsl(var(--workspace-gradient-to))]">
      <div className="w-full mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 mb-4 xs:gap-4 xs:mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
          <div className="min-w-0">
            <h1 className="mb-1 text-2xl font-bold leading-tight text-foreground xs:text-3xl sm:text-4xl sm:mb-2">
              Your Workspaces
            </h1>
            <p className="text-sm text-muted-foreground xs:text-base">
              Select a workspace to start collaborating
            </p>
          </div>
        </div>

        {!workspaces || workspaces.length === 0 ? (
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
            <button
              onClick={() => openModal("workspace")}
              className="w-full px-6 py-3 text-sm xs:w-auto xs:text-base"
            >
              Create Workspace
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {workspaces.map((workspace, index) => (
              <motion.div
                key={workspace._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleSelectWorkspace(workspace._id)}
                className="p-4 transition-all border rounded-lg shadow-sm cursor-pointer bg-card border-border xs:p-5 sm:p-6 xs:rounded-xl hover:shadow-lg hover:border-primary/20"
              >
                <div className="flex items-start justify-between mb-3 xs:mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg xs:w-12 xs:h-12 bg-gradient-to-br from-[hsl(var(--workspace-icon-bg-from))] to-[hsl(var(--workspace-icon-bg-to))]">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="mb-1 text-base font-semibold leading-tight xs:text-lg xs:mb-2 text-card-foreground line-clamp-1">
                  {workspace.name}
                </h3>
                <p className="mb-3 text-xs xs:text-sm xs:mb-4 text-muted-foreground line-clamp-2">
                  {workspace.description || "No description"}
                </p>
                <div className="flex items-center gap-3 text-xs xs:gap-4 xs:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 xs:w-4 xs:h-4" />
                    <span>{workspace.members.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 xs:w-4 xs:h-4" />
                    <span className="truncate">
                      {new Date(workspace.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric"
                        }
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
