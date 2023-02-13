import { useReducer, createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {

    const {currentUser} = useContext(AuthContext);

    const INITIAL_STATE = {
        chatId: "",
        user: {}
    }

    const chatReducer = (state, action)  => {
        const id = (currentUser.uid > action.payload.uid) 
                    ? currentUser.uid + action.payload.uid 
                    : action.payload.uid + currentUser.uid;

        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: id,
                }     
            default:
                return state;
        }
    }
    
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};