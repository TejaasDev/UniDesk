import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Profiles from './pages/Profiles'
import OS from './pages/OS'
import ProtectedPage from './pages/ProtectedPage'

const App = () => {

  return (
    <main>
        <Routes>
            <Route path='/auth' element={<Auth />} />
            <Route path='/profiles' element={<ProtectedPage><Profiles /></ProtectedPage>} />
            <Route path='/os/:id' element={<ProtectedPage><OS /></ProtectedPage>} />
            <Route path='/' element={<ProtectedPage />} />
        </Routes>
    </main>
  )
}

export default App