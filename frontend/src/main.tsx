// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 1. เพิ่ม import นี้
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. เอา BrowserRouter มาครอบ App ไว้ */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)