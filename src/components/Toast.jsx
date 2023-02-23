import React, { useCallback, useEffect, useState } from 'react';

export const Toast = ({ toast, isShow }) => {
    const [isActive, setActive] = useState(true);

    useEffect(() => {
        setActive(isShow);
        const interval = setInterval(() => {
            setActive(false);
        }, 3000);
        return () => {
            clearInterval(interval);
        }
    }, [toast, isShow]);

    const dismiss = () => {
        setActive(false)
    }

    return (
        isActive &&
        <div className={`toast ${(isActive) ? "show" : "hide"}`}>
            <div className="toast-header">
                <h4>{toast.title}</h4>
                <small>1 min ago</small>
                <button onClick={dismiss}>&times;</button>
            </div>
            <div className="toast-body">
                <p>{toast.body}</p>
            </div>
        </div>
    )
}

export const ToastList = ({ toastList, position, setList}) => { 

    const deleteToast = useCallback(id  => {
        const toastListItem = toastList.filter(e  => e.id !== id);
        setList(toastListItem);
    }, [toastList, setList]);

    useEffect(() => {
        const interval = setInterval(() => {
            if(toastList.length > 0){
                deleteToast(toastList[0].id);
            }
        }, 3000);
        return () => {
            clearInterval(interval);
        }
    }, [toastList, deleteToast]);

    return (
        <div className='toasts-wrapper'>
            {
                toastList.map((toast, i ) => {
                    return (
                    <div key={i} className="toast-success">
                        <div className="container-1">
                            
                        </div>
                        <div className="container-2">
                            <p className="title">{toast.title}</p>
                            <p className="body">{toast.body}</p>
                        </div>
                        <button onClick={()  => deleteToast(toast.id)}>&times;</button>
                    </div>
                    )
                })
            }
        </div>
    )
}
