import './App.css'
import Dashboard from './components/Dashboard'
import HomePage from './components/HomePage'
import Login from './components/Login'

function App() {

  return (
    <div className='app'>
      <HomePage />
      <Login />
      <Dashboard />
    </div>
  )
}

export default App
