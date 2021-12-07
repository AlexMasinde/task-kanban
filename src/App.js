import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ProjectsProvider } from "./contexts/ProjectsContext";
import { TasksProvider } from "./contexts/TasksContext";

import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import AddProject from "./Components/AddProject/AddProject";
import AddTask from "./Components/AddTask/AddTask";
import UserProfile from "./Components/UserProfile/UserProfile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectsProvider>
          <TasksProvider>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="newproject" element={<AddProject />} />
              <Route path="addtask/:taskGroup" element={<AddTask />} />
              <Route
                path="/userprofile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </TasksProvider>
        </ProjectsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
