import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { apps } from "../../data";

const TaskBar = ({ currentProfile, onAppClick, openWindows }) => {
  const [relevantApps, setRelevantApps] = useState([]);
  const [hoveredApp, setHoveredApp] = useState(null);
  const [time, setTime] = useState(new Date());
  const barRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    setRelevantApps(
      apps.filter((app) => currentProfile.apps?.includes(app.name)),
    );
    animatedRef.current = false;
  }, [currentProfile]);

  useEffect(() => {
    if (barRef.current && relevantApps.length > 0 && !animatedRef.current) {
      animatedRef.current = true;
      gsap.fromTo(
        Array.from(barRef.current.querySelectorAll(".taskbar-item")),
        { y: 40, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.06,
          duration: 0.5,
          ease: "back.out(1.6)",
          delay: 0.1,
        },
      );
    }
  }, [relevantApps]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');`}</style>

      <div className="absolute bottom-0 left-0 w-full" style={{ zIndex: 200 }}>
        <div
          ref={barRef}
          className="flex items-center justify-between w-full
            px-4 py-2
            backdrop-blur-xl bg-white/20 border border-white/50
            shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(0,0,0,0.1)]"
        >
          {/* <div className="flex items-center gap-2 taskbar-item">
            <button
              className="flex items-center gap-1.5 px-3 h-12 rounded-2xl
                bg-white/30 border border-white/60
                shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.15),inset_1px_1px_0_rgba(255,255,255,0.8)]
                hover:bg-white/40
                active:shadow-[inset_1px_1px_0_rgba(0,0,0,0.2),inset_-1px_-1px_0_rgba(255,255,255,0.5)]
                transition-all duration-100 cursor-pointer"
            >
              <img
                src="https://win98icons.alexmeub.com/icons/png/windows_flag-0.png"
                alt="Start"
                className="w-5 h-5 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <span
                style={{ fontFamily: "'VT323', monospace", fontSize: "20px" }}
                className="text-gray-800 font-bold tracking-wide leading-none"
              >
                Start
              </span>
            </button>
          </div> */}

          <div className="flex items-end gap-2 flex-1 justify-center">
            {relevantApps.map((app) => {
              const isOpen = openWindows.some(
                (w) => w.app === app.name && !w.minimized,
              );
              const isMin = openWindows.some(
                (w) => w.app === app.name && w.minimized,
              );

              return (
                <div
                  key={app.name}
                  className="relative flex flex-col items-center gap-1 taskbar-item"
                  onMouseEnter={() => setHoveredApp(app.name)}
                  onMouseLeave={() => setHoveredApp(null)}
                >
                  {hoveredApp === app.name && (
                    <div
                      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2
                        px-2 py-0.5 rounded-lg whitespace-nowrap text-gray-900
                        bg-white/80 backdrop-blur-md border border-white/70
                        shadow-[2px_2px_6px_rgba(0,0,0,0.2)]
                        pointer-events-none"
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: "16px",
                      }}
                    >
                      {app.name}
                    </div>
                  )}

                  <button
                    onClick={() => onAppClick(app.name)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center
                      transition-all duration-150 border
                      hover:-translate-y-1.5 hover:scale-125 active:scale-95 active:translate-y-0
                      ${
                        isOpen
                          ? "bg-black/10 border-white/30 shadow-[inset_1px_1px_0_rgba(0,0,0,0.2),inset_-1px_-1px_0_rgba(255,255,255,0.5)]"
                          : "bg-transparent border-transparent hover:bg-white/25 hover:border-white/50"
                      }`}
                  >
                    <img
                      src={app.icon}
                      alt={app.name}
                      className="w-9 h-9 object-contain drop-shadow"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </button>

                  <div
                    className={`w-1 h-1 rounded-full transition-all duration-200 ${
                      isOpen
                        ? "bg-white shadow-[0_0_4px_rgba(255,255,255,0.9)]"
                        : isMin
                          ? "bg-white/40"
                          : "bg-transparent"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* <div className="flex items-center gap-2 taskbar-item">
            <div
              className="flex flex-col items-center justify-center px-3 h-12 rounded-2xl min-w-[64px]
                bg-black/10 border border-white/20
                shadow-[inset_1px_1px_0_rgba(0,0,0,0.18),inset_-1px_-1px_0_rgba(255,255,255,0.55)]"
            >
              <span
                className="text-gray-900 leading-none"
                style={{ fontFamily: "'VT323', monospace", fontSize: "22px" }}
              >
                {fmt(time)}
              </span>
              <span
                className="text-gray-600 leading-none"
                style={{ fontFamily: "'VT323', monospace", fontSize: "13px" }}
              >
                {time.toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default TaskBar;
