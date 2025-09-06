import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  )
}


export default App
