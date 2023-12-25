import React from "react";
import Header from "../headers/header";
import Chat from "../chat/chat"
import { useLocation } from 'react-router-dom';
function Homepage(){
    const location = useLocation();
    const userData = location.state?.user;
    // console.log("home++",userData)

    return(
<div>
    <Header/>
    <Chat  user={userData}/>
   </div>
    )
}
export default Homepage