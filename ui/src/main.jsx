import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query';
import { SocketProvider } from './components/SocketProvider/SocketProvider';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
    </SocketProvider>
  </React.StrictMode>,
)
