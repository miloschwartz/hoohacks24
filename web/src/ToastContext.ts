import React from 'react';
import * as model from '../../model';

interface ToastContextProps {
    open: (content: model.Toast) => void;
}

const defaultToastContextValue: ToastContextProps = {
    open: (content: model.Toast) => {
        console.warn("ToastContext: open method was called without a provider.");
        const placeholder = content;
    }
};

export const ToastContext = React.createContext<ToastContextProps>(defaultToastContextValue);
