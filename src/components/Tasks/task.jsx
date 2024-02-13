import React, { useEffect, useState } from "react";
import "./task.css";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import BASE_URL from "../../config";
import { FaUser } from "react-icons/fa";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "react-modal";
import { FiEdit2 } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";

import { RiDeleteBin5Line } from "react-icons/ri";
import Add_taaskmodal from "./add_taskmodal";
import EnhancedButton from "../enhancedstyle";
function Task() {
    const [tasks,settasks]=useState([])
    const [doingToggle, setDoingToggle] = useState(false);
    const [progressToggle, setProgressToggle] = useState(true);
    const [completedToggle, setCompletedToggle] = useState(false);
    const [isstatuschanged,setisstatuschanged]=useState(false)
    const [isuserchanged,setisuserchanged]=useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editTitle, setEditTitle] = useState(false);
    const [editBody, setEditBody] = useState(false);
    const [editDeadline, setEditDeadline] = useState(false);
    const [editUser,setedituser]=useState(true)
    const [projectmembers,setprojectmembers]=useState('')
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [editedDeadline, setEditedDeadline] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [openmodalcreatetask,setopenmodalcreatetask]=useState(false)
  const location = useLocation();
   
  const projectData = location.state?.project;
  const company_id= location.state?.company;
  const user=location.state?.user;
  const CEO=location.state?.ceo
  const handlecreatetask=()=>{
    setEditedBody(null)
    setEditedTitle(null)
    setEditedDeadline(null)
    setopenmodalcreatetask(true)

  }
  const handlemodalcreate=async()=>{
    const data={
      title:editedTitle,
      body:editedBody,
      status:"pending",
      deadline:editedDeadline,
      project_id:projectData.project_id,
      company_id:company_id

    }
    await axios({
      method:'post',
      url:`${BASE_URL}/CMS/tasks`,
      data:data
    })
    closecreateModal()
    setisstatuschanged(!isstatuschanged)
    setDoingToggle(true)


  }
  const handledeadlinechange=(e,selectedtask)=>{
    setEditedDeadline(e.target.value);
    setSelectedTask((prevTask) => ({
      ...prevTask,
      deadline: e.target.value,
    }));

  }
    const handleAddMember = async(member,task) => {
       const data={
        "user_id":member.user_id,
        "task_id":task.task_id,
        "company_id":member.company_id,
        "project_id":task.project_id
       }

        await axios({
            method:'post',
            url:`${BASE_URL}/CMS/tasks_users`,
            data:data
        })
        setisstatuschanged(!isstatuschanged)
      // setIsDropdownOpen(false); 
      const updatedUsers = [...selectedTask.users, { "user_id": member.user_id, "name": member.username }];

      
      setSelectedTask(prevTask => ({
        ...prevTask,
        users: updatedUsers
      }));
      // setIsModalOpen(false);
      console.log(selectedTask)
    };
    const handleRemoveMember = async(member) => {
        console.log(member.user_id)
      await axios.delete(`${BASE_URL}/CMS/tasks_users?user_id=${member.user_id}`)
      
      setisstatuschanged(!isstatuschanged)
      // setIsDropdownOpen(false); 
      const updatedUsers = selectedTask.users.filter(user => user.user_id !== member.user_id);

        setSelectedTask(prevTask => ({
          ...prevTask,
          users: updatedUsers
        }));

      // setIsModalOpen(false);
      console.log(selectedMembers)
      console.log(projectmembers)
    };

    const handleEditDeadline = () => {
      setEditDeadline(!editDeadline);
    };
  
    const handleEditUser = () => {
      
    };
    const handleEditTitle = () => {
      setEditTitle(!editTitle);
    };
  
    const handleEditBody = () => {
      setEditBody(!editBody);
    };
    const openModal = (task) => {
      setSelectedTask(task);
      setIsModalOpen(true);
      setIsDropdownOpen(false);
    };
  
    const closeModal = () => {
      setSelectedTask(null);
      setIsModalOpen(false);
      setIsDropdownOpen(false);
      setEditTitle(false)
      setEditBody(false)
      setEditDeadline(false)
    };
    const closecreateModal=()=>{
      setEditedBody(null)
    setEditedTitle(null)
    setEditedDeadline(null)
    setopenmodalcreatetask(false)
    }
    const handlemodalsave=async()=>{
      const data={
        task_id:selectedTask.task_id,
        status:selectedTask.status,
        body:selectedTask.body,
        title:selectedTask.title,
        deadline:selectedTask.deadline,
        project_id:projectData.project_id,
        company_id:projectData.company_id
    }
    

    console.log(data)
    await axios({
        url:`${BASE_URL}/CMS/tasks`,
        method:'put',
        
        data:data

    })
    if(selectedTask.status==='pending')
    setDoingToggle(true)
    if(selectedTask.status==='in-progress')
    setProgressToggle(true)
    if(selectedTask.status==='completed')
    setCompletedToggle(true);
    setisstatuschanged(!isstatuschanged)
    setSelectedTask(null);
          setIsModalOpen(false);
          setIsDropdownOpen(false);
          setEditTitle(false)
          setEditBody(false)
          setEditDeadline(false)

    console.log(selectedTask)
    }

    const handleDoing = () => {
        setDoingToggle(!doingToggle);
    }

    const handleProgress = () => {
        setProgressToggle(!progressToggle);
    }

    const handleCompleted = () => {
        setCompletedToggle(!completedToggle);
    }
    const handleCancelTitle = () => {
        setEditTitle(false);
      };
      
      const handleCancelBody = () => {
        setEditBody(false);
      };
      
      const handleCancelDeadline = () => {
        setEditDeadline(false);
      };
      const handleupdatestatus=async(task)=>{
        let data
        console.log(task)
        if(task.status==='pending'){
            
             data={
                task_id:task.task_id,
                status:'in-progress',
                project_id:projectData.project_id,
                company_id:projectData.company_id
            }
            setProgressToggle(true);
            
            
        }
        if(task.status==='in-progress'){
            data={
                task_id:task.task_id,
                status:'completed',
                project_id:projectData.project_id,
                company_id:projectData.company_id
            }
            setCompletedToggle(!completedToggle);
            
        }
        console.log(data)
        await axios({
            url:`${BASE_URL}/CMS/tasks`,
            method:'put',
            
            data:data

        })
        setisstatuschanged(!isstatuschanged)

      }
    const handleCancelModal = () => {
        setEditTitle(false);
        setEditBody(false);
        setEditDeadline(false);
        
        closeModal();
      };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/CMS/tasks?project_id=${projectData.project_id}&company_id=${company_id}`);
                
                const updatedTasks = await Promise.all(response.data.map(async task => {
                    const users = await fetchUsersForTask(task.task_id);
                    return { ...task, users };
                }));


                settasks(updatedTasks);
                console.log(updatedTasks,response.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const fetchUsersForTask=async(task_id)=>{
            const response = await axios.get(`${BASE_URL}/CMS/tasks_users?project_id=${projectData.project_id}&task_id=${task_id}`);
            
            const users = response.data.map(user => ({ user_id: user.user_id, name: user.username }));
                return users;
        }
        const fetchprojectusers=async(project_id)=>{
            const response = await axios.get(`${BASE_URL}/CMS/project_memebers?project_id=${project_id}&company_id=${company_id}`);
           
           

      setprojectmembers(response.data);
            
                

        }
        
    
        fetchData();
        fetchprojectusers(projectData.project_id);
        console.log(tasks,projectData)
        
    }, [isstatuschanged]);
    const filteredTasks = tasks.filter(task => {
        if (doingToggle && task.status === "pending") {
            return true;
        } else if (progressToggle && task.status === "in-progress") {
            return true;
        } else if (completedToggle && task.status === "completed") {
            return true;
        }
        return false;
    });
    const formatDeadline = (deadline) => {
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
    
      const formattedDeadline = new Date(deadline).toLocaleString('en-GB', options);
      return formattedDeadline;
    };
    
    const handledelete=async(task)=>{
      console.log(task)
      const data={
        task_id:task.task_id
      }
      await axios({
        url:`${BASE_URL}/CMS/tasks`,
        method:'delete',
        data:data
      })
      setisstatuschanged(!isstatuschanged)
    }
    
    return (
        <div className="task_container_main">
            <div className="task_container_menu">
                <div>Profile</div>
                <button className="menu_button">Tasks</button>
                <button className="menu_button">Assigned to me</button>
                <button className="menu_button">My day</button>
                <button className="menu_button">Due soon</button>
            </div>
            <div className="task_status">
                <div className="inside_task_status">
                <button className="task_button" onClick={handleDoing}>TO DO</button>
                {doingToggle ? (
                        <div className="task_radio_group">
                        {filteredTasks.filter(task => task.status === "pending").length > 0 ? (
                          filteredTasks.map((task) => (
                            task.status === "pending" && (
                              <div className="task_radio_div" >
                              <label className="task_radio_label" onClick={(e) => { e.preventDefault(); openModal(task); }} key={task.task_id}>
                                <div>
                                  <input
                                    className="task_radio_input"
                                    type="radio"
                                    name="progressOption"
                                    value="option1"
                                    onClick={(e) => { e.stopPropagation(); handleupdatestatus(task); }}
                                    checked={false} // You may want to update this based on your logic
                                  />
                                  {task.title}
                                </div>
                                <div className="task_deadline">{formatDeadline(task.deadline)}</div>
                                <div className="task_users">
                                  {task.users.length > 0 ?
                                    <AvatarGroup max={4}>
                                      {task.users.map((user, index) => (
                                        <Tooltip title={user.name} key={index}>
                                         
                                          <Avatar alt={user.name} src={user.picturePath} />
                                        </Tooltip>
                                      ))}
                                    </AvatarGroup> : 'No users'}
                                </div>
                                
                              </label>
                              <div className="task-delete-icon" onClick={(e) => {e.preventDefault();handledelete(task) }}>
                              <RiDeleteBin5Line />
                            </div>
                            </div>
                            )
                          ))
                        ) : (
                          <div  className="task_radio_label">No Tasks</div>
                        )}
                      </div>
                    ) : null}
                <button className="task_button" onClick={handleProgress}>IN PROGRESS</button>
                {progressToggle ? (
                        <div className="task_radio_group">
                          
                          {filteredTasks.filter(task => task.status === "in-progress").length > 0 ? (
                            filteredTasks.map(task => (
                                task.status === "in-progress" &&(
                                  <div className="task_radio_div" >
                                    <label  className="task_radio_label" onClick={(e) => {e.preventDefault(); openModal(task)}}>
                                       <div>
                                        <input className="task_radio_input" type="radio" name="progressOption" value="option1" onClick={(e)=>{e.stopPropagation();handleupdatestatus(task)}}   checked={false} key={task.task_id}/> {task.title}
                                        </div>
                                        <div className="task_deadline">{formatDeadline(task.deadline)}</div>
                                        <div className="task_users">
                                        {task.users.length > 0 ?  
                                        <AvatarGroup max={4}>
                                      {task.users.map((user, index) => (
                                        <Tooltip title={user.name} key={index}>
                                        <Avatar alt={user.name} src="YourPicturePath" />
                                    </Tooltip>
                                    ))}    
                                    </AvatarGroup> : 'No users'}
                                    
                                        
                                        </div>
                                        
                                    </label> 
                                    <div className="task-delete-icon" onClick={(e) => {e.preventDefault();handledelete(task) }}>
                                    <RiDeleteBin5Line />
                                  </div>
                                  </div>                              
                                )
                            ))
                          ): (
                            <div  className="task_radio_label">No Tasks</div>
                          )}                         
                        </div>
                    ) : null}                  
                <button className="task_button" onClick={handleCompleted}>COMPLETED</button>
                {completedToggle ? (
                        <div className="task_radio_group">
                          {filteredTasks.filter(task => task.status === "completed").length > 0 ? (
                            filteredTasks.map(task => (
                                task.status === "completed" && (
                                  <div className="task_radio_div" >
                                    <label  className="task_radio_label" onClick={(e) => {e.preventDefault(); openModal(task)}}>
                                       <div>
                                         {task.title}
                                        </div>
                                        <div className="task_deadline">{formatDeadline(task.deadline)}</div>
                                        <div className="task_users">
                                        {task.users.length > 0 ?  
                                        <AvatarGroup max={4}>
                                      {task.users.map((user, index) => (
                                        <Tooltip title={user.name} key={index}>
                                        <Avatar alt={user.name} src="YourPicturePath" />
                                    </Tooltip>
                                    ))}    
                                    </AvatarGroup> : 'No users'}                                 
                                        </div>
                                        
                                    </label>
                                    <div className="task-delete-icon" onClick={(e) => {e.preventDefault();handledelete(task) }}>
                                    <RiDeleteBin5Line />
                                  </div>
                                  </div>
                                )
                            ))
                            ):(
                              <div  className="task_radio_label">No Tasks</div>
                            )}  
                        </div>
                    ) : null}
            </div>
            </div>       
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Task Modal"
      className="task_modal"
    >
      {selectedTask && (
        <>
          <div>
            <h2 className="task_modal_p">
                Title:{" "}
              {editTitle ? (
                <div  className="task_divmain_modal">
                <div className="task_div_modal">
                <input
                className="task_input_modal"
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      title: e.target.value,
                    })
                  }
                />
                </div> <button className="task_cancel_fields" onClick={handleCancelTitle}>
                cancel 
              </button>             
              </div>
              ) : (
                <div  className="task_2divmain_modal">
                <div className="task_2div_modal">
               {selectedTask.title}<button className="task_modal_edit"onClick={handleEditTitle}>
                <FiEdit2/>
              </button>
              </div>
              </div>
              )}           
            </h2>
          </div>
          <div>
            <p className="task_modal_p">
              Body:{" "}
              {editBody ? (
                <div  className="task_divmain_modal">
                <div className="task_div_modal">
                <input
                 className="task_input_modal"
                  value={selectedTask.body}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      body: e.target.value,
                    })
                  }
                />
                </div>
                <button className="task_cancel_fields" onClick={handleCancelBody}>
                cancel 
              </button>
              </div>
              ) :(
                <div  className="task_2divmain_modal">
                <div className="task_2div_modal">
               {selectedTask.body}<button className="task_modal_edit" onClick={handleEditBody}>
                <FiEdit2/>
              </button>
              </div>
              </div>
              )}           
            </p>
          </div>
          <div>
            <p className="task_modal_p">
              Deadline:{" "}
              {editDeadline ? (
  <div className="task_divmain_modal">
    <div className="task_div_modal">
      <input
        className="task_input_modal"
        type="datetime-local" 
        value={editedDeadline || formatDeadline(selectedTask.deadline)}
        onChange={(e) => handledeadlinechange(e,setSelectedTask)
          
        }
      />
    </div>
    <button className="task_cancel_fields" onClick={handleCancelDeadline}>
      Cancel
    </button>
  </div>
)
 : (
                <div  className="task_2divmain_modal">
                <div className="task_2div_modal">
               { formatDeadline(selectedTask.deadline)} 
               <button className="task_modal_edit" onClick={handleEditDeadline}>
                <FiEdit2 />
              </button>
              </div>
              </div>
              )}
            </p>
          </div>
          <label>
            <input className="task_modal_radio_input" type="radio" name="progressOption" checked={selectedTask.status === "pending"} onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      status: e.target.value,
                    })
                  } value="pending" /> 
            pending
          </label>
          <label>
            <input className="task_modal_radio_input" type="radio" name="progressOption" checked={selectedTask.status === "in-progress"} onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      status: e.target.value,
                    })
                  }value="in-progress" /> 
            in-progress
          </label>
          <label>
            <input className="task_modal_radio_input" type="radio" name="progressOption" checked={selectedTask.status === "completed"}onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      status: e.target.value,
                    })
                  } value="completed" /> 
            completed
          </label>
          <div>
            <div className="task_users">
              {selectedTask.users.length > 0 ? (
                <div className="model_avathar_group">
                <div className="avatar-group-container">
                  <AvatarGroup max={4}>
                    {selectedTask.users.map((user, index) => (
                      <Tooltip title={user.name} key={index}>
                        <Avatar alt={user.name} src="YourPicturePath" />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </div>
                <IoMdAdd onClick={() => setIsDropdownOpen(true)} />
              </div>
              ) : (
               <div> No users <IoMdAdd onClick={() => setIsDropdownOpen((prev) => !prev)}/></div>
              )}
              {isDropdownOpen && (
                        <div className="task-modal-dropdown-content">
                          <div className="assigned-members">
                            <p className="assigned-members-p">Members Assigned in Task:</p>
                            {selectedTask.users.map((member, index) => (
                              <div className="assigned-members-div" key={index}>
                                {member.name}
                                <span className="assigned-members-span" onClick={() => handleRemoveMember(member)}>
                                  X
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="project-members">
                            <p className="project-members-p">Project Members:</p>
                            {projectmembers
                            .filter((member) => !selectedTask.users.some((taskUser) => taskUser.user_id === member.user_id))
                            .map((member, index) => (
                                <div className="project-members-div" key={index} onClick={() => handleAddMember(member,selectedTask)}>
                                {member.username}
                                </div>
                            ))}
                        </div>
                        </div>
                      )}
            </div>
          </div>
        </>
      )}
        <button className="task_save_fields_main_modal" onClick={handlemodalsave}>
                Save 
              </button>
              <button className="task_cancel_fields_main_modal" onClick={handleCancelModal}>
                cancel 
              </button>
    </Modal>
    <Modal
      isOpen={openmodalcreatetask}
      onRequestClose={closecreateModal}
      contentLabel="Task Modal"
      className="task_modal"
    >
      
        <>
          <div>
            <h2 className="task_modal_p">
                Title:{" "}
              
                <div  className="task_divmain_modal">
                <div className="task_div_modal">
                <input
                className="task_input_modal"
                  type="text"
                  onChange={(e)=>{
                    setEditedTitle(e.target.value)
                  }}  
                  
                />
                </div>            
              </div>
                      
            </h2>
          </div>
          <div>
            <p className="task_modal_p">
              Body:{" "}
             
                <div  className="task_divmain_modal">
                <div className="task_div_modal">
                <input
                 className="task_input_modal"
                 type="text"
                 onChange={(e)=>{
                  setEditedBody(e.target.value)
                }}  
                
                  
                  
                  
                />
                </div>
                
              </div>
                     
            </p>
          </div>
          <div>
            <p className="task_modal_p">
              Deadline:{" "}
              
  <div className="task_divmain_modal">
    <div className="task_div_modal">
      <input
        className="task_input_modal"
        type="datetime-local" 
        onChange={(e)=>{
          setEditedDeadline(e.target.value)
        }}  
        
       
      />
    </div>
   
  </div>

 
            </p>
          </div>
          
          
        </>
      
        <button className="task_save_fields_main_modal" onClick={handlemodalcreate}>
                create 
              </button>
              <button className="task_cancel_fields_main_modal" onClick={closecreateModal}>
                cancel 
              </button>
    </Modal>
    {user.user_id===CEO.user_id&&
    (<div className="new-task" onClick={handlecreatetask}>
    <IoMdAdd className="new-tasklogo"/>
    </div>

)}    
        </div>
    );
}
export default Task;
