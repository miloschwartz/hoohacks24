import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { ToastContext } from "./ToastContext";
import * as uuid from "uuid";
import * as model from "../../model";
import { Toast } from "./components/Toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<model.Toast[]>([]);

  const open = (content: model.Toast) =>
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: uuid.v4(), ...content },
    ]);

  const close = (id: string) =>
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );

  const contextValue = useMemo(() => ({ open }), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {createPortal(
        <div className="toast">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              close={() => close(toast.id!)}
              type={toast.type}
              text={toast.text}
            >
              {toast.text}
            </Toast>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
