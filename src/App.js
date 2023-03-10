import './App.css';
import "./scss/style.scss";
import "./scss/pages/login.scss";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminPanel from './pages/AdminPanel';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { requestPermission } from "./messaging";
import NewsPanel from './pages/NewsPanel';

function App() {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const unsuscribe = () => {
      if(currentUser){
        requestPermission(currentUser);
      }
    }
    unsuscribe()
  }, [currentUser]);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    } else {
      return children;
    }
  }

  return (
    <div className="App">
      <Router>
        <Routes path="/">
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/news" element={<NewsPanel />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
