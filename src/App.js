import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
