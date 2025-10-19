import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchWorkspaces, createWorkspace, setCurrentWorkspace } from '../../store/slices/workspaceSlice';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';

interface WorkspaceListProps {
  onSelectWorkspace: (workspaceId: string) => void;
}

export const WorkspaceList = ({ onSelectWorkspace }: WorkspaceListProps) => {
  const dispatch = useAppDispatch();
  const { workspaces, loading } = useAppSelector((state) => state.workspaces);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleCreateWorkspace = async (data: { name: string; description?: string }) => {
    await dispatch(createWorkspace(data));
    setShowCreateModal(false);
  };

  const handleSelectWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w._id === workspaceId);
    if (workspace) {
      dispatch(setCurrentWorkspace(workspace));
      onSelectWorkspace(workspaceId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Workspaces</h1>
            <p className="text-gray-600">Select a workspace to start collaborating</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            New Workspace
          </motion.button>
        </div>

        {workspaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No workspaces yet</h3>
            <p className="text-gray-500 mb-6">Create your first workspace to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Workspace
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace, index) => (
              <motion.div
                key={workspace._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleSelectWorkspace(workspace._id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition cursor-pointer p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{workspace.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {workspace.description || 'No description'}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{workspace.members.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWorkspace}
        />
      )}
    </div>
  );
};
