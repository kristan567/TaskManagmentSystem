import express from "express"


import {create, getAllTask, getTaskById, updateTask, deleteTask} from "../controller/taskController.js"


const route = express.Router();

route.post("/task", create);
route.get("/allTask", getAllTask);
route.get("/task/:id", getTaskById);
route.put("/taskupdate/:id", updateTask);
route.delete("/taskdelete/:id", deleteTask);


export default route;

