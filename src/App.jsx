import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/Signup'
import Dashboard from './pages/dashboard'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChangePassword from './components/ChangePassword'
import Video from './pages/Video'
import Lobby from './pages/Lobby'
import MeetingDetails from './pages/MeetingDetails'
import CalendarView from './context/CalendarView'
import { WorkspaceView } from './context/WorkspaceView'
import RecordingsView from './context/RecordingView'
import ForgotPassword from './components/ForgotPassword'

// 1. Import your newly separated LandingPage file here
import LandingPage from './context/LandingPage'
import Features from './context/Features'
import HowItWorks from './context/HowItWorks'
import Pricing from './context/Pricing'
import About from './context/About'
import Footer from './context/Footer'
function App() {
  return (
    <Routes>
      {/* 2. Your root route now points straight to the separate file component */}
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/features' element={<Features/>}/>
    <Route path='/howitworks' element={<HowItWorks/>}/>
    <Route path='/pricing' element={<Pricing/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/footer' element={<Footer/>}/>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/profile" element={<Profile />} />
      <Route path="/dashboard/profile/edit" element={<EditProfile />} />
      <Route path="/dashboard/profile/change-password" element={<ChangePassword />} />
      <Route path="/video" element={<Video />} />
      <Route path="/lobby" element={<Lobby/>}/>
      <Route path="/meeting/:roomId" element={<Video />} />
      <Route path="/meeting/:roomId/lobby" element={<Lobby />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/dashboard/calendar" element={<CalendarView/>}/>
      <Route path="/dashboard/workspace" element={<WorkspaceView/>}/>
      <Route path="/dashboard/recording" element={<RecordingsView/>}/>

      <Route path="/meeting-details/:meetingCode" element={<MeetingDetails/>}/>
    </Routes>
  )
}

export default App