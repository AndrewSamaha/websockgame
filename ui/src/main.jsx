import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './components/SocketProvider/SocketProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <App />
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>,
)
