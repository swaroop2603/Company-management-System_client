import React, { useEffect, useState } from "react";
import './message.css'
import { RxPaperPlane } from "react-icons/rx";
import axios from "axios";

function Message({messages,setMessages,userdata, userName, ChatId}){
    const [messageText,setMessageTest]=useState("");
    const [username,setusername]=useState([])
   useEffect(()=>{
    const fetchusername=async()=>{
        try{
            //console.log(messages.user_id)
            const response=await axios.get(`http://localhost:5000/CMS/employees?user_id=${userdata.user_id}`)
            console.log("username",response)
            setusername(response.data.username)
        }
        catch(error){
            console.log(error)
        }
    }
    fetchusername()
   }, [userdata.user_id])
    const handlesend=async()=>{
    try{
        console.log("sending")
        console.log(userdata)
        console.log(messages)
        const data={
            user_id:userdata.user_id,
            message:messageText,
            chat_id: ChatId
        }
        console.log("data for sending",data)
        const response = await axios({
            method: 'post',
            url: "http://localhost:5000/CMS/message",
            data: data
        });
        console.log("after sended",response.data)
        setMessages(response.data)
        
        console.log("sended")
    }catch(error){
        console.log(error)
    }
    setMessageTest("");
   }
    console.log("messages",messages)
    return <div className="message_conatiner">
        <div className="message_header">
             { userName}
            </div>
            <div className="message_body">
                { messages.map((item,index)=>(
<div key={index}>{item.message}</div>
                ))
                }
                </div>
                <div className="message_input">
<textarea value={messageText} onChange={(e)=>{
    setMessageTest(e.target.value)
}} placeholder="type message here"></textarea>
<button onClick={handlesend}><RxPaperPlane /></button>
                </div>
 
    </div>
}
export default Message