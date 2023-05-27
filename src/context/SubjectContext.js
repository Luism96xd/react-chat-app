import { useReducer, createContext } from "react";

export const SubjectContext = createContext();

export const SubjectContextProvider = ({ children }) => {

    const INITIAL_STATE = {
        subject: {
            subject_id: 1,
            name: ""
        }
    }

    const subjectReducer = (state, action)  => {
        switch (action.type) {
            case "CHANGE_SUBJECT":
                console.log(action.payload)
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