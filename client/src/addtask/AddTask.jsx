import React, { useState } from "react";
import "./addtask.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AddTask = () => {
  const initialTask = {
    title: "",
    description: "",

    status: "pending", // default
  };
  const [task, setTask] = useState(initialTask);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
    
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/task", task);
      toast.success(response.data.message, { position: "top-right" });
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="addTask">
      <Link to="/" type="button" className="btn btn-secondary">
        <i className="fa-solid fa-backward"></i> Back
      </Link>

      <h3>Add New Task</h3>
      <form className="addTaskForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={inputHandler}
            value={task.title}
            autoComplete="off"
            placeholder="Enter your title"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            onChange={inputHandler}
            value={task.description}
            autoComplete="off"
            placeholder="Enter your description"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            className="form-select"
            onChange={inputHandler}
            value={task.status}
          >
      
            <option value="pending">pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Complete</option>
          </select>
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
