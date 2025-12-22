import './App.css'
import { AuthProvider } from './context/AuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import Router from './routes'
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <Router/>
      </AuthModalProvider>
    </AuthProvider>
  )
}
export default App
