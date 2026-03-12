"use client";

import { useStore } from "@nanostores/react";
import { $alertModal, closeAlert } from "@/store/modalStore";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Modal = () => {
  // Sincronización con la Neurona Global (Nano Store)
  const { isOpen, title, content, preventClose } = useStore($alertModal);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-body"
        onClose={() => {
          if (!preventClose) closeAlert();
        }}
      >
        {/* Overlay: Usamos blur para jerarquía visual Stark */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className="
                  relative w-full max-w-2xl transform overflow-hidden 
                  rounded-2xl border border-[var(--border-dim-one)] 
                  bg-[var(--card-background)] p-8 shadow-[var(--shadow-soft)] 
                  transition-all
                "
              >
                {/* Header del Modal */}
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title 
                    as="h3" 
                    className="text-2xl font-display font-bold tracking-tight text-[var(--foreground-color)]"
                  >
                    {title}
                  </Dialog.Title>

                  {!preventClose && (
                    <button
                      type="button"
                      className="text-[var(--foreground-muted)] hover:text-[var(--highlight-one)] transition-colors p-2"
                      onClick={closeAlert}
                      aria-label="Cerrar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Contenido Inyectado */}
                <div className="text-[var(--foreground-muted)] leading-relaxed">
                  {content}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;