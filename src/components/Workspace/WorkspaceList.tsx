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
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Your Workspaces
            </h1>
            <p className="text-gray-600">
              Select a workspace to start collaborating
            </p>
          </div>
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal("workspace")}
            className="flex items-center gap-2 px-6 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            New Workspace
          </motion.button> */}
        </div>

        {!workspaces || workspaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 text-center"
          >
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              No workspaces yet
            </h3>
            <p className="mb-6 text-gray-500">
              Create your first workspace to get started
            </p>
            <button
              // onClick={() => setShowCreateModal(true)}
              onClick={() => openModal("workspace")}
              className="px-6 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create Workspace
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace, index) => (
              <motion.div
                key={workspace._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleSelectWorkspace(workspace._id)}
                className="p-6 transition bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {workspace.name}
                </h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {workspace.description || "No description"}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{workspace.members.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(workspace.createdAt).toLocaleDateString()}
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
