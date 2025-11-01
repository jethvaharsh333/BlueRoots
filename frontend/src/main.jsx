import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import "leaflet/dist/leaflet.css";
import { ToastProvider } from './components/providers/toast-provider.jsx'
import store from './redux/store.js';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
      <ToastProvider />
      <App />
    </BrowserRouter>
    </PersistGate>
  </Provider>
  // </StrictMode>,
)
