import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useProfileContext } from "../context/ProfilesContext";
import { gsap } from "gsap";
import TaskBar from "../components/os/TaskBar";

const WALLPAPERS = [
  "https://images.unsplash.com/photo-1672872476232-da16b45c9001?w=1920&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1920&q=80",
];

const DEFAULT_SIZES = {
  calculator: { width: 600, height: 800 },
  terminal: { width: 780, height: 520 },
  // settings: { width: 560, height: 440 },
  notes: { width: 1000, height: 700 },
  browser: { width: 860, height: 600 },
  "code-editor": { width: 900, height: 620 },
  "tic-tac-toe": { width: 340, height: 460 },
  snake: { width: 420, height: 400 },
};

const CalculatorApp = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(false);

  const press = (val) => {
    if (typeof val === "number" || val === ".") {
      const next = fresh || display === "0" ? String(val) : display + val;
      setDisplay(next);
      setFresh(false);
    } else if (val === "C") {
      setDisplay("0");
      setPrev(null);
      setOp(null);
      setFresh(false);
    } else if (val === "=") {
      if (op && prev !== null) {
        const a = parseFloat(prev);
        const b = parseFloat(display);
        const result =
          op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;

        setDisplay(String(result));
        setPrev(null);
        setOp(null);
        setFresh(true);
      }
    } else {
      setPrev(display);
      setOp(val);
      setFresh(true);
    }
  };

  const btns = [
    "C",
    "/",
    "*",
    "-",
    7,
    8,
    9,
    "+",
    4,
    5,
    6,
    "=",
    1,
    2,
    3,
    0,
    ".",
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white p-2">
      <div className="bg-zinc-800 p-3 text-right text-2xl font-mono">
        {display}
      </div>

      <div className="grid grid-cols-4 gap-1 mt-2 flex-1">
        {btns.map((b, i) => (
          <button
            key={i}
            onClick={() => press(b)}
            className="bg-zinc-800 hover:bg-zinc-700 text-3xl py-2"
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
};

const TerminalApp = () => {
  const [lines, setLines] = useState([
    { type: "sys", text: "UniDesk" },
    { type: "sys", text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);

  const commands = {
    help: () => [
      "Commands: help, clear, echo [text], date, whoami, ls, pwd, uname, magic, funfact, authors",
    ],
    clear: () => {
      setLines([]);
      return [];
    },
    date: () => [new Date().toString()],
    whoami: () => [JSON.parse(localStorage.getItem("user")).name || "guest"],
    pwd: () => [
      `/home/${JSON.parse(localStorage.getItem("user")).name || "guest"}`,
    ],
    uname: () => ["UniBase wEbOs"],
    ls: () => ["Homework/ code/ stuff/ music/ games/ "],
    echo: (args) => [args.join(" ")],
    magic: () => ["Javan Gabru ka jism thatthe maar rha hai"],
    funfact: () => ["Samsoong is the best brand."],
    authors: () => ["Aksh, Tejaas and Homesh"],
  };

  const run = (cmd) => {
    const [name, ...args] = cmd.trim().split(" ");
    const result = commands[name]
      ? commands[name](args)
      : [`${name}: command not found`];
    if (result.length > 0)
      setLines((prev) => [
        ...prev,
        { type: "in", text: `$ ${cmd}` },
        ...result.map((t) => ({ type: "out", text: t })),
      ]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="flex flex-col h-full bg-black/95 text-green-400 font-mono text-xs p-3 gap-1">
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.type === "in"
                ? "text-green-300"
                : l.type === "sys"
                  ? "text-zinc-500"
                  : "text-green-400"
            }
          >
            {l.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-green-900/60 pt-2">
        <span className="text-green-600">$</span>
        <input
          autoFocus
          className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              run(input);
              setHistory((h) => [input, ...h]);
              setHistIdx(-1);
              setInput("");
            } else if (e.key === "ArrowUp") {
              const idx = Math.min(histIdx + 1, history.length - 1);
              setHistIdx(idx);
              setInput(history[idx] || "");
            } else if (e.key === "ArrowDown") {
              const idx = Math.max(histIdx - 1, -1);
              setHistIdx(idx);
              setInput(idx === -1 ? "" : history[idx]);
            }
          }}
        />
      </div>
    </div>
  );
};

const SettingsApp = ({ wallpaper, setWallpaper }) => {
  const [tab, setTab] = useState("appearance");
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(100);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const tabs = ["appearance", "sound", "system"];

  return (
    <div className="flex h-full bg-zinc-900/95 text-white text-sm">
      <div className="w-40 border-r border-white/10 flex flex-col pt-2 shrink-0 bg-black/20">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-left capitalize text-xs transition-colors
              ${tab === t ? "bg-white/10 text-white border-r-2 border-violet-500" : "text-zinc-400 hover:bg-white/5"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-5">
        {tab === "appearance" && (
          <>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
              Wallpaper
            </p>
            <div className="grid grid-cols-3 gap-2">
              {WALLPAPERS.map((w, i) => (
                <button
                  key={i}
                  onClick={() => setWallpaper(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all hover:scale-105 focus:outline-none
                  ${wallpaper === i ? "border-violet-500 shadow-lg shadow-violet-500/30" : "border-white/10 hover:border-white/30"}`}
                >
                  <img
                    src={w.replace("w=1920", "w=300")}
                    alt=""
                    className="w-full h-16 object-cover block"
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-300">Dark Mode</span>
              <button
                onClick={() => setDarkMode((d) => !d)}
                className={`w-10 h-5 rounded-full transition-colors relative ${darkMode ? "bg-violet-600" : "bg-zinc-600"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${darkMode ? "left-5" : "left-0.5"}`}
                />
              </button>
            </div>
          </>
        )}

        {tab === "sound" && (
          <>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
              Volume
            </p>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-xs">0</span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 accent-violet-500"
              />
              <span className="text-zinc-300 text-xs w-6">{volume}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-300">Notifications</span>
              <button
                onClick={() => setNotifications((n) => !n)}
                className={`w-10 h-5 rounded-full transition-colors relative ${notifications ? "bg-violet-600" : "bg-zinc-600"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${notifications ? "left-5" : "left-0.5"}`}
                />
              </button>
            </div>
          </>
        )}

        {tab === "system" && (
          <>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
              Display
            </p>
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-xs w-16">Brightness</span>
              <input
                type="range"
                min={20}
                max={100}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="flex-1 accent-violet-500"
              />
              <span className="text-zinc-300 text-xs w-8">{brightness}%</span>
            </div>
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-xs text-zinc-400 border border-white/5">
              {[
                ["OS", "UniDesk"],
                ["Build", "Javaan Gabru"],
                ["Kernel", "Jism"],
                ["RAM", "32 mkb"],
                ["CPU", "imtel core i17 (16) @ 2.0 mhz"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span>{k}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const NotesApp = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: "Welcome", body: "Start typing your notes here..." },
  ]);
  const [active, setActive] = useState(1);
  const current = notes.find((n) => n.id === active);
  const update = (field, val) =>
    setNotes((prev) =>
      prev.map((n) => (n.id === active ? { ...n, [field]: val } : n)),
    );
  const newNote = () => {
    const id = Date.now();
    setNotes((prev) => [...prev, { id, title: "Untitled", body: "" }]);
    setActive(id);
  };
  const deleteNote = (id) => {
    const r = notes.filter((n) => n.id !== id);
    setNotes(r);
    setActive(r[0]?.id || null);
  };

  return (
    <div className="flex h-full bg-zinc-900/95 text-white">
      <div className="w-44 border-r border-white/10 flex flex-col shrink-0">
        <button
          onClick={newNote}
          className="text-xs py-2.5 px-3 bg-violet-700/80 hover:bg-violet-600 transition-colors shrink-0 border-b border-white/5"
        >
          + New Note
        </button>
        <div className="flex-1 overflow-y-auto">
          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`group px-3 py-2 text-xs cursor-pointer border-b border-white/5 flex justify-between items-center
                ${active === n.id ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <span className="truncate flex-1">{n.title || "Untitled"}</span>
              {notes.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(n.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 ml-1 text-xs"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <input
          className="bg-transparent border-b border-white/10 px-4 py-2.5 text-sm font-semibold outline-none placeholder-zinc-600"
          value={current?.title || ""}
          placeholder="Title"
          onChange={(e) => update("title", e.target.value)}
        />
        <textarea
          className="flex-1 bg-transparent px-4 py-3 text-sm text-zinc-300 outline-none resize-none font-mono placeholder-zinc-700"
          value={current?.body || ""}
          placeholder="Write something..."
          onChange={(e) => update("body", e.target.value)}
        />
      </div>
    </div>
  );
};

const BrowserApp = () => {
  const [url, setUrl] = useState("https://example.com");
  const [loaded, setLoaded] = useState("https://example.com");
  const [loading, setLoading] = useState(false);
  const go = () => {
    let t = url;
    if (!t.startsWith("http")) t = "https://" + t;
    setLoaded(t);
    setLoading(true);
  };
  return (
    <div className="flex flex-col h-full bg-zinc-900/95">
      <div className="flex items-center gap-2 px-3 py-2 bg-black/20 border-b border-white/10">
        <input
          className="flex-1 bg-white/10 text-white text-xs px-3 py-1.5 rounded-lg outline-none border border-white/10 focus:border-violet-500/50 transition-colors"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
        />
        <button
          onClick={go}
          className="text-xs bg-violet-700 hover:bg-violet-600 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          Go
        </button>
      </div>
      {loading && <div className="h-0.5 bg-violet-500 animate-pulse" />}
      <iframe
        src={loaded}
        className="flex-1 w-full border-0"
        title="browser"
        sandbox="allow-scripts allow-same-origin allow-forms"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const CodeEditorApp = () => {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "main.py",
      lang: "python",
      content: '# Hello from RoboOS\nprint("Hello, world!")',
    },
    {
      id: 2,
      name: "index.js",
      lang: "javascript",
      content: '// RoboOS Script\nconsole.log("Hello!")',
    },
  ]);
  const [active, setActive] = useState(1);
  const current = files.find((f) => f.id === active);
  const update = (content) =>
    setFiles((prev) =>
      prev.map((f) => (f.id === active ? { ...f, content } : f)),
    );
  const newFile = () => {
    const id = Date.now();
    setFiles((prev) => [
      ...prev,
      { id, name: `file${prev.length + 1}.txt`, lang: "text", content: "" },
    ]);
    setActive(id);
  };
  const lineCount = (current?.content || "").split("\n").length;

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white font-mono text-xs">
      <div className="flex items-center bg-black/40 border-b border-white/10 overflow-x-auto shrink-0">
        {files.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`px-4 py-2 text-xs shrink-0 border-r border-white/10 transition-colors
              ${active === f.id ? "bg-zinc-950 text-white border-b-2 border-b-violet-500" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
          >
            {f.name}
          </button>
        ))}
        <button
          onClick={newFile}
          className="px-3 py-2 text-zinc-500 hover:text-white"
        >
          +
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-8 bg-black/20 text-zinc-600 text-right pr-2 pt-2 select-none overflow-hidden shrink-0 leading-5">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          className="flex-1 bg-transparent text-green-300 outline-none resize-none p-2 leading-5 caret-green-400"
          value={current?.content || ""}
          onChange={(e) => update(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div
        className="h-5 bg-violet-900/30 border-t border-white/10 px-3 flex items-center gap-4 text-zinc-400 shrink-0"
        style={{ fontSize: 10 }}
      >
        <span>{current?.lang}</span>
        <span>Ln {lineCount}</span>
        <span>RoboOS Editor</span>
      </div>
    </div>
  );
};

const TicTacToeApp = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const winner = (() => {
    for (const [a, b, c] of lines)
      if (board[a] && board[a] === board[b] && board[a] === board[c])
        return board[a];
    return board.every(Boolean) ? "Draw" : null;
  })();
  const click = (i) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = xTurn ? "X" : "O";
    setBoard(next);
    setXTurn((t) => !t);
    for (const [a, b, c] of lines)
      if (next[a] && next[a] === next[b] && next[a] === next[c])
        return setScores((s) => ({ ...s, [next[a]]: s[next[a]] + 1 }));
  };
  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900/95 gap-4">
      <div className="flex gap-8 text-white">
        <div className="text-center">
          <div className="text-3xl font-bold text-violet-400">{scores.X}</div>
          <div className="text-zinc-400 text-xs mt-1">Player X</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-400">{scores.O}</div>
          <div className="text-zinc-400 text-xs mt-1">Player O</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className="w-20 h-20 bg-white/10 hover:bg-white/15 rounded-xl text-3xl font-bold transition-all active:scale-95 flex items-center justify-center border border-white/10"
          >
            <span
              className={cell === "X" ? "text-violet-400" : "text-pink-400"}
            >
              {cell}
            </span>
          </button>
        ))}
      </div>
      <div className="text-sm text-zinc-300 h-5">
        {winner
          ? winner === "Draw"
            ? "It's a draw!"
            : `${winner} wins!`
          : `${xTurn ? "X" : "O"}'s turn`}
      </div>
      <button
        onClick={() => {
          setBoard(Array(9).fill(null));
          setXTurn(true);
        }}
        className="text-xs px-5 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors border border-white/10"
      >
        New Game
      </button>
    </div>
  );
};

const SnakeApp = () => {
  const COLS = 20,
    ROWS = 15,
    CELL = 18;
  const [snake, setSnake] = useState([
    [10, 7],
    [9, 7],
    [8, 7],
  ]);
  const [food, setFood] = useState([15, 7]);
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const dirRef = useRef([1, 0]);
  const snakeRef = useRef([
    [10, 7],
    [9, 7],
    [8, 7],
  ]);
  const foodRef = useRef([15, 7]);
  const randFood = (s) => {
    let f;
    do {
      f = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)];
    } while (s.some(([x, y]) => x === f[0] && y === f[1]));
    return f;
  };
  useEffect(() => {
    const h = (e) => {
      const m = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };
      if (m[e.key]) {
        e.preventDefault();
        const [dx, dy] = m[e.key],
          [cx, cy] = dirRef.current;
        if (dx !== -cx || dy !== -cy) dirRef.current = [dx, dy];
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const [dx, dy] = dirRef.current,
        [hx, hy] = snakeRef.current[0],
        nx = hx + dx,
        ny = hy + dy;
      if (
        nx < 0 ||
        nx >= COLS ||
        ny < 0 ||
        ny >= ROWS ||
        snakeRef.current.some(([x, y]) => x === nx && y === ny)
      ) {
        setDead(true);
        setRunning(false);
        return;
      }
      const ate = nx === foodRef.current[0] && ny === foodRef.current[1];
      const next = [
        [nx, ny],
        ...snakeRef.current.slice(0, ate ? undefined : -1),
      ];
      snakeRef.current = next;
      setSnake([...next]);
      if (ate) {
        const nf = randFood(next);
        foodRef.current = nf;
        setFood(nf);
        setScore((s) => s + 1);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [running]);
  const start = () => {
    const init = [
      [10, 7],
      [9, 7],
      [8, 7],
    ];
    snakeRef.current = init;
    dirRef.current = [1, 0];
    const nf = randFood(init);
    foodRef.current = nf;
    setSnake(init);
    setFood(nf);
    setDead(false);
    setScore(0);
    setRunning(true);
  };
  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-900/95 gap-3">
      <div className="flex items-center justify-between w-full px-6">
        <span className="text-zinc-400 text-xs">
          Score: <span className="text-white font-bold">{score}</span>
        </span>
        <button
          onClick={running ? () => setRunning(false) : start}
          className="text-xs px-3 py-1.5 bg-violet-700 hover:bg-violet-600 text-white rounded-lg transition-colors"
        >
          {running ? "Pause" : dead ? "Restart" : "Start"}
        </button>
      </div>
      <div
        className="relative border border-white/10 bg-black/60 rounded-xl overflow-hidden"
        style={{ width: COLS * CELL, height: ROWS * CELL }}
      >
        {snake.map(([x, y], i) => (
          <div
            key={i}
            className={`absolute rounded-sm ${i === 0 ? "bg-violet-400" : "bg-violet-600/80"}`}
            style={{
              left: x * CELL + 1,
              top: y * CELL + 1,
              width: CELL - 2,
              height: CELL - 2,
            }}
          />
        ))}
        <div
          className="absolute bg-red-400 rounded-full"
          style={{
            left: food[0] * CELL + 2,
            top: food[1] * CELL + 2,
            width: CELL - 4,
            height: CELL - 4,
          }}
        />
        {!running && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm flex-col gap-1">
            <span className="text-white text-sm font-medium">
              {dead ? "Game Over" : "Snake"}
            </span>
            {dead && (
              <span className="text-violet-400 text-xs">Score: {score}</span>
            )}
          </div>
        )}
      </div>
      <div className="text-zinc-600 text-xs">Arrow keys to move</div>
    </div>
  );
};

// const makeSettingsComponent = (wallpaper, setWallpaper) => {
//   const Comp = (props) => (
//     <SettingsApp wallpaper={wallpaper} setWallpaper={setWallpaper} {...props} />
//   );
//   Comp.displayName = "SettingsWrapper";
//   return Comp;
// };

const APP_REGISTRY = {
  calculator: CalculatorApp,
  terminal: TerminalApp,
  notes: NotesApp,
  browser: BrowserApp,
  "code-editor": CodeEditorApp,
  "tic-tac-toe": TicTacToeApp,
  snake: SnakeApp,
};

const WindowFrame = ({
  win,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  onResize,
  onToggleMaximize,
  wallpaper,
  setWallpaper,
}) => {
  const ref = useRef(null);
  const drag = useRef(false);
  const resizeDir = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const AppComponent =
    win.app === "settings"
      ? () => <SettingsApp wallpaper={wallpaper} setWallpaper={setWallpaper} />
      : APP_REGISTRY[win.app];

  const onMouseDown = (e) => {
    if (e.target.closest(".resize-handle")) return;
    drag.current = true;
    const rect = ref.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    onFocus(win.id);
  };

  const startResize = (dir) => (e) => {
    e.stopPropagation();
    resizeDir.current = dir;
  };

  useEffect(() => {
    const move = (e) => {
      if (drag.current && !win.maximized) {
        const x = e.clientX - offset.current.x;
        const y = e.clientY - offset.current.y;
        onMove(win.id, x, y);
      }

      if (resizeDir.current && !win.maximized) {
        const rect = ref.current.getBoundingClientRect();

        let newW = rect.width;
        let newH = rect.height;
        let newX = rect.left;
        let newY = rect.top;

        if (resizeDir.current.includes("right")) newW = e.clientX - rect.left;

        if (resizeDir.current.includes("bottom")) newH = e.clientY - rect.top;

        if (resizeDir.current.includes("left")) {
          newW = rect.right - e.clientX;
          newX = e.clientX;
        }

        if (resizeDir.current.includes("top")) {
          newH = rect.bottom - e.clientY;
          newY = e.clientY;
        }

        onResize(win.id, {
          width: Math.max(300, newW),
          height: Math.max(200, newH),
          x: newX,
          y: newY,
        });
      }
    };

    const up = () => {
      drag.current = false;
      resizeDir.current = null;
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [win]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: win.maximized ? 0 : win.x,
        top: win.maximized ? 0 : win.y,
        width: win.maximized ? "100%" : win.width,
        height: win.maximized ? "100%" : win.height,
        zIndex: win.focused ? 10 : 1,
      }}
      className="flex flex-col bg-zinc-900 border border-zinc-700"
      onMouseDown={() => onFocus(win.id)}
    >
      <div
        className="flex items-center justify-between px-2 py-1 bg-zinc-800 cursor-move"
        onMouseDown={onMouseDown}
      >
        <span className="text-white text-sm">{win.app}</span>

        <div className="flex gap-2">
          <button onClick={() => onMinimize(win.id)}>—</button>
          <button onClick={() => onToggleMaximize(win.id)}>
            {win.maximized ? "🗗" : "🗖"}
          </button>
          <button onClick={() => onClose(win.id)}>✕</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {AppComponent && <AppComponent />}
      </div>

      {[
        "top",
        "right",
        "bottom",
        "left",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ].map((dir) => (
        <div
          key={dir}
          onMouseDown={startResize(dir)}
          className={`resize-handle absolute ${
            dir.includes("top") ? "top-0" : ""
          } ${dir.includes("bottom") ? "bottom-0" : ""}
            ${dir.includes("left") ? "left-0" : ""}
            ${dir.includes("right") ? "right-0" : ""}
          `}
          style={{
            width: dir.includes("left") || dir.includes("right") ? 6 : "100%",
            height: dir.includes("top") || dir.includes("bottom") ? 6 : "100%",
            cursor: `${dir}-resize`,
            zIndex: 20,
          }}
        />
      ))}
    </div>
  );
};

const OS = () => {
  const { id } = useParams();
  const { profiles } = useProfileContext();

  const [currentProfile, setCurrentProfile] = useState({});
  const [windows, setWindows] = useState([]);
  const [wallpaper, setWallpaper] = useState(0);

  useEffect(() => {
    const found = profiles.find((p) => p.id === parseInt(id));
    if (found) setCurrentProfile(found);
  }, [id, profiles]);

  const openApp = useCallback((appName) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.app === appName);

      if (existing) {
        return prev.map((w) =>
          w.id === existing.id
            ? { ...w, minimized: false, focused: true }
            : { ...w, focused: false },
        );
      }

      const offset = prev.filter((w) => !w.minimized).length;

      return [
        ...prev.map((w) => ({ ...w, focused: false })),
        {
          id: Date.now(),
          app: appName,
          x: 80 + offset * 28,
          y: 50 + offset * 24,
          width: DEFAULT_SIZES[appName]?.width || 500,
          height: DEFAULT_SIZES[appName]?.height || 400,
          minimized: false,
          maximized: false,
          focused: true,
        },
      ];
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: true, focused: false } : w,
      ),
    );
  }, []);

  const focusWindow = useCallback((id) => {
    setWindows((prev) => prev.map((w) => ({ ...w, focused: w.id === id })));
  }, []);

  const moveWindow = useCallback((id, x, y) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id && !w.maximized ? { ...w, x, y } : w)),
    );
  }, []);

  const resizeWindow = useCallback((id, data) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id && !w.maximized ? { ...w, ...data } : w)),
    );
  }, []);

  const toggleMaximize = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    );
  }, []);

  return (
    <main
      className="w-screen h-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${WALLPAPERS[wallpaper]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.4s ease",
      }}
    >
      <div className="absolute inset-0 bg-black/20" />

      {/* <Clock /> */}

      {windows
        .filter((w) => !w.minimized)
        .map((win) => (
          <WindowFrame
            key={win.id}
            win={win}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            onMove={moveWindow}
            onResize={resizeWindow}
            onToggleMaximize={toggleMaximize}
            wallpaper={wallpaper}
            setWallpaper={setWallpaper}
          />
        ))}

      <TaskBar
        currentProfile={currentProfile}
        onAppClick={openApp}
        openWindows={windows}
      />
    </main>
  );
};

export default OS;
