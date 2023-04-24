import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { onMessageListener } from '../firebase';
import {ToastList} from '../components/Toast';
import AddAnnouncement from '../components/AddAnnouncement';

const NewsPanel = () => {
    const [list, setList] = useState([]);
  
    const showToast = () => {
        const toastProperties = {
            id: 0,
            title: "Toast 1",
            body: "Hola mundo 1"
        };
        setList([toastProperties]);
    }

    onMessageListener().then(payload => {
        setList([...list, {
          id: list.length + 1,
          title: payload.notification.title, 
          body: payload.notification.body
        }])
        console.log(payload);
    }).catch(error => console.log('failed: ', error));

    return (
        <div>
            <Navbar/>
            <div className="container grid">
                <aside>

                </aside>
                <div className='card center'>
                   <AddAnnouncement/>
                </div>
            </div>
            <button style={{display: "none"}} onClick={() => showToast()}>Show Notification</button>
            {list && <ToastList toastList={list} setList={setList}/>}
        </div>
    )
}

export default NewsPanel