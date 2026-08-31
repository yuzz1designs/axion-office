import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import AxionLogo from "../ui/AxionLogo";
import { Sun, CloudRain } from "lucide-react";

interface WelcomeScreenProps {
  onEnter: () => void;
}

type WeatherType = "sunny" | "rainy";

interface WeatherConfig {
  name: string;
  maxTemp: string;
  currentTemp: string;
  imageUrl: string;
  fallbackGradient: string;
  overlayOpacity: number;
}

const WEATHER_MODES: Record<WeatherType, WeatherConfig> = {
  sunny: {
    name: "Sol",
    maxTemp: "28°C",
    currentTemp: "25°C",
    imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2560&auto=format&fit=crop",
    fallbackGradient: "from-amber-950/15 via-[#030712]/90 to-[#030712]",
    overlayOpacity: 0.55,
  },
  rainy: {
    name: "Chuva",
    maxTemp: "16°C",
    currentTemp: "13°C",
    imageUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=2560&auto=format&fit=crop",
    fallbackGradient: "from-blue-950/15 via-[#030712]/90 to-[#030712]",
    overlayOpacity: 0.65,
  },
};

const FLOATING_TRIANGLES = [
  // Left Side (dense)
  { id: 1, size: 24, x: 10, y: 15, speedX: -55, speedY: -45, opacity: 0.08, duration: 8, delay: 0 },
  { id: 2, size: 38, x: 22, y: 25, speedX: -45, speedY: -55, opacity: 0.05, duration: 12, delay: 1.5 },
  { id: 3, size: 16, x: 15, y: 75, speedX: -35, speedY: 55, opacity: 0.12, duration: 7, delay: 0.5 },
  { id: 4, size: 42, x: 28, y: 60, speedX: -40, speedY: 35, opacity: 0.06, duration: 14, delay: 2 },
  { id: 5, size: 28, x: 8, y: 45, speedX: -60, speedY: -30, opacity: 0.09, duration: 9, delay: 3 },
  { id: 6, size: 32, x: 25, y: 85, speedX: -50, speedY: 45, opacity: 0.07, duration: 13, delay: 1 },
  { id: 7, size: 20, x: 14, y: 55, speedX: -30, speedY: 60, opacity: 0.11, duration: 6, delay: 2.5 },
  
  // Right Side (lighter)
  { id: 8, size: 34, x: 88, y: 20, speedX: 60, speedY: -40, opacity: 0.06, duration: 11, delay: 0.8 },
  { id: 9, size: 22, x: 76, y: 15, speedX: 45, speedY: -35, opacity: 0.08, duration: 10, delay: 1.2 },
  { id: 10, size: 48, x: 82, y: 72, speedX: 55, speedY: 40, opacity: 0.04, duration: 15, delay: 3.5 },
  { id: 11, size: 18, x: 92, y: 85, speedX: 40, speedY: 65, opacity: 0.10, duration: 8, delay: 1.8 },
  { id: 12, size: 30, x: 74, y: 48, speedX: 50, speedY: 20, opacity: 0.07, duration: 12, delay: 2.2 },
];

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [logoExit, setLogoExit] = useState(false);
  const [weather, setWeather] = useState<WeatherType>("sunny");
  const [time, setTime] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  // Smooth mouse move parallax & tracking listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized relative position from -0.5 to 0.5 relative to center
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMouseOffset({ x, y });
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Live ticking clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Time in HH:MM:SS format
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);

      // Date string in Portuguese for premium AXION vibe
      const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
      const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
      const dayName = days[now.getDay()];
      const dayVal = now.getDate();
      const monthName = months[now.getMonth()];
      setDateStr(`${dayName}, ${dayVal} ${monthName}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      setLogoExit(true);
    }, 1000);
    setTimeout(() => {
      onEnter();
    }, 1900);
  };

  const currentConfig = WEATHER_MODES[weather];

  return (
    <div 
      id="welcome-screen-container" 
      className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col justify-between items-center py-12 px-6 z-50 select-none transition-all duration-1000 font-sans cursor-none"
    >
      {/* Dynamic Weather Background Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#050609]">
        {/* Elegant crossfading atmospheric background images */}
        <AnimatePresence mode="popLayout">
          <motion.img
            key={weather}
            src={currentConfig.imageUrl}
            alt={`AXION Background ${weather}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.35] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Ambient base gradient blend */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tr ${currentConfig.fallbackGradient} mix-blend-multiply opacity-80 transition-all duration-1000 ease-in-out z-[1]`} 
        />
        
        {/* Sophisticated Cinematic Glassmorphic Blur Overlays */}
        <div 
          className="absolute inset-0 bg-slate-950/50 transition-opacity duration-1000 z-[2] pointer-events-none"
          style={{ opacity: currentConfig.overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050609]/95 z-[2] pointer-events-none" />
        <div className="absolute inset-0 backdrop-blur-[0.5px] z-[2] pointer-events-none" />

        {/* Floating parallax triangles */}
        {FLOATING_TRIANGLES.map((item) => (
          <motion.div
            key={item.id}
            className="absolute pointer-events-none select-none z-[3] text-white"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: item.size,
              height: item.size,
              opacity: item.opacity * 6,
            }}
            animate={{
              x: mouseOffset.x * item.speedX,
              y: mouseOffset.y * item.speedY,
            }}
            transition={{
              type: "spring",
              stiffness: 45,
              damping: 25,
              mass: 0.8
            }}
          >
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 120, 360]
              }}
              transition={{
                y: {
                  duration: item.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                },
                rotate: {
                  duration: item.duration * 1.8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: item.delay,
                }
              }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {item.id % 2 === 0 ? (
                  <polygon 
                    points="50,15 90,85 10,85" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                  />
                ) : (
                  <polygon 
                    points="50,15 90,85 10,85" 
                    fill="currentColor" 
                    fillOpacity="0.1" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                  />
                )}
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Grid overlay for a technological digital aesthetic */}
      <div className="absolute inset-0 tech-grid opacity-[0.12] z-4 pointer-events-none" />

      {/* 1. TOP HEADER - METRICS & SECURITY STATUS */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 z-10 px-4 md:px-12 font-sans text-xs text-white/40"
          >
            {/* Core System Protocol */}
            <div className="flex items-center gap-2 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] pulse-active" />
              <span className="tracking-[0.25em] font-medium text-[10px]">AXION OFFICE</span>
            </div>

            {/* Live Weather Atmosphere Stats & Toggle Controls */}
            <div className="flex items-center gap-4 font-sans">
              {/* Weather Selector Capsules */}
              <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 backdrop-blur-md">
                <button
                  onClick={() => setWeather("sunny")}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] tracking-[0.15em] font-medium transition-all duration-300 ${
                    weather === "sunny"
                      ? "bg-white/15 text-white font-semibold shadow-sm"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <Sun size={11} className={weather === "sunny" ? "text-amber-400" : ""} />
                  SOL
                </button>
                <button
                  onClick={() => setWeather("rainy")}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] tracking-[0.15em] font-medium transition-all duration-300 ${
                    weather === "rainy"
                      ? "bg-white/15 text-white font-semibold shadow-sm"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <CloudRain size={11} className={weather === "rainy" ? "text-blue-400" : ""} />
                  CHUVA
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC ATMOSPHERIC INDEX (Floating Editorial Panel) */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 35, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute right-6 md:right-16 top-24 z-10 hidden md:block flex flex-col items-end gap-1 font-sans text-right"
          >
            <span className="text-[9px] text-white/30 tracking-[0.25em] font-medium uppercase">ATMOSPHERE INDEX</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-light text-white tracking-tighter">
                {currentConfig.currentTemp}
              </span>
              <span className="text-xs text-white/40">/ Max: {currentConfig.maxTemp}</span>
            </div>
            <span className="text-[9px] text-[#00f0ff] uppercase tracking-[0.2em] font-medium flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#00f0ff] animate-ping" />
              {currentConfig.name === "Sol" ? "CÉU LIMPO" : "PRECIPITAÇÃO ATIVA"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CENTER LOGO GROUP & REVEAL SYSTEM */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full px-4">
        <AnimatePresence mode="popLayout">
          {!logoExit ? (
            <motion.div
              key="logo-group"
              initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ 
                scale: 1.45, 
                opacity: 0,
                filter: "blur(20px)",
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
              }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="flex flex-col items-center gap-4 cursor-none"
            >
              {/* Dynamic AXION Logo (Uses uploaded assets with SVG fallback) */}
              <AxionLogo size="xl" animate={true} pulse={false} />
              
              {/* Elegant Metadata Container */}
              <div className="flex flex-col items-center gap-1 mt-1">
                <motion.div
                  initial={{ opacity: 0, letterSpacing: "0.2em" }}
                  animate={{ opacity: 0.45, letterSpacing: "0.55em" }}
                  transition={{ duration: 2, delay: 0.8 }}
                  className="font-sans text-xs md:text-sm text-white/80 font-light uppercase text-center ml-[0.55em]"
                >
                  OFFICE OPERATING SYSTEM
                </motion.div>
                
                {/* Mobile Atmospheric Info */}
                <AnimatePresence>
                  {!isExiting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      exit={{ opacity: 0, filter: "blur(5px)" }}
                      className="flex md:hidden items-center gap-2 font-sans text-[9px] text-white mt-1 tracking-wider"
                    >
                      <span>{currentConfig.currentTemp}</span>
                      <span>•</span>
                      <span>MAX: {currentConfig.maxTemp}</span>
                      <span>•</span>
                      <span>{currentConfig.name.toUpperCase()}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chrono Module Panel - Grouped tightly right below the logo */}
              <AnimatePresence>
                {!isExiting && (
                  <motion.div 
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, filter: "blur(10px)", height: 0, marginTop: 0, overflow: "hidden" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center font-sans text-center gap-1 mt-4"
                  >
                    {/* Live Realtime Clock */}
                    <span className="text-4xl md:text-5xl font-extralight tracking-[0.25em] text-white select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                      {time || "00:00:00"}
                    </span>
                    
                    {/* Date stamp */}
                    <span className="text-[10px] md:text-[11px] text-white/40 tracking-[0.3em] font-light uppercase mt-2">
                      {dateStr || "LOADING PROTOCOL"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button & Secure Indicators - Brought closer to the clock */}
              <AnimatePresence>
                {!isExiting && (
                  <motion.div 
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 35, filter: "blur(10px)", height: 0, marginTop: 0, overflow: "hidden" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center gap-6 mt-8 md:mt-10 w-full"
                  >
                    {/* Action Button - Premium Sleek Minimalist Pill with Central Hover Fill */}
                    <button
                      id="enter-office-btn"
                      onClick={handleEnterClick}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="group relative px-10 py-3.5 w-64 bg-white/5 backdrop-blur-md border border-white/20 hover:border-white text-white rounded-full font-sans text-[11px] tracking-[0.35em] uppercase font-medium active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center overflow-hidden"
                    >
                      {/* Clean background slide/fade fill transition */}
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
                      
                      {/* Subtle sheen sweep on hover */}
                      <span className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-black/5 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-1000 ease-in-out" />

                      {/* Button label */}
                      <span className="relative z-10 text-white/90 group-hover:text-slate-950 transition-colors duration-300 flex items-center justify-center">
                        ENTER OFFICE
                      </span>
                    </button>

                    {/* Restricted access indicator */}
                    <div className="flex flex-col items-center gap-1 text-center font-sans">
                      <span className="text-[9px] text-white/25 font-light tracking-[0.25em] uppercase">
                        AXION PROTOCOL ACCESS • LISBOA GATEWAY
                      </span>
                      <span className="text-[8px] text-white/10 font-light tracking-[0.25em]">
                        ALL ACTIVITIES REGISTERED • PROTOCOL V1.0.0
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Abstract geometric borders to frame the screen beautifully */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex justify-between pointer-events-none z-4"
          >
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-[1px] bg-gradient-to-b from-transparent via-white to-transparent left-12 md:left-24" 
            />
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
              className="w-[1px] bg-gradient-to-b from-transparent via-white to-transparent right-12 md:right-24" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Unified Cursor System - Keeps dot and ring perfectly aligned */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 26,
          mass: 0.1
        }}
      >
        {/* Outer Ring */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
          animate={{
            width: isHovering ? 28 : 22,
            height: isHovering ? 28 : 22,
            borderColor: isHovering ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.35)",
            backgroundColor: isHovering ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        
        {/* Precision inner core dot - Always perfectly centered */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"
        />
      </motion.div>
    </div>
  );
}
