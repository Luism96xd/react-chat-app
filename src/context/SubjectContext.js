import { useReducer, createContext } from "react";

export const SubjectContext = createContext();

export const SubjectContextProvider = ({ children }) => {

    const INITIAL_STATE = {
        subject: {
            id: null,
            name: ""
        }
    }

    const subjectReducer = (state, action)  => {
        switch (action.type) {
            case "CHANGE_SUBJECT":
                return {
                    subject: action.payload,
                }     
            default:
                return state;
        }
    }
    
    const [state, dispatch] = useReducer(subjectReducer, INITIAL_STATE);

    return (
        <SubjectContext.Provider value={{data: state, dispatch }}>
            {children}
        </SubjectContext.Provider>
    );
};