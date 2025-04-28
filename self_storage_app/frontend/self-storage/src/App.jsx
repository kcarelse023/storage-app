// eslint-disable-next-line no-unused-vars
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import ClientPage from './pages/client/client'
import './App.css'
import DashboardPage from "@/pages/dashboard/dashboard.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/client" element={<ClientPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  )
}