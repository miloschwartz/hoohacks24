import React, { useEffect } from "react";

interface ToastProps {
  close: () => void;
  type: string;
  text: string;
  children: React.ReactNode;
}

export const Toast = ({ close, text, type }: ToastProps) => {
  useEffect(() => {
    setTimeout(() => {
      close();
    }, 5000);
  }, []);

  const getToastType = (type: string) => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "warning":
        return "alert-warning";
      default:
        return "alert-info";
    }
  };

  return (
    <>
      <div className={`alert ${getToastType(type)}`}>
        <span>{text}</span>
      </div>
    </>
  );
};
