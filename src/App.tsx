// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Components ---

// 1. Intro Animation with 3D Wireframe Globe & Expanding Golden Dot
const IntroAnimation = ({ onComplete }) => {
  const [bootText, setBootText] = useState([]);
  const [progress, setProgress] = useState(0);
  const [matrixLines, setMatrixLines] = useState([]);

  useEffect(() => {
    // Generate random background matrix numbers
    const lines = Array.from({ length: 15 }).map(() => {
      return Array.from({ length: 20 }).map(() => Math.random().toString(16).substring(2, 8).toUpperCase()).join(" ");
    });
    setMatrixLines(lines);

    const logs = [
      "INITIALIZING QUANTUM KERNEL...",
      "LOADING NEURAL PATHWAYS [████████--] 80%",
      "ESTABLISHING SECURE CONNECTION TO SATELLITE 7...",
      "FETCHING PORTFOLIO ASSETS FROM DEEP STORAGE...",
      "CALIBRATING 3D ENVIRONMENT GEOMETRY...",
      "IGNITING SUPERNOVA CORE ENGINE...",
      "SYSTEM FULLY OPERATIONAL. STANDBY FOR JUMP."
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        setBootText(prev => [...prev, logs[step]]);
        setProgress(Math.floor(((step + 1) / logs.length) * 100));
        step++;
      } else {
        clearInterval(interval);
      }
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] overflow-hidden font-mono selection:bg-transparent"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* 1. Matrix Background */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-[0.03] pointer-events-none z-0">
        {matrixLines.map((line, i) => (
          <motion.div 
            key={i} 
            className="text-[#38BDF8] text-[10px] tracking-[0.5em] whitespace-nowrap"
            initial={{ x: i % 2 === 0 ? "100%" : "-100%" }}
            animate={{ x: i % 2 === 0 ? "-10%" : "10%" }}
            transition={{ duration: 25 + i * 2, repeat: Infinity, ease: "linear" }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* 2. Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #1E3A8A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* 3. Boot sequence logs - Top Left */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 text-[10px] sm:text-xs text-[#38BDF8] opacity-80 tracking-widest leading-loose pointer-events-none z-20">
        {bootText.map((text, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[#FFD700] mr-2">{`[${(i * 0.154).toFixed(3)}]`}</span> {`> ${text}`}
          </motion.div>
        ))}
        {progress < 100 && (
          <motion.div animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="mt-2 text-[#FFD700]">
            _
          </motion.div>
        )}
      </div>

      {/* 4. Central 3D Assembly (Armillary Sphere + Earth) */}
      <div style={{ perspective: '1500px' }} className="relative z-10 w-[280px] h-[280px] flex items-center justify-center mt-10 md:mt-0">
        
        {/* Outer Ring 1 - Fast */}
        <motion.div
          className="absolute w-[160%] h-[160%] rounded-full border-[1px] border-[#38BDF8]/40 border-t-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateX: 360, rotateY: -180, rotateZ: 360 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        />
        {/* Outer Ring 2 - Slow */}
        <motion.div
          className="absolute w-[135%] h-[135%] rounded-full border-[2px] border-[#1E3A8A]/60 border-b-[#FFD700] border-r-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateX: -360, rotateY: 360, rotateZ: -180 }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
        />
        {/* Inner Ring 3 - Dotted */}
        <motion.div
          className="absolute w-[115%] h-[115%] rounded-full border-[2px] border-dashed border-[#38BDF8]/50"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateX: 180, rotateY: -360, rotateZ: 180 }}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        />

        {/* The Earth Sphere */}
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: 360, rotateX: 20 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        >
          {/* Earth Meridians (Dark Blue) */}
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <div 
              key={`v-${deg}`} 
              className="absolute inset-0 rounded-full border-[3px] border-[#1E3A8A] shadow-[0_0_20px_#1E3A8A]" 
              style={{ transform: `rotateY(${deg}deg)` }} 
            />
          ))}
          {/* Earth Parallels */}
          {[-121, -90, -48, 0, 48, 90, 121].map((translate) => {
            const scale = Math.sqrt(1 - Math.pow(translate / 140, 2));
            return (
              <div 
                key={`h-${translate}`} 
                className="absolute inset-0 rounded-full border-[3px] border-[#1E3A8A] shadow-[0_0_20px_#1E3A8A]" 
                style={{ transform: `rotateX(90deg) translateZ(${translate}px) scale(${scale})` }} 
              />
            );
          })}

          {/* The Golden Singularity (Pulses, then disappears at climax) */}
          <motion.div
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{ 
              width: 24, height: 24, 
              background: 'radial-gradient(circle, #FFFFFF 0%, #FFD700 40%, #FFA500 100%)', 
              boxShadow: '0 0 50px #FFD700, 0 0 100px #FFA500',
            }}
            initial={{ x: "-50%", y: "-50%", z: 140, scale: 0, opacity: 0 }}
            animate={{ x: "-50%", y: "-50%", z: 140, scale: [0, 1, 2, 0, 0], opacity: [0, 1, 1, 0, 0] }}
            transition={{ times: [0, 0.1, 0.75, 0.85, 1], duration: 4.8, ease: "easeInOut" }}
          >
             {/* Pulse Rings */}
             <motion.div 
               className="absolute inset-0 rounded-full border-2 border-white/80"
               animate={{ scale: [1, 6], opacity: [1, 0] }}
               transition={{ duration: 1.2, repeat: 3, delay: 0.5 }}
             />
             <motion.div 
               className="absolute inset-0 rounded-full border-2 border-[#FFD700]/80"
               animate={{ scale: [1, 4], opacity: [1, 0] }}
               transition={{ duration: 1, repeat: 3, delay: 0.8 }}
             />
          </motion.div>
        </motion.div>
      </div>

      {/* 5. Cyberpunk Progress Bar - Bottom Center */}
      <div className="absolute bottom-16 w-full max-w-md px-8 z-20 flex flex-col items-center">
        <div className="w-full flex justify-between text-[#38BDF8] text-[10px] tracking-[0.3em] mb-3">
          <span>SYSTEM_BOOT</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-[#1E3A8A]/30 relative overflow-hidden flex">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#38BDF8] to-[#FFD700] shadow-[0_0_15px_#FFD700]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 6. Light Gathering Implosion (金光從四面八方聚集) */}
      <motion.div
        className="fixed top-1/2 left-1/2 pointer-events-none z-40 rounded-full mix-blend-screen"
        style={{ 
          width: "150vw", height: "150vw", 
          x: "-50%", y: "-50%", 
          border: '10vw solid rgba(255, 215, 0, 0.8)',
          boxShadow: 'inset 0 0 100px #FFD700, 0 0 100px #FFD700',
        }}
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: [2, 2, 0, 0], opacity: [0, 1, 1, 0] }}
        transition={{ times: [0, 0.6, 0.85, 1], duration: 4.5, ease: "easeIn" }}
      />

      {/* 7. Supernova Shockwave (向外爆發擴散的精純光芒) */}
      <motion.div
        className="fixed top-1/2 left-1/2 pointer-events-none z-50 rounded-full mix-blend-screen"
        style={{
          width: "300vw", height: "300vw",
          x: "-50%", y: "-50%",
          background: 'radial-gradient(circle, #FFFFFF 0%, #FFD700 20%, #FFA500 40%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        // 停留在 scale 1 (即佔滿螢幕) 與 opacity 1
        animate={{ scale: [0, 0, 1, 1], opacity: [0, 0, 1, 1] }}
        transition={{ times: [0, 0.85, 0.95, 1], duration: 4.5, ease: "easeOut" }}
      />

      {/* 8. Backup Fullscreen Flash (絕對白金化，覆蓋整個螢幕直到動畫結束) */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[60]"
        style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #FFD700 100%)' }}
        initial={{ opacity: 0 }}
        // 停留在 opacity 1，直到外層元件觸發 exit 淡出
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ times: [0, 0.86, 0.95, 1], duration: 4.5, ease: "easeOut" }}
        onAnimationComplete={() => onComplete()}
      />
    </motion.div>
  );
};

