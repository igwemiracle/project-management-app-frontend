import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "workspace" | "board" | null;

interface ModalData {
  workspaceId?: string;
}

interface ModalContextType {
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  modalType: ModalType;
  modalData: ModalData | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = (type: ModalType, data?: ModalData) => {
    setModalType(type);
    setModalData(data || null);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider
      value={{ modalType, openModal, closeModal, modalData }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
