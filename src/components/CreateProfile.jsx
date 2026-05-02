import React, { useState } from 'react'

const AVAILABLE_APPS = ['notepad', 'browser', 'terminal', 'files', 'music', 'calendar']

const CreateProfile = ({ onClose, onCreate }) => {
  const [name, setName] = useState('')
  const [selectedApps, setSelectedApps] = useState([])
  const [error, setError] = useState('')

  const toggleApp = (app) => {
    setSelectedApps(prev =>
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    )
  }

  const handleSubmit = () => {
    if (!name.trim()) { setError('Profile name is required'); return }
    if (selectedApps.length === 0) { setError('Select at least one app'); return }
    onCreate(selectedApps, name.trim())
  }

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
      <div className='bg-zinc-800 text-white w-96 p-6 flex flex-col gap-4'>

        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold'>New Profile</h2>
          <button className='text-zinc-400 hover:text-white text-xl' onClick={onClose}>x</button>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-sm text-zinc-400'>Profile Name</label>
          <input
            className='bg-zinc-700 text-white px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-400'
            placeholder='e.g. Work, Gaming...'
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm text-zinc-400'>Apps</label>
          <div className='grid grid-cols-3 gap-2'>
            {AVAILABLE_APPS.map(app => (
              <button
                key={app}
                onClick={() => { toggleApp(app); setError('') }}
                className={`py-2 px-3 text-sm border transition-colors ${
                  selectedApps.includes(app)
                    ? 'bg-white text-zinc-900 border-white'
                    : 'bg-transparent text-zinc-400 border-zinc-600 hover:border-zinc-400'
                }`}
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        {error && <p className='text-red-400 text-sm'>{error}</p>}

        <div className='flex gap-2 mt-2'>
          <button
            className='flex-1 py-2 border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 transition-colors'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='flex-1 py-2 bg-white text-zinc-900 font-medium hover:bg-zinc-200 transition-colors'
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreateProfile