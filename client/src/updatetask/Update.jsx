import React, { useEffect, useState } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Updatetask = () => {
  const tasks = {
    title: "",
    description: "",
    status: "pending",
  };
  const [task, settask] = useState(tasks);
  const navigate = useNavigate();
  const { id } = useParams();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    settask({ ...task, [name]: value });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/task/${id}`)
      .then((response) => {
        settask(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    await axios
      .put(`http://localhost:8000/api/taskupdate/${id}`, task)
      .then((response) => {
        toast.success(response.data.message, { position: "top-right" });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="addtask">
      <Link to="/" type="button" class="btn btn-secondary">
        <i class="fa-solid fa-backward"></i> Back
      </Link>

      <h3>Update task</h3>
      <form className="addtaskForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="title">title:</label>
          <input
            type="text"
            id="title"
            value={task.title}
            onChange={inputHandler}
            name="title"
            autoComplete="off"
            placeholder="Enter your title"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="description">Description:</label>
          <input
            type="description"
            id="description"
            value={task.description}
            onChange={inputHandler}
            name="description"
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
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Updatetask;