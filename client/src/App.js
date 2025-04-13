import './App.css';
import  AddTask from "./addtask/AddTask";
import  Task  from './gettask/Task';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Update from "./updatetask/Update";
import {Toaster} from 'react-hot-toast';

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Task />,
    },
    {
      path: "/addtask",
      element: <AddTask />,
    },
    {
      path: "/update/:id",
      element: <Update />,
    },
  ]);
  <Toaster position="top-right" />
  return (
    <div className="App">
      <RouterProvider router={route} />
    </div>
  );
}

export default App;
