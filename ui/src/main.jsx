import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query';
import { SocketProvider } from './components/SocketProvider/SocketProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <App />
  <React.StrictMode>
    <SocketProvider>
        <QueryClientProvider client={new QueryClient()}>
          <App />
        </QueryClientProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>,
)
