import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useProfileContext } from '../context/ProfilesContext'
import { apps } from '../data'
import { gsap } from 'gsap'

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [fresh, setFresh] = useState(false)

  const press = (val) => {
    if (typeof val === 'number' || val === '.') {
      const next = fresh || display === '0' ? String(val) : display + val
      setDisplay(next)
      setFresh(false)
    } else if (val === 'C') {
      setDisplay('0'); setPrev(null); setOp(null); setFresh(false)
    } else if (val === '=') {
      if (op && prev !== null) {
        const a = parseFloat(prev), b = parseFloat(display)
        const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b
        setDisplay(String(parseFloat(result.toFixed(10))))
        setPrev(null); setOp(null); setFresh(true)
      }
    } else {
      setPrev(display); setOp(val); setFresh(true)
    }
  }

  const btns = ['C', '/', '*', '-', 7, 8, 9, '+', 4, 5, 6, '=', 1, 2, 3, 0, '.']

  return (
    <div className='flex flex-col h-full bg-zinc-900 p-3 gap-2'>
      <div className='bg-zinc-800 rounded p-3 text-right text-white font-mono text-2xl overflow-hidden'>
        {display}
      </div>
      <div className='grid grid-cols-4 gap-1 flex-1'>
        {btns.map((b, i) => (
          <button
            key={i}
            onClick={() => press(b)}
            className={`rounded text-sm font-mono font-bold transition-all active:scale-95
              ${b === '=' ? 'bg-violet-600 hover:bg-violet-500 text-white' : ''}
              ${b === 'C' ? 'bg-red-600 hover:bg-red-500 text-white' : ''}
              ${b === 0 ? 'col-span-2 bg-zinc-700 hover:bg-zinc-600 text-white' : ''}
              ${typeof b === 'number' && b !== 0 ? 'bg-zinc-700 hover:bg-zinc-600 text-white' : ''}
              ${['+', '-', '*', '/'].includes(b) ? 'bg-zinc-600 hover:bg-zinc-500 text-violet-300' : ''}
              ${b === '.' ? 'bg-zinc-700 hover:bg-zinc-600 text-white' : ''}
            `}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  )
}

const TerminalApp = () => {
  const [lines, setLines] = useState([
    { type: 'sys', text: 'RoboOS Terminal v1.0.0' },
    { type: 'sys', text: 'Type "help" for available commands.' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const bottomRef = useRef(null)

  const commands = {
    help: () => ['Commands: help, clear, echo [text], date, whoami, ls, pwd, uname'],
    clear: () => { setLines([]); return [] },
    date: () => [new Date().toString()],
    whoami: () => ['robopilot'],
    pwd: () => ['/home/robopilot'],
    uname: () => ['RoboOS 1.0.0 (x86_64)'],
    ls: () => ['apps/   documents/   downloads/   pictures/'],
    echo: (args) => [args.join(' ')],
  }

  const run = (cmd) => {
    const [name, ...args] = cmd.trim().split(' ')
    const result = commands[name] ? commands[name](args) : [`${name}: command not found`]
    if (result.length > 0) {
      setLines(prev => [
        ...prev,
        { type: 'in', text: `$ ${cmd}` },
        ...result.map(t => ({ type: 'out', text: t })),
      ])
    }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  return (
    <div className='flex flex-col h-full bg-black text-green-400 font-mono text-xs p-3 gap-1'>
      <div className='flex-1 overflow-y-auto space-y-0.5'>
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.type === 'in' ? 'text-green-300' :
              l.type === 'sys' ? 'text-zinc-500' :
              'text-green-400'
            }
          >
            {l.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className='flex items-center gap-2 border-t border-green-900 pt-2'>
        <span className='text-green-600'>$</span>
        <input
          autoFocus
          className='flex-1 bg-transparent outline-none text-green-400 caret-green-400'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              run(input)
              setHistory(h => [input, ...h])
              setHistIdx(-1)
              setInput('')
            } else if (e.key === 'ArrowUp') {
              const idx = Math.min(histIdx + 1, history.length - 1)
              setHistIdx(idx)
              setInput(history[idx] || '')
            } else if (e.key === 'ArrowDown') {
              const idx = Math.max(histIdx - 1, -1)
              setHistIdx(idx)
              setInput(idx === -1 ? '' : history[idx])
            }
          }}
        />
      </div>
    </div>
  )
}

const SettingsApp = () => {
  const [tab, setTab] = useState('appearance')
  const [wallpaper, setWallpaper] = useState(0)
  const [volume, setVolume] = useState(70)
  const [brightness, setBrightness] = useState(100)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  const wallpapers = [
    'https://images.unsplash.com/photo-1672872476232-da16b45c9001?w=200',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200',
  ]

  const tabs = ['appearance', 'sound', 'system']

  return (
    <div className='flex h-full bg-zinc-900 text-white text-sm'>
      <div className='w-32 border-r border-zinc-700 flex flex-col pt-2'>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-left capitalize text-xs transition-colors
              ${tab === t ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className='flex-1 p-4 overflow-y-auto flex flex-col gap-4'>
        {tab === 'appearance' && (
          <>
            <p className='text-xs text-zinc-400 uppercase tracking-widest'>Wallpaper</p>
            <div className='grid grid-cols-2 gap-2'>
              {wallpapers.map((w, i) => (
                <div
                  key={i}
                  onClick={() => setWallpaper(i)}
                  className={`rounded overflow-hidden cursor-pointer border-2 transition-all
                    ${wallpaper === i ? 'border-violet-500' : 'border-transparent'}`}
                >
                  <img src={w} alt='' className='w-full h-16 object-cover' />
                </div>
              ))}
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-zinc-300'>Dark Mode</span>
              <button
                onClick={() => setDarkMode(d => !d)}
                className={`w-10 h-5 rounded-full transition-colors relative ${darkMode ? 'bg-violet-600' : 'bg-zinc-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${darkMode ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </>
        )}
        {tab === 'sound' && (
          <>
            <p className='text-xs text-zinc-400 uppercase tracking-widest'>Volume</p>
            <div className='flex items-center gap-3'>
              <span className='text-zinc-400 text-xs'>0</span>
              <input type='range' min={0} max={100} value={volume} onChange={e => setVolume(e.target.value)} className='flex-1 accent-violet-500' />
              <span className='text-zinc-300 text-xs w-6'>{volume}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-zinc-300'>Notifications</span>
              <button
                onClick={() => setNotifications(n => !n)}
                className={`w-10 h-5 rounded-full transition-colors relative ${notifications ? 'bg-violet-600' : 'bg-zinc-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${notifications ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </>
        )}
        {tab === 'system' && (
          <>
            <p className='text-xs text-zinc-400 uppercase tracking-widest'>Display</p>
            <div className='flex items-center gap-3'>
              <span className='text-zinc-400 text-xs'>Brightness</span>
              <input type='range' min={20} max={100} value={brightness} onChange={e => setBrightness(e.target.value)} className='flex-1 accent-violet-500' />
              <span className='text-zinc-300 text-xs w-6'>{brightness}%</span>
            </div>
            <div className='bg-zinc-800 rounded p-3 space-y-1 text-xs text-zinc-400 mt-2'>
              <div className='flex justify-between'><span>OS</span><span className='text-white'>RoboOS 1.0</span></div>
              <div className='flex justify-between'><span>Build</span><span className='text-white'>2026.1.0</span></div>
              <div className='flex justify-between'><span>Kernel</span><span className='text-white'>6.8.0-robopilot</span></div>
              <div className='flex justify-between'><span>RAM</span><span className='text-white'>8 GB</span></div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const NotesApp = () => {
  const [notes, setNotes] = useState([{ id: 1, title: 'Welcome', body: 'Start typing your notes here...' }])
  const [active, setActive] = useState(1)
  const current = notes.find(n => n.id === active)

  const update = (field, val) =>
    setNotes(prev => prev.map(n => n.id === active ? { ...n, [field]: val } : n))

  const newNote = () => {
    const id = Date.now()
    setNotes(prev => [...prev, { id, title: 'Untitled', body: '' }])
    setActive(id)
  }

  const deleteNote = (id) => {
    const remaining = notes.filter(n => n.id !== id)
    setNotes(remaining)
    setActive(remaining[0]?.id || null)
  }

  return (
    <div className='flex h-full bg-zinc-900 text-white'>
      <div className='w-40 border-r border-zinc-700 flex flex-col'>
        <button onClick={newNote} className='text-xs py-2 px-3 bg-violet-700 hover:bg-violet-600 transition-colors shrink-0'>
          + New Note
        </button>
        <div className='flex-1 overflow-y-auto'>
          {notes.map(n => (
            <div
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`group px-3 py-2 text-xs cursor-pointer border-b border-zinc-800 flex justify-between items-center
                ${active === n.id ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              <span className='truncate flex-1'>{n.title || 'Untitled'}</span>
              {notes.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); deleteNote(n.id) }}
                  className='opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 ml-1 text-xs'
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='flex-1 flex flex-col'>
        <input
          className='bg-transparent border-b border-zinc-700 px-4 py-2 text-sm font-semibold outline-none placeholder-zinc-600'
          value={current?.title || ''}
          placeholder='Title'
          onChange={e => update('title', e.target.value)}
        />
        <textarea
          className='flex-1 bg-transparent px-4 py-3 text-sm text-zinc-300 outline-none resize-none font-mono placeholder-zinc-700'
          value={current?.body || ''}
          placeholder='Write something...'
          onChange={e => update('body', e.target.value)}
        />
      </div>
    </div>
  )
}

const BrowserApp = () => {
  const [url, setUrl] = useState('https://example.com')
  const [loaded, setLoaded] = useState('https://example.com')
  const [loading, setLoading] = useState(false)

  const go = () => {
    let target = url
    if (!target.startsWith('http')) target = 'https://' + target
    setLoaded(target)
    setLoading(true)
  }

  return (
    <div className='flex flex-col h-full bg-zinc-900'>
      <div className='flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-700'>
        <input
          className='flex-1 bg-zinc-700 text-white text-xs px-3 py-1 rounded outline-none'
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && go()}
        />
        <button
          onClick={go}
          className='text-xs bg-violet-700 hover:bg-violet-600 text-white px-3 py-1 rounded transition-colors'
        >
          Go
        </button>
      </div>
      {loading && <div className='h-0.5 bg-violet-500 animate-pulse' />}
      <iframe
        src={loaded}
        className='flex-1 w-full border-0'
        title='browser'
        sandbox='allow-scripts allow-same-origin allow-forms'
        onLoad={() => setLoading(false)}
      />
    </div>
  )
}

const CodeEditorApp = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'main.py', lang: 'python', content: '# Hello from RoboOS\nprint("Hello, world!")' },
    { id: 2, name: 'index.js', lang: 'javascript', content: '// RoboOS Script\nconsole.log("Hello!")' },
  ])
  const [active, setActive] = useState(1)
  const current = files.find(f => f.id === active)

  const update = (content) =>
    setFiles(prev => prev.map(f => f.id === active ? { ...f, content } : f))

  const newFile = () => {
    const id = Date.now()
    setFiles(prev => [...prev, { id, name: `file${prev.length + 1}.txt`, lang: 'text', content: '' }])
    setActive(id)
  }

  const lineCount = (current?.content || '').split('\n').length

  return (
    <div className='flex flex-col h-full bg-zinc-950 text-white font-mono text-xs'>
      <div className='flex items-center bg-zinc-900 border-b border-zinc-700 overflow-x-auto shrink-0'>
        {files.map(f => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`px-4 py-2 text-xs shrink-0 border-r border-zinc-700 transition-colors
              ${active === f.id ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
          >
            {f.name}
          </button>
        ))}
        <button onClick={newFile} className='px-3 py-2 text-zinc-500 hover:text-white'>+</button>
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <div className='w-8 bg-zinc-900 text-zinc-600 text-right pr-2 pt-2 select-none overflow-hidden shrink-0 leading-5'>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          className='flex-1 bg-zinc-950 text-green-300 outline-none resize-none p-2 leading-5 caret-green-400'
          value={current?.content || ''}
          onChange={e => update(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className='h-5 bg-violet-900/50 border-t border-zinc-700 px-3 flex items-center gap-4 text-zinc-400 shrink-0' style={{ fontSize: 10 }}>
        <span>{current?.lang}</span>
        <span>Ln {lineCount}</span>
        <span>RoboOS Editor</span>
      </div>
    </div>
  )
}

const TicTacToeApp = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xTurn, setXTurn] = useState(true)
  const [scores, setScores] = useState({ X: 0, O: 0 })

  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

  const winner = (() => {
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
    }
    return board.every(Boolean) ? 'Draw' : null
  })()

  const click = (i) => {
    if (board[i] || winner) return
    const next = [...board]
    next[i] = xTurn ? 'X' : 'O'
    setBoard(next)
    setXTurn(t => !t)
    const w = (() => {
      for (const [a, b, c] of lines)
        if (next[a] && next[a] === next[b] && next[a] === next[c]) return next[a]
      return null
    })()
    if (w) setScores(s => ({ ...s, [w]: s[w] + 1 }))
  }

  const reset = () => { setBoard(Array(9).fill(null)); setXTurn(true) }

  return (
    <div className='flex flex-col items-center justify-center h-full bg-zinc-900 gap-4'>
      <div className='flex gap-8 text-white'>
        <div className='text-center'><div className='text-3xl font-bold text-violet-400'>{scores.X}</div><div className='text-zinc-400 text-xs mt-1'>Player X</div></div>
        <div className='text-center'><div className='text-3xl font-bold text-pink-400'>{scores.O}</div><div className='text-zinc-400 text-xs mt-1'>Player O</div></div>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className='w-16 h-16 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-2xl font-bold transition-all active:scale-95 flex items-center justify-center'
          >
            <span className={cell === 'X' ? 'text-violet-400' : 'text-pink-400'}>{cell}</span>
          </button>
        ))}
      </div>
      <div className='text-sm text-zinc-300 h-5'>
        {winner
          ? winner === 'Draw' ? "It's a draw!" : `${winner} wins!`
          : `${xTurn ? 'X' : 'O'}'s turn`}
      </div>
      <button onClick={reset} className='text-xs px-5 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors'>
        New Game
      </button>
    </div>
  )
}

const SnakeApp = () => {
  const COLS = 20, ROWS = 15, CELL = 16
  const [snake, setSnake] = useState([[10, 7], [9, 7], [8, 7]])
  const [food, setFood] = useState([15, 7])
  const [running, setRunning] = useState(false)
  const [dead, setDead] = useState(false)
  const [score, setScore] = useState(0)
  const dirRef = useRef([1, 0])
  const snakeRef = useRef([[10, 7], [9, 7], [8, 7]])
  const foodRef = useRef([15, 7])

  const randFood = (s) => {
    let f
    do { f = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)] }
    while (s.some(([x, y]) => x === f[0] && y === f[1]))
    return f
  }

  useEffect(() => {
    const handler = (e) => {
      const map = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] }
      if (map[e.key]) {
        e.preventDefault()
        const [dx, dy] = map[e.key]
        const [cx, cy] = dirRef.current
        if (dx !== -cx || dy !== -cy) dirRef.current = [dx, dy]
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      const [dx, dy] = dirRef.current
      const [hx, hy] = snakeRef.current[0]
      const nx = hx + dx, ny = hy + dy

      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS ||
          snakeRef.current.some(([x, y]) => x === nx && y === ny)) {
        setDead(true); setRunning(false); return
      }

      const ate = nx === foodRef.current[0] && ny === foodRef.current[1]
      const next = [[nx, ny], ...snakeRef.current.slice(0, ate ? undefined : -1)]
      snakeRef.current = next
      setSnake([...next])

      if (ate) {
        const nf = randFood(next)
        foodRef.current = nf
        setFood(nf)
        setScore(s => s + 1)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [running])

  const start = () => {
    const init = [[10, 7], [9, 7], [8, 7]]
    snakeRef.current = init
    dirRef.current = [1, 0]
    const nf = randFood(init)
    foodRef.current = nf
    setSnake(init)
    setFood(nf)
    setDead(false)
    setScore(0)
    setRunning(true)
  }

  return (
    <div className='flex flex-col items-center justify-center h-full bg-zinc-900 gap-3'>
      <div className='flex items-center justify-between w-full px-6'>
        <span className='text-zinc-400 text-xs'>Score: <span className='text-white font-bold'>{score}</span></span>
        <button
          onClick={running ? () => setRunning(false) : start}
          className='text-xs px-3 py-1.5 bg-violet-700 hover:bg-violet-600 text-white rounded transition-colors'
        >
          {running ? 'Pause' : dead ? 'Restart' : 'Start'}
        </button>
      </div>
      <div
        className='relative border border-zinc-700 bg-zinc-950 rounded overflow-hidden'
        style={{ width: COLS * CELL, height: ROWS * CELL }}
      >
        {snake.map(([x, y], i) => (
          <div
            key={i}
            className={`absolute rounded-sm ${i === 0 ? 'bg-violet-400' : 'bg-violet-600/80'}`}
            style={{ left: x * CELL + 1, top: y * CELL + 1, width: CELL - 2, height: CELL - 2 }}
          />
        ))}
        <div
          className='absolute bg-red-400 rounded-full'
          style={{ left: food[0] * CELL + 2, top: food[1] * CELL + 2, width: CELL - 4, height: CELL - 4 }}
        />
        {!running && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60 flex-col gap-1'>
            <span className='text-white text-sm font-medium'>{dead ? `Game Over` : 'Snake'}</span>
            {dead && <span className='text-violet-400 text-xs'>Score: {score}</span>}
          </div>
        )}
      </div>
      <div className='text-zinc-600 text-xs'>Arrow keys to move</div>
    </div>
  )
}

const APP_COMPONENTS = {
  'calculator': CalculatorApp,
  'terminal': TerminalApp,
  'settings': SettingsApp,
  'notes': NotesApp,
  'browser': BrowserApp,
  'code-editor': CodeEditorApp,
  'tic-tac-toe': TicTacToeApp,
  'snake': SnakeApp,
}

const DEFAULT_SIZES = {
  'calculator': { width: 520, height: 760 },
  'terminal': { width: 700, height: 500 },
  'settings': { width: 420, height: 380 },
  'notes': { width: 520, height: 380 },
  'browser': { width: 660, height: 480 },
  'code-editor': { width: 800, height: 600 },
  'tic-tac-toe': { width: 300, height: 400 },
  'snake': { width: 380, height: 360 },
}

const WindowFrame = ({ win, onClose, onMinimize, onFocus, onMove }) => {
  const frameRef = useRef(null)
  const isDragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const AppComponent = APP_COMPONENTS[win.app]
  const size = DEFAULT_SIZES[win.app] || { width: 420, height: 340 }

  useEffect(() => {
    gsap.fromTo(frameRef.current,
      { scale: 0.88, opacity: 0, y: 16 },
      { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'back.out(1.5)' }
    )
  }, [])

  const handleTitleMouseDown = (e) => {
    if (e.target.closest('button')) return
    isDragging.current = true
    const rect = frameRef.current.getBoundingClientRect()
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    onFocus(win.id)
    e.preventDefault()
  }

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return
      const x = e.clientX - offset.current.x
      const y = Math.max(0, e.clientY - offset.current.y)
      gsap.set(frameRef.current, { left: x, top: y })
      onMove(win.id, x, y)
    }
    const onMouseUp = () => { isDragging.current = false }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [win.id, onMove])

  const handleClose = () => {
    gsap.to(frameRef.current, {
      scale: 0.8, opacity: 0, y: 8, duration: 0.16, ease: 'power2.in',
      onComplete: () => onClose(win.id)
    })
  }

  const handleMinimize = () => {
    gsap.to(frameRef.current, {
      scale: 0.5, opacity: 0, y: 50, duration: 0.2, ease: 'power2.in',
      onComplete: () => onMinimize(win.id)
    })
  }

  return (
    <div
      ref={frameRef}
      style={{
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: size.width,
        height: size.height,
        zIndex: win.focused ? 100 : 50,
      }}
      className='flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/10'
      onMouseDown={() => onFocus(win.id)}
    >
      <div
        className='h-9 bg-zinc-800/95 backdrop-blur flex items-center px-3 gap-2 cursor-grab active:cursor-grabbing select-none shrink-0 border-b border-white/5'
        onMouseDown={handleTitleMouseDown}
      >
        <div className='flex gap-1.5'>
          <button onClick={handleClose} className='w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors' />
          <button onClick={handleMinimize} className='w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors' />
          <div className='w-3 h-3 rounded-full bg-zinc-600' />
        </div>
        <span className='text-zinc-400 text-xs flex-1 text-center -ml-10 tracking-wide capitalize'>
          {win.app.replace('-', ' ')}
        </span>
      </div>
      <div className='flex-1 overflow-hidden'>
        {AppComponent
          ? <AppComponent />
          : (
            <div className='flex flex-col items-center justify-center h-full text-zinc-500 gap-2'>
              <span className='text-3xl'>🚧</span>
              <span className='text-sm'>{win.app} coming soon</span>
            </div>
          )
        }
      </div>
    </div>
  )
}

const TaskBar = ({ currentProfile, onAppClick, openWindows }) => {
  const [relevantApps, setRelevantApps] = useState([])
  const barRef = useRef(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    setRelevantApps(apps.filter(app => currentProfile.apps?.includes(app.name)))
    animatedRef.current = false
  }, [currentProfile])

  useEffect(() => {
    if (barRef.current && relevantApps.length > 0 && !animatedRef.current) {
      animatedRef.current = true
      gsap.fromTo(
        Array.from(barRef.current.children),
        { y: 40, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.5, ease: 'back.out(1.6)', delay: 0.1 }
      )
    }
  }, [relevantApps])

  return (
    <div className='absolute bottom-5 left-1/2 -translate-x-1/2' style={{ zIndex: 200 }}>
      <div
        ref={barRef}
        className='flex items-end gap-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-3 py-3 shadow-2xl'
      >
        {relevantApps.map(app => {
          const isOpen = openWindows.some(w => w.app === app.name && !w.minimized)
          const isMin = openWindows.some(w => w.app === app.name && w.minimized)
          return (
            <div key={app.name} className='flex flex-col items-center gap-1'>
              <button
                onClick={() => onAppClick(app.name)}
                title={app.name}
                className='w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-125 active:scale-95 hover:bg-white/10'
              >
                <img src={app.icon} alt={app.name} className='w-9 h-9 object-contain drop-shadow' />
              </button>
              <div className={`w-1 h-1 rounded-full transition-all ${isOpen ? 'bg-white' : isMin ? 'bg-white/40' : 'bg-transparent'}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Clock = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className='absolute top-4 right-5 text-right select-none' style={{ zIndex: 10 }}>
      <div className='text-white text-lg font-light tracking-wide drop-shadow'>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className='text-white/50 text-xs'>
        {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </div>
  )
}

const OS = () => {
  const { id } = useParams()
  const { profiles } = useProfileContext()
  const [currentProfile, setCurrentProfile] = useState({})
  const [windows, setWindows] = useState([])

  useEffect(() => {
    const found = profiles.find(p => p.id === parseInt(id))
    if (found) setCurrentProfile(found)
  }, [id, profiles])

  const openApp = useCallback((appName) => {
    setWindows(prev => {
      const existing = prev.find(w => w.app === appName)
      if (existing) {
        return prev.map(w =>
          w.id === existing.id
            ? { ...w, minimized: false, focused: true }
            : { ...w, focused: false }
        )
      }
      const offset = prev.filter(w => !w.minimized).length
      return [
        ...prev.map(w => ({ ...w, focused: false })),
        {
          id: Date.now(),
          app: appName,
          x: 80 + offset * 28,
          y: 50 + offset * 24,
          minimized: false,
          focused: true,
        }
      ]
    })
  }, [])

  const closeWindow = useCallback((winId) => {
    setWindows(prev => prev.filter(w => w.id !== winId))
  }, [])

  const minimizeWindow = useCallback((winId) => {
    setWindows(prev => prev.map(w => w.id === winId ? { ...w, minimized: true, focused: false } : w))
  }, [])

  const focusWindow = useCallback((winId) => {
    setWindows(prev => prev.map(w => ({ ...w, focused: w.id === winId })))
  }, [])

  const moveWindow = useCallback((winId, x, y) => {
    setWindows(prev => prev.map(w => w.id === winId ? { ...w, x, y } : w))
  }, [])

  return (
    <main
      className='w-screen h-screen overflow-hidden relative'
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1672872476232-da16b45c9001?q=80&w=2071&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='absolute inset-0 bg-black/25' />

      <Clock />

      {windows.filter(w => !w.minimized).map(win => (
        <WindowFrame
          key={win.id}
          win={win}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
        />
      ))}

      <TaskBar
        currentProfile={currentProfile}
        onAppClick={openApp}
        openWindows={windows}
      />
    </main>
  )
}

export default OS