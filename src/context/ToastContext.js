import { createContext, useReducer, useState } from 'react';
export const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const add = (newToast) => {
        setToasts([...toasts, newToast]);
    }
    const remove = (id) => {
        setToasts(toasts.filter((toast) => toast.messageId !== id));
    }

    const toastReducer = (state, action) => {
        switch (action.type) {
            case "ADD_TOAST":
                console.log("action_payload", action.payload)
                setToasts([...toasts, action.payload]);
                console.log(toasts);
                return {
                    toasts: toasts,
                }
            case "REMOVE_TOAST":
                console.log(action.payload)
                setToasts(toasts.filter((toast) => toast.messageId !== action.payload.messageId));
                console.log(toasts)
                return {
                    toasts: toasts,
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(toastReducer, toasts);

    return (
        <ToastContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ToastContext.Provider>
    )
}