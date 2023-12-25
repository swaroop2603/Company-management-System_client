import React from "react";
import "./header.css";

function Header() {
  return (
    <div className="header_header">
      <div className="search_header">
        <div className="search_bar_header">
          <input className="input_header" type="text" placeholder="search" />
        </div>
      </div>
      <div className="tasks_header">
        <button className="button_header">Task assigned</button>
        <button className="button_header">Task pending</button>
        <button className="button_header">Task completed</button>
        <button className="button_header">Task missed</button>
      </div>
    </div>
  );
}

export default Header;