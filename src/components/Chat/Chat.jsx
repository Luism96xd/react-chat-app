import Camera from '../../img/cam.png';
import Add from '../../img/addUser.png';
import More from '../../img/more.png';
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from '../../context/ChatContext';
import { useContext } from 'react';

const Chat = () =>{
    const {data} = useContext(ChatContext);

    return (
        <div className="chat">
            <div className="chat-info">
                <span>{data.user?.displayName}</span>
                <div className="chat-icons">
                    <img src={Camera} alt="" />
                    <img src={Add} alt="" />
                    <img src={More} alt="" />
                </div>
            </div>
            <Messages/>
            <Input/>
        </div>
    )
}

export default Chat;