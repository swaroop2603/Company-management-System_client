import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chat.css"; 
import Message  from "../messages/messages";
async function fetchmessages(chat_id){
    console.log(chat_id)
    try{
       const response=await axios.get(`http://localhost:5000/CMS/message?chat_id=${chat_id}`) 
console.log(response)
       return response.data
    }catch(error){
        console.error("Error fetching messages:", error);
        return [];
    }
}
async function fetchUserName(user_id){
    try{
        const response=await axios.get(`http://localhost:5000/CMS/employees?user_id=${user_id}`)
        
        return response.data.username; 
    }catch(error){
        console.log(error)
    }
}
function Chat({user}) {
  const [userData, setUserData] = useState(null);
  const [chatwindow,setchatwindow]=useState(false)
  const [UserName,seruserName]=useState([])
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages,setmessages]=useState([])
  console.log("messages_chat",messages)
  useEffect(() => {
    // console.log("useEffect is running"); // Add this line
    const fetchData = async () => {
      try {
        console.log(user.user_id)
        const response = await axios.get(`http://localhost:5000/CMS/chat?user_id=${user.user_id}`);
        console.log(response.data); // Assuming the data is in the 'data' property of the response
        const userDatawithname=await Promise.all(response.data.map(async (item)=>{

          if(user.user_id==item.user_id1){
            const userName=await fetchUserName(item.user_id2)
            return {...item,userName}
          }
          else{
            const userName=await fetchUserName(item.user_id1)
            return {...item,userName}

          }

            
            
        }));
        setUserData(userDatawithname)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once
  const handleButtonClick = async(userId,chat_id) => {
    console.log(chat_id)
    setSelectedUserId((prevUserId) => (prevUserId === userId ? null : userId));
    const messages=await fetchmessages(chat_id)
    setmessages(messages)
  };
  return (
    <div className="chat_window">
    <div className="chat_container">
      <div className="chat_box">
        <div className="chats_chat">
          {userData && (
            <div className="chats_message_div">
              {userData.map((item, index) => (
                <button
                className='chats_message_button '
                onClick={() => handleButtonClick(item.user_id2,item.chat_id)}
                key={index}
              >
                {item.userName}
              </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedUserId && (
          <div className="chat_Messages">
            <Message messages={messages} setMessages={setmessages} userdata={user} userName={userData.find(item => item.user_id2 === selectedUserId)?.userName} ChatId={userData.find(item => item.user_id2 === selectedUserId)?.chat_id}/>
          </div>
        )}
    </div>
    </div>
  );
}

export default Chat;
