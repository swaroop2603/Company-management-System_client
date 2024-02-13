
import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import "./header.css";
import Task from "../Tasks/task";
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
function Header({ user,CEO }) {
  const [companyname, setCompanyname] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownlist, setDropdownlist] = useState([]);
  const [selectedid,setselectedid]=useState("")
 const navigate=useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/CMS/company?company_id=${user.company_id}`);
        setCompanyname(response.data.company_name);
      } catch (error) {
        console.error("Error fetching company name:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/CMS/project?company_id=${user.company_id}&user_id=${user.user_id}`);
        setDropdownlist(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
    fetchProjects();
  }, [user.company_id, user.user_id]);
 const handleTasks=()=>{
  console.log(CEO,user)

  navigate('/tasks', { state: { project:selectedid ,company:user.company_id,ceo:CEO,user:user} })
 }
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem.Project_name);
    setselectedid(menuItem)
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header_header">
      <div className="search_header">
        <div className="search_bar_header">
          <span className="company-name">{companyname}</span>
          <span className="username">{user.username}</span>
        </div>
      </div>
      <div className="dropdown-label">Projects:</div>
      <div className="tasks_header">
      
        <div className="dropdown-container">
          
          <button
            className={`button_header dropdown-button ${isDropdownOpen ? "active" : ""}`}
            onClick={toggleDropdown}
          >
            {selectedMenuItem.length > 20 ? `${selectedMenuItem.slice(0, 14)}...` : selectedMenuItem}
            <span className="arrow-icon">{isDropdownOpen ? "▲" : "▼"}</span>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              {dropdownlist.length > 1 && (
                <button
                  className="dropdown-item"
                  onClick={() => handleMenuItemClick("All")}
                >
                  All
                </button>
              )}
              {dropdownlist.map((menuItem, index) => (
                <button
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleMenuItemClick(menuItem)}
                >
                  {menuItem.Project_name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="button_header" onClick={handleTasks}>
          Tasks
        </button>
      </div>
      <div className="profile_header">
        <button className="profile"><FaUser /></button>
      </div>
    </div>
  );
}

export default Header;