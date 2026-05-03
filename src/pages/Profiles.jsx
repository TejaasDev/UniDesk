import React, { useState } from 'react'
import { useProfileContext } from '../context/ProfilesContext'
import CreateProfile from '../components/CreateProfile'
import { useNavigate } from 'react-router-dom'

const Profiles = () => {
  const { profiles, createProfile } = useProfileContext()
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate();

  return (
    <>
      <div className='w-screen min-h-screen p-4 flex flex-wrap gap-4'>

        {profiles.map((profile, index) => (
          <div
            onClick={() => navigate(`/os/${profile.id}`)}
            key={profile.id || index}
            className='w-40 h-50 bg-zinc-600 text-white p-4 flex flex-col justify-end items-center text-3xl shadow-2xl'
          >
            <h1 className='text-base'>{profile.name}</h1>
          </div>
        ))}

        <div
          className='w-40 h-50 bg-zinc-800 border-2 border-dashed border-zinc-600 text-zinc-400 p-4 flex items-center justify-center text-4xl cursor-pointer hover:bg-zinc-700 hover:text-white transition-colors relative'
          onClick={() => setShowModal(true)}
        >
          +

          {/* <div className='absolute h-full w-full top-5 bg-blue-700'></div> */}
        </div>

      </div>

      {showModal && (
        <CreateProfile
          onClose={() => setShowModal(false)}
          onCreate={(apps, name) => {
            createProfile(apps, name)
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}

export default Profiles