import React, { useEffect, useRef, useState } from "react"
import { apps } from "../../data"

const TaskBar = ({ currentProfile, onAppClick, openWindows }) => {
  const [relevantApps, setRelevantApps] = useState([])
  const barRef = useRef(null)

  useEffect(() => {
    setRelevantApps(apps.filter(app => currentProfile.apps?.includes(app.name)))
  }, [currentProfile])

  return (
    <div className='absolute bottom-4 left-1/2 -translate-x-1/2'>
      <div
        ref={barRef}
        className='flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 shadow-xl'
      >
        {relevantApps.map(app => {
          const isOpen = openWindows.some(w => w.app === app.name && !w.minimized)
          const isMin = openWindows.some(w => w.app === app.name && w.minimized)
          return (
            <div key={app.name} className='flex flex-col items-center gap-1'>
              <button
                onClick={() => onAppClick(app.name)}
                className='w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-white/10'
                title={app.name}
              >
                <img src={app.icon} alt={app.name} className='w-9 h-9 object-contain' />
              </button>
              <div className={`w-1 h-1 rounded-full transition-all ${isOpen ? 'bg-white' : isMin ? 'bg-white/40' : 'bg-transparent'}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TaskBar