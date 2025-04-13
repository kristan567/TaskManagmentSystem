import React, { useState, useEffect } from "react";
import "./task.css";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams({
          page,
          limit,
          sortBy,
          sortOrder,
          ...(filters.status && { status: filters.status }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate })
        }).toString();

        const response = await axios.get(`http://localhost:8000/api/allTask?${params}`);
        setTasks(response.data.tasks);
        setTotalTasks(response.data.total);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [page, limit, sortBy, sortOrder, filters]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: ""
    });
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const deletetask = async (taskId) => {
    await axios
      .delete(`http://localhost:8000/api/taskdelete/${taskId}`)
      .then((response) => {
        setTasks((prevTask) => prevTask.filter((task) => task._id !== taskId));
        setTotalTasks(prev => prev - 1);
        toast.success(response.data.message, { position: "top-right" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="TaskTable">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/addtask" type="button" className="btn btn-primary">
          <i className="fa-solid fa-plus"></i> Add Task
        </Link>
        
       
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col"><div 
                className="sortable"
                onClick={() => handleSort("title")}
              >
                Title
                {sortBy === "title" && (
                  <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"} ms-2`} />
                )}
              </div></th>
            <th scope="col">Description</th>
            <th scope="col">
              <div className="d-flex flex-column">
                <div 
                  className="sortable"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortBy === "status" && (
                    <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"} ms-2`} />
                  )}
                </div>
                <select 
                  name="status" 
                  className="form-select form-select-sm mt-1"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </th>
            <th scope="col">
              <div className="d-flex flex-column">
                <div 
                  className="sortable"
                  onClick={() => handleSort("createdAt")}
                >
                  Start Date
                  {sortBy === "createdAt" && (
                    <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"} ms-2`} />
                  )}
                </div>
                <div className="d-flex gap-1 mt-1">
                
                </div>
              </div>
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td>{(page - 1) * limit + index + 1}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              <td className="actionButtons">
                <Link
                  to={`/update/` + task._id}
                  type="button"
                  className="btn btn-info btn-sm"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                <button 
                  onClick={() => deletetask(task._id)} 
                  className="btn btn-danger btn-sm ms-1"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
      <div className="d-flex align-items-center">
          <label className="me-2">Items per page:</label>
          <select 
            className="form-select d-inline-block w-auto"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          
          {Object.values(filters).some(Boolean) && (
            <button 
              className="btn btn-sm btn-outline-secondary ms-3"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
        <div>Showing {tasks.length} of {totalTasks} tasks</div>
        
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
            </li>
            
            {Array.from({ length: Math.ceil(totalTasks / limit) }, (_, i) => (
              <li 
                key={i + 1} 
                className={`page-item ${page === i + 1 ? 'active' : ''}`}
              >
                <button 
                  className="page-link" 
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${page * limit >= totalTasks ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Task;