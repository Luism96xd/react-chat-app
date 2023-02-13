import React, { useContext, useState } from "react";
import { collection, query, where, doc, getDocs, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db } from '../firebase';
import { ChatContext } from "../context/ChatContext";

const Search = () => {

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);

    const handleSearch = async () => {
        const usersRef = collection(db, "users");

        const q = query(usersRef, where("displayName", "==", username));

        try {
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                setUser(doc.data())
                console.log(doc.id, " => ", doc.data());
            });
        } catch (error) {
            setError(true);
            console.log(error);
        }

    }

    const handleKey = (e) => {
        if (e.code === "Enter"){
            handleSearch();
        };
    }

    const handleSelect = async (user) =>{

        dispatch({type: "CHANGE_USER", payload: user })

        //Check wheter the group (chats in firestore), if not, create
        const combinedID = (currentUser.uid > user.uid) 
            ? currentUser.uid + user.uid 
            : user.uid + currentUser.uid;

        try {
            const res = await getDoc(doc(db, "chats", combinedID));
            if (!res.exists()){
                //Create a chat in chats collection
                await setDoc(doc(db, "chats", combinedID), {messages: []})

                //Create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedID+".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedID+".date"]: serverTimestamp(),
                    [combinedID+".lastMessage"] : ""
                });
                
                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedID+".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedID+".date"]: serverTimestamp(),
                    [combinedID+".lastMessage"] : ""
                })
                console.log("clicked")
            }  
        } catch (error) {
          console.log(error)  
        }

        setUser(null);
        setUsername("");
    }

    return (
        <div className="search">
            <div className="search-form">
                <input 
                    type="text" 
                    placeholder="Find an user" 
                    onKeyDown={handleKey} 
                    onChange={ e => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {error && <span>Usuario no encontrado</span>}
            {user &&
                <div className="user-chat" onClick={() => handleSelect(user)}>
                    <img src={user.photoURL} alt={user.displayName + "profile image"} />
                    <div className="user-chat-info">
                        <span>{user.displayName}</span>
                    </div>
                </div>
            }
           
        </div>
    )
}

export default Search;