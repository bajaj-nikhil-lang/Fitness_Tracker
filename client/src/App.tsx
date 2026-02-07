import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import FoodLog from './pages/FoodLog'
import ActivityLog from './pages/ActivityLog'
import Profile from './pages/Profile'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import Loading from './components/Loading'
import Onboarding from './pages/Onboarding'
import { Toaster } from 'react-hot-toast'
// npm run dev

const App = () => {
  const {user, isUserFetched, onboardingCompleted} = useAppContext();

  if(!user) {
    return isUserFetched ? <Login /> : <Loading />
  }

  if(!onboardingCompleted) {
    return <Onboarding />
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path='/food' element={<FoodLog />}/>
          <Route path='/activity' element={<ActivityLog />}/>
          <Route path='/profile' element={<Profile />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App