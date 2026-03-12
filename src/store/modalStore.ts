import { atom } from "nanostores";

// 1. Definimos el Contrato de Estado (Resuelve Error 2339)
export interface ModalState {
  isOpen: boolean;
  title: string;
  content: string;
  preventClose?: boolean;
}

// 2. Inicializamos la Store con el tipo correcto
export const $alertModal = atom<ModalState>({
  isOpen: false,
  title: "",
  content: "",
  preventClose: false,
});

// 3. Helper para abrir el modal
export const showAlert = (title: string, content: string, preventClose = false) => {
  $alertModal.set({
    isOpen: true,
    title,
    content,
    preventClose,
  });
};

// 4. Helper para cerrar el modal (Resuelve Error 2305)
export const closeAlert = () => {
  const currentState = $alertModal.get();
  $alertModal.set({
    ...currentState,
    isOpen: false,
  });
};
