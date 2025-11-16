import { useModal } from "../../context/ModalContext";
import { createWorkspace } from "../../store/slices/workspaceSlice";
import { createBoard } from "../../store/slices/boardSlice";
import { CreateWorkspaceModal } from "../Workspace/CreateWorkspaceModal";
import { CreateBoardModal } from "../Board/CreateBoardModal";
import { useAppDispatch } from "../../store/hooks";

export const GlobalModals = () => {
  const dispatch = useAppDispatch();
  const { modalType, modalData, closeModal } = useModal();

  const handleCreateWorkspace = async (data: {
    name: string;
    description?: string;
  }) => {
    await dispatch(createWorkspace(data));
    closeModal();
  };

  const handleCreateBoard = async (data: {
    title: string;
    description?: string;
    color?: string;
  }) => {
    if (!modalData?.workspaceId) {
      console.warn("No workspaceId provided for board creation");
      return;
    }
    await dispatch(
      createBoard({ ...data, workspaceId: modalData.workspaceId })
    );
    closeModal();
  };

  return (
    <>
      {modalType === "workspace" && (
        <CreateWorkspaceModal
          onClose={closeModal}
          onCreate={handleCreateWorkspace}
        />
      )}
      {modalType === "board" && (
        <CreateBoardModal onClose={closeModal} onCreate={handleCreateBoard} />
      )}
    </>
  );
};
