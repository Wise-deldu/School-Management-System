import { createBrowserRouter } from "react-router-dom";
import React from 'react'
import Layouts from "./Layouts";
import Dashboard from './Routes/Dashboard'
import Attendance from './Routes/Attendance'
import Performance from './Routes/Performance'
import Students from './Routes/Students'
import Subjects from './Routes/Subjects'
import Teachers from './Routes/Teachers'

const App = createBrowserRouter([
  {
    path: "/",
    element: <Layouts />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/attendance",
        element: <Attendance />,
      },
      {
        path: "/performance",
        element: <Performance />,
      },
      {
        path: "/students",
        element: <Students />,
      },
      {
        path: "/subjects",
        element: <Subjects />,
      },
      {
        path: "/teachers",
        element: <Teachers />,
      }
    ],
  },
]);
export default App