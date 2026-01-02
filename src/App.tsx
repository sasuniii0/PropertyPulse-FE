import './App.css'
import { AuthProvider } from './context/AuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import Router from './routes'
import "leaflet/dist/leaflet.css";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <Router/>
        <Toaster position="top-right" reverseOrder={false} />
      </AuthModalProvider>
    </AuthProvider>
  )
}
export default App
