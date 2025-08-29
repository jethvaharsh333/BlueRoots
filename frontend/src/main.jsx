import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/providers/toast-provider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ToastProvider />
    <App />
    </BrowserRouter>
  </StrictMode>,
)
