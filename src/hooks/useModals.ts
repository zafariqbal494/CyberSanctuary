import { useState } from 'react';

export interface ModalsState {
  payment: boolean;
  enrollment: boolean;
}

export interface UseModalsReturn {
  modals: ModalsState;
  openModal: (modal: keyof ModalsState) => void;
  closeModal: (modal: keyof ModalsState) => void;
  toggleModal: (modal: keyof ModalsState) => void;
}

/**
 * Custom hook for managing multiple modal states
 */
export function useModals(initialState: Partial<ModalsState> = {}): UseModalsReturn {
  const [modals, setModals] = useState<ModalsState>({
    payment: false,
    enrollment: false,
    ...initialState,
  });

  const openModal = (modal: keyof ModalsState) => {
    setModals(prevState => ({
      ...prevState,
      [modal]: true,
    }));
  };

  const closeModal = (modal: keyof ModalsState) => {
    setModals(prevState => ({
      ...prevState,
      [modal]: false,
    }));
  };

  const toggleModal = (modal: keyof ModalsState) => {
    setModals(prevState => ({
      ...prevState,
      [modal]: !prevState[modal],
    }));
  };

  return {
    modals,
    openModal,
    closeModal,
    toggleModal,
  };
} 