// 2. Home Navigation View (Grid)
const HomeView = ({ onSelectProject, lang, ui }) => {
  const projects = [
    {
      id: "guitar-advisor",
      title: ui.projectTitle[lang],
      type: "Interactive Tool / Web App",
      desc: ui.projectDesc[lang]
    }
    // Future projects can be added here
  ];

  return (
    <motion.div 
      className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 pt-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-serif mb-12 opacity-90">{lang === 'zh' ? '專案導覽' : 'Project Directory'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj) => (
          <motion.div 
            key={proj.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectProject(proj.id)}
            className="cursor-pointer border p-8 rounded-xl flex flex-col justify-between min-h-[250px] transition-colors border-white/10 hover:border-[#C5A059]/50 bg-white/5 hover:bg-white/10 group shadow-lg"
          >
            <div>
              <div className="text-[10px] font-sans tracking-widest uppercase opacity-50 mb-4 group-hover:text-[#C5A059] transition-colors">
                {proj.type}
              </div>
              <h3 className="text-2xl font-serif mb-4">{proj.title}</h3>
              <p className="text-sm font-serif opacity-70 leading-relaxed">
                {proj.desc}
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <span className="text-xs font-sans tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity text-[#C5A059]">
                View Details &rarr;
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// 3. Detail View
const DetailView = ({ lang, ui, onBack, theme }) => {
  const [demoFinished, setDemoFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDemoFinished(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="flex-1 w-full flex flex-col md:flex-row relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Panel: Introduction */}
      <div className={`w-full md:w-1/3 p-6 md:p-12 flex flex-col justify-center md:border-r z-20 gap-8 ${theme === "light" ? "border-museum-border/30" : "border-white/10"}`}>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <button 
            onClick={onBack}
            className="mb-12 text-xs font-sans tracking-widest uppercase flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            &larr; {lang === 'zh' ? '返回導覽' : 'Back to Directory'}
          </button>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">{ui.projectTitle[lang]}</h1>
          <p className="font-serif italic text-xl opacity-90 mb-12 leading-relaxed">
            {ui.projectDesc[lang]}
          </p>
          
          {/* Explicit Dedicated Enter Button */}
          <a 
            href="https://brian53013new.github.io/Guitar-Chord-Master/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-block text-center text-sm font-sans font-bold tracking-[0.2em] uppercase px-8 py-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(197,160,89,0.3)] ${
              theme === "light" ? "bg-[#333] text-white hover:bg-black" : "bg-gradient-to-r from-[#C5A059] to-[#E5C079] text-black hover:scale-105"
            }`}
          >
            {ui.visitSite[lang]} ↗
          </a>
        </motion.div>
      </div>

      {/* Right Panel: Interactive iframe demo */}
      <div className={`w-full md:w-2/3 relative flex flex-col p-6 md:p-12 min-h-[500px] ${theme === "light" ? "bg-[#F4F1EA]" : "bg-[#1A1A1A]"}`}>
        <motion.div
          className="w-full h-full rounded-2xl overflow-hidden border shadow-2xl relative bg-black flex items-center justify-center"
          style={{ borderColor: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <iframe 
            src="https://brian53013new.github.io/Guitar-Chord-Master/" 
            title="Guitar Chord Master Demo"
            className={`w-full h-full border-0 transition-opacity duration-1000 ${demoFinished ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
          />
          
          <div className="absolute top-0 left-0 w-full p-4 pointer-events-none z-10 flex justify-between items-center">
            <span className="text-xs font-sans font-bold tracking-[0.3em] uppercase bg-black/60 text-white px-3 py-1 rounded backdrop-blur-sm">
              {ui.demo[lang]}
            </span>
            {!demoFinished && (
              <span className="text-[10px] font-sans tracking-widest uppercase bg-white/10 text-white px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                10s Limit
              </span>
            )}
          </div>

          {/* Time Up Overlay */}
          <AnimatePresence>
            {demoFinished && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <div className="text-sm font-sans tracking-[0.2em] uppercase text-white/80 bg-black/60 border border-white/10 px-8 py-4 rounded-full backdrop-blur-md text-center">
                  {lang === 'zh' ? '體驗時間結束' : 'Preview Ended'}<br/>
                  <span className="text-[10px] opacity-70 mt-1 block">
                    {lang === 'zh' ? '請點擊左側專屬按鈕前往完整網站' : 'Click the button on the left to visit the full site'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Main Page ---
export default function Home() {
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "detail">("home");

  const ui = {
    title: { en: "Portfolio Navigation", zh: "作品集導覽" },
    projectTitle: { en: "Guitar Advisor", zh: "吉他顧問 (Guitar Chord Master)" },
    projectDesc: { 
      en: "A comprehensive tool for guitarists to explore chords and scales across the fretboard. Experiment with different voicings, modes, and find instant auditory feedback.", 
      zh: "專為吉他手設計的全方位互動工具，協助探索指板上的各類和弦與音階。體驗不同按法、調式，並獲得即時的聽覺回饋。" 
    },
    visitSite: { en: "Launch Website", zh: "立即前往網站" },
    demo: { en: "Interactive Preview", zh: "即時預覽" },
    footer: { en: "© 2026. This website is in testing phase: please report any issues.", zh: "© 2026. 本網站為測試階段:如有問題，請回報。" },
    brand: "Brian&code"
  };

  const themeClasses = theme === "light"
    ? "bg-[#F9F9F9] text-[#333333] selection:bg-museum-accent/20"
    : "bg-[#121212] text-[#FAF9F6] selection:bg-[#FAF9F6]/20";

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <main className={`min-h-screen ${themeClasses} transition-colors duration-500 overflow-x-hidden relative flex flex-col`}>
        {/* Navigation / Header */}
        <nav className="w-full p-6 md:px-12 md:py-8 flex justify-between items-center z-30 absolute top-0 left-0">
          <div className="text-sm font-sans font-bold tracking-[0.2em] uppercase cursor-pointer" onClick={() => setCurrentView("home")}>
            {ui.title[lang]}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-sans font-bold tracking-[0.2em] text-[#C5A059]">{ui.brand}</span>
            <button
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className={`text-xs font-sans font-bold tracking-widest uppercase border px-4 py-2 rounded-full transition-all duration-300 shadow-sm ${theme === "light"
                ? "bg-white/80 border-museum-text/10 hover:bg-museum-text hover:text-white"
                : "bg-black/80 border-white/10 hover:bg-white hover:text-black"
                }`}
            >
              {lang === "en" ? "中文" : "EN"}
            </button>
          </div>
        </nav>

        {/* Dynamic View Area */}
        <div className="flex-1 w-full flex flex-col pt-20">
          <AnimatePresence mode="wait">
            {!showIntro && currentView === "home" && (
              <HomeView 
                key="home"
                lang={lang} 
                ui={ui} 
                onSelectProject={(id) => setCurrentView("detail")} 
              />
            )}
            {!showIntro && currentView === "detail" && (
              <DetailView 
                key="detail"
                lang={lang} 
                ui={ui} 
                theme={theme}
                onBack={() => setCurrentView("home")}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className={`p-6 text-center text-xs font-sans tracking-widest opacity-60 relative z-30 ${theme === "light" ? "border-t border-black/10" : "border-t border-white/10"}`}>
          {ui.footer[lang]}
        </footer>

        {/* Theme Toggle Button */}
        <motion.button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed bottom-20 right-6 md:bottom-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors ${theme === "light" ? "bg-[#121212] text-white hover:bg-black" : "bg-[#F9F9F9] text-black hover:bg-white"}`}
          title="Toggle Theme"
        >
          {theme === "light" ? <span className="text-xl">🌙</span> : <span className="text-xl">☀️</span>}
        </motion.button>

      </main>
    </>
  );
}
