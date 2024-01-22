import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chat.css"; 
import Message  from "../messages/messages";
import Message_company from "../messages company/messages_company";
import BASE_URL from "../../config";
import channel_icon from "../assests/channel.png"
import user_icon from "../assests/user.png"
async function fetchmessages(chat_id){
    // console.log(chat_id)
    try{
       const response=await axios.get(`${BASE_URL}/CMS/message?chat_id=${chat_id}`) 
// console.log(response)
       return response.data
    }catch(error){
        console.error("Error fetching messages:", error);
        return [];
    }
}
async function fetchchannelmessages(channel_id){
  // console.log("channel_id",channel_id)
    try{
       const response=await axios.get(`${BASE_URL}/CMS/channel/chat?channel_id=${channel_id}`) 
// console.log(response)
       return response.data
    }catch(error){
        console.error("Error fetching messages:", error);
        return [];
    }
}
async function fetchUserName(user_id){
    try{
        const response=await axios.get(`${BASE_URL}/CMS/employees?user_id=${user_id}`)
        
        return response.data.username; 
    }catch(error){
        console.log(error)
    }
}
async function fetchchannelName(channel_id){
  try{
      const response=await axios.get(`${BASE_URL}/CMS/channelname?channel_id=${channel_id}`)
      // console.log("channel names",response)
      
      return response.data.channel_name; 
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
  const [ownerName,setOwnerName]=useState([])
  const [channelToggel,setchannelToggel]=useState(false)
  const [toggleButton, setToggleButton] = useState(false); 
  const [channeldata,setchanneldata]=useState(null)
  const [channelname,setchannelname]=useState([])
  const [selectedchannelId, setSelectedchannelId] = useState(null);
  const [messagewindow,setmessagewindow]=useState(false)
  const [channelMessageWindow, setChannelMessageWindow] = useState(false);
  const [userMessageWindow, setUserMessageWindow] = useState(false);

  // console.log("messages_chat",messages)
  useEffect(() => {
    // console.log("useEffect is running"); // Add this line
    const fetchData = async () => {
      try {
        // console.log(user.user_id)
        const response = await axios.get(`${BASE_URL}/CMS/company/employees?company_id=${user.company_id}`);
        // console.log(response.data); // Assuming the data is in the 'data' property of the response
        const userDatawithname=await Promise.all(response.data.map(async (item)=>{

          if(user.user_id==item.user_id){
            const userName=await fetchUserName(item.user_id)
            return {...item,userName}
          }
          else{
            const userName=await fetchUserName(item.user_id)
            return {...item,userName}

          }

            
            
        }));
        // console.log("owner",user)
        // const username=fetchUserName(user)
        // setOwnerName(username)
        
        setUserData(userDatawithname)
        // console.log("userdata",userData)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    const fetchChanneldata = async () => {
      try {
        // console.log(user.user_id)
        const response = await axios.get(`${BASE_URL}/CMS/channel?user_id=${user.user_id}`);
        // console.log(response)
        // console.log(response.data);
        const channeldataname=await Promise.all(response.data.map(async (item)=>{
          // console.log("channel items",item)
          
            const channelName=await fetchchannelName(item.channel_id)
            return {...item,channelName}
          
          

            
            
        }));
        
        setchanneldata(channeldataname)
        // console.log("channel names",channeldataname)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
    fetchChanneldata()
    // console.log("channels",channeldata)
  }, []); // Empty dependency array to run the effect only once
  const handleButtonClick = async(userId,chat_id) => {
    setSelectedchannelId(null);
    // console.log(chat_id)
    setSelectedUserId((prevUserId) => (prevUserId === userId ? null : userId));
    setUserMessageWindow(!userMessageWindow);
    setChannelMessageWindow(false);
    const messages=await fetchmessages(chat_id)
    setmessages(messages)
  };
  const handleButton_channelClick= async(channel_id) => {
    setSelectedUserId(null);
    // console.log(channel_id)
    
    setSelectedchannelId((prevchannelid) => (prevchannelid === channel_id ? null : channel_id));
    setChannelMessageWindow(!channelMessageWindow);
    setUserMessageWindow(false);
    const messages=await fetchchannelmessages(channel_id)
    setmessages(messages)
  };
  const handleToggle=()=>{
    setchannelToggel((prev)=>!prev)
    setToggleButton((prev)=>!prev)
    setUserMessageWindow(false); // Close user message window when toggling channels
    setChannelMessageWindow(false); 
  }
  const channelMessageWindowContent = (selectedchannelId || channelMessageWindow) && (
    <div className="chat_Messages">
      <Message_company
        messages={messages}
        setMessages={setmessages}
        userdata={user}
        channelName={
          channeldata.find((item) => item.channel_id === selectedchannelId)
            ?.channelName
        }
        Channel_Id={channeldata.find((item) => item.channel_id === selectedchannelId)
          ?.channel_id}
      />
    </div>
  );
  // console.log("user in channels  ",user)

  const userMessageWindowContent = (selectedUserId || userMessageWindow) && (
    <div className="chat_Messages">
      <Message
        messages={messages}
        setMessages={setmessages}
        userdata={user}
        userName={
          userData.find((item) => item.user_id2 === selectedUserId)
            ?.userName
        }
        ChatId={
          userData.find((item) => item.user_id2 === selectedUserId)
            ?.chat_id
        }
      />
    </div>
  );
  return (
    <div className="chat_window">
    <div className="chat_container">
      <div className="chat_box">
        <div className="chats_chat">
        <button className={`channel_toggle_button ${toggleButton ? "up" : "down"}`} onClick={handleToggle}>
              {toggleButton ? "v" : ">"}Channels
            </button>
            {channelToggel && (
              <div className="chats_message_div">
                {channeldata && channeldata.length > 0 ? (
                  channeldata.map((item, index) => (
                    <button
                      className="chats_message_button"
                      onClick={() => handleButton_channelClick(item.channel_id)}
                      key={index}
                    >
                       <img src={channel_icon} alt="Channel Logo" className="channel-logo" />
                      {item.channelName}
                    </button>
                  ))
                ) : (
                  <div>No channels present</div>
                )}
              </div>
            )}
        
          {userData && (
            <div className="chats_message_div">
              {userData.map((item, index) => (
                
                <button
                className='chats_message_button '
                onClick={() => handleButtonClick(item.user_id2,item.chat_id)}
                key={index}
              >
                <img src={user_icon} alt="user Logo" className="user-logo" />
                {item.userName}
                {console.log("userdaa",userData,"userid 2",item.user_id2,item.chat_id)} {/* Insert console.log here */}
              </button>
              ))}
               
            </div>
          )}
        </div>
        
      </div>
      {channelMessageWindowContent}
        {userMessageWindowContent}
    </div>
    </div>
  );
}

export default Chat;
