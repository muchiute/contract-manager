import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";

function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="p-4 bg-white shadow">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/dashboard" className="mr-4">Dashboard</Link>
          <Link to="/kanban">Kanban</Link>
        </nav>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/kanban" element={<Kanban/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
