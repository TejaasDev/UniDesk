import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Profiles from './pages/Profiles'
import OS from './pages/OS'

const App = () => {

  return (
    <main>
        <Routes>
            <Route path='/auth' element={<Auth />} />
            <Route path='/profiles' element={<Profiles />} />
            <Route path='/os/:id' element={<OS />} />
        </Routes>
    </main>
  )
}

export default App