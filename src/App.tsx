// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroLoadFallback = ({ onComplete }) => {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 100);
    return () => window.clearTimeout(timer);
  }, [onComplete]);
  return null;
};

const PixelEarthIntro = React.lazy(() =>
  import("./PixelEarthIntro").catch(() => ({ default: IntroLoadFallback }))
);

const projectsData = [
  {
    id: "guitar-advisor",
    title: { en: "Guitar Advisor", zh: "吉他顧問 (Guitar Chord Master)" },
    type: { en: "Interactive Tool / Web App", zh: "互動式工具 / 網頁應用" },
    desc: { 
      en: "A comprehensive tool for guitarists to explore chords and scales across the fretboard. Experiment with different voicings, modes, and find instant auditory feedback.", 
      zh: "專為吉他手設計的全方位互動工具，協助探索指板上的各類和弦與音階。體驗不同按法、調式，並獲得即時的聽覺回饋。" 
    },
    link: "https://brian53013new.github.io/Guitar-Chord-Master/"
  },
  {
    id: "art-weather-muse",
    title: { en: "ArtWeather Muse 2.0", zh: "藝術天氣嚮導 (ArtWeather Muse 2.0)" },
    type: { en: "Web Application", zh: "網頁應用" },
    desc: {
      en: "A brand new, upgraded art & weather website that combines meteorological data with artistic aesthetics to provide elegant outfit and weather guidance.",
      zh: "全新升級的藝術天氣網站，將天氣數據與藝術結合，為你提供最具質感的穿搭與氣象指引。"
    },
    link: "https://brian53013new.github.io/art-weather-muse2.0/"
  }
];

// 2. Home Navigation View (Grid)
const HomeView = ({ onSelectProject, lang }) => {
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
        {projectsData.map((proj) => (
          <motion.div 
            key={proj.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectProject(proj.id)}
            className="theme-card cursor-pointer border p-8 rounded-xl flex flex-col justify-between min-h-[250px] transition-colors group shadow-lg"
          >
            <div>
              <div className="theme-accent-text text-[10px] font-sans tracking-widest uppercase opacity-70 mb-4 transition-colors">
                {proj.type[lang]}
              </div>
              <h3 className="text-2xl font-serif mb-4">{proj.title[lang]}</h3>
              <p className="text-sm font-serif opacity-70 leading-relaxed">
                {proj.desc[lang]}
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <span className="theme-accent-text text-xs font-sans tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
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
const DetailView = ({ project, lang, ui, onBack }) => {
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
      <div className="theme-border w-full md:w-1/3 p-6 md:p-12 flex flex-col justify-center md:border-r z-20 gap-8">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <button 
            onClick={onBack}
            className="mb-12 text-xs font-sans tracking-widest uppercase flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            &larr; {lang === 'zh' ? '返回導覽' : 'Back to Directory'}
          </button>
          <h1 className="text-5xl md:text-6xl font-serif mb-6">{project.title[lang]}</h1>
          <p className="font-serif italic text-xl opacity-90 mb-12 leading-relaxed">
            {project.desc[lang]}
          </p>
          
          {/* Explicit Dedicated Enter Button */}
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="theme-primary-button inline-block text-center text-sm font-sans font-bold tracking-[0.2em] uppercase px-8 py-5 rounded-full transition-all duration-300 shadow-xl hover:scale-105"
          >
            {ui.visitSite[lang]} ↗
          </a>
        </motion.div>
      </div>

      {/* Right Panel: Interactive iframe demo */}
      <div className="theme-panel w-full md:w-2/3 relative flex flex-col p-6 md:p-12 min-h-[500px]">
        <motion.div
          className="w-full h-full rounded-2xl overflow-hidden border shadow-2xl relative bg-black flex items-center justify-center"
          style={{ borderColor: "var(--theme-border)" }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <iframe 
            src={project.link} 
            title={project.title.en}
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

const changelogEntries = [
  {
    date: "2026-10-17",
    version: "0.1.0",
    title: { zh: "網站啟動動畫全面升級｜3D 像素地球與金色門扉", en: "Opening Animation Upgrade | 3D Pixel Earth and Golden Portal" },
    sections: {
      zh: [
        ["3D 像素地球", ["以 Three.js SphereGeometry 建立真正的球體幾何，搭配半透明玻璃外殼、灰階像素大陸點雲、球面網格與輪廓光。", "大陸像素依球面經緯座標生成，旋轉時具有透視縮窄、深度遮擋與背面隱藏效果。"]],
        ["立體浮雕門扉", ["門框、門板與裝飾使用獨立 BoxGeometry 建立實際厚度，並作為地球群組子物件固定於球面切線位置。", "門扉會隨地球由側面旋轉至鏡頭正前方，不會脫離或漂浮；雙門板在靠近階段由樞紐向內側開啟。"]],
        ["電影式運鏡與金色轉場", ["地球先淡入並旋轉，門扉對準後 PerspectiveCamera 才由遠處平滑推近。", "門縫先出現細緻琥珀金光，再同步提高點光源、門框反射與放射光暈，最後由金色光幕淡入網站主畫面。", "完整時間軸約 7 秒，動畫結束會清理 WebGL 資源、事件與影格更新。"]],
        ["效能、裝置與無障礙", ["手機與低記憶體裝置會降低球體細分、像素密度、像素比與陰影品質。", "Three.js 動畫採動態載入，與網站主程式分離；WebGL 建立失敗、模組載入失敗或 context lost 時會自動進入網站。", "新增略過動畫按鈕、背景捲動鎖定、動畫結束後焦點還原，以及 prefers-reduced-motion 快速略過流程。", "既有六種網站風格與 localStorage 選擇不會被啟動動畫重設。"]],
        ["版本資訊", ["目前專案版本為 0.1.0（依 package.json）；未建立獨立發布標籤。"]]
      ],
      en: [
        ["3D pixel Earth", ["Built a true sphere with Three.js SphereGeometry, a translucent glass shell, grayscale pixel-continent point cloud, spherical grid, and rim lighting.", "Pixels are generated from spherical latitude/longitude coordinates, preserving perspective narrowing, depth occlusion, and back-face hiding during rotation."]],
        ["Relief portal", ["The frame, doors, and ornaments use independent BoxGeometry meshes with real depth and are attached to the Earth group at the sphere tangent.", "The portal rotates with the globe into a front-facing position; hinged door panels open only during the approach."]],
        ["Camera and golden transition", ["The Earth fades in and rotates before the PerspectiveCamera begins its smooth approach.", "A thin amber seam grows into portal lighting, frame reflections, and a radiant gold transition into the prepared site.", "The complete timeline runs about seven seconds and disposes WebGL resources, listeners, and animation frames on exit."]],
        ["Performance and accessibility", ["Mobile and low-memory devices reduce sphere segments, pixel density, pixel ratio, and shadow quality.", "The Three.js scene is code-split; module, WebGL, and context-loss failures automatically continue to the site.", "Added a skip button, scroll locking, focus restoration, and a shortened reduced-motion path.", "The saved six-theme preference remains unchanged."]],
        ["Version", ["Current project version is 0.1.0 from package.json; no standalone release tag has been created."]]
      ]
    }
  },
  {
    date: "2026-10-17",
    version: "0.1.0",
    title: { zh: "ArtWeather Muse｜資訊卡片詳細資訊視窗", en: "ArtWeather Muse | Information Card Detail Dialog" },
    sections: {
      zh: [
        ["新增功能", ["點擊基本資訊卡，即可查看目前溫度、體感溫度、降雨機率、濕度、天氣摘要與穿搭建議。", "點擊專業資訊中的個別數據卡，可查看該項目前數值與對應說明。"]],
        ["介面與操作改善", ["新增符合既有設計與六種主題的響應式詳細資訊視窗。", "支援關閉按鈕、點擊背景及 Escape 鍵關閉。", "開啟時會鎖定背景捲動並限制鍵盤焦點；關閉後焦點會返回原本觸發的卡片。", "保留藝術卡原有的預報與專業資訊切換功能，並支援減少動態效果偏好與中英文說明。"]],
        ["穩定性與效能", ["詳細資訊直接使用已載入的天氣資料，不會新增 API 請求。", "缺少的數值會以破折號顯示，避免無資料時出現錯誤內容。"]],
        ["版本資訊", ["專案版本為 0.1.0（依目前 package.json）；獨立發布標籤與正式發布狀態待確認。"]]
      ],
      en: [
        ["New features", ["Open a basic information card to view temperature, feels-like temperature, rain probability, humidity, weather summary, and outfit guidance.", "Open an individual professional data card to view its current value and explanation."]],
        ["Interface and usability", ["Added a responsive detail dialog that follows the existing design and all six visual themes.", "Supports a close button, backdrop click, and Escape key dismissal.", "Opening locks background scrolling and traps keyboard focus; closing restores focus to the triggering card.", "Preserves the art card forecast/professional-information switch and supports reduced motion and bilingual descriptions."]],
        ["Stability and performance", ["The dialog reuses already-loaded weather data and makes no additional API requests.", "Missing values display an em dash to avoid misleading or broken content."]],
        ["Version", ["Project version 0.1.0 is based on the current package.json; a standalone release tag and formal release status remain unconfirmed."]]
      ]
    }
  },
  {
    date: "2026-10-14",
    title: { zh: "吉他和弦網站｜重大功能更新", en: "Guitar Chord Website | Major Feature Update" },
    sections: {
      zh: [
        ["和弦資料庫與分類更新", ["依實際組成音、音程結構與和聲功能重新整理分類，主要資料庫整合 55 種獨立和弦類型。", "add 類和弦統一交由和弦加音模擬器處理；移除爵士色彩分類並將合理的延伸和弦重新歸類。", "保留 Half-Diminished（m7♭5）、Sus2、Sus4，並擴充六和弦、七和弦、九和弦及其他延伸和弦。", "六和弦涵蓋 Major 6、Minor 6、Major 6/9、Minor 6/9、Major 6/9(#11)；九和弦涵蓋 Major 9、Minor 9、Dominant 9、Minor-major 9、Half-Diminished 9、9sus4。", "優化變化音命名並同步本機 API 中英文和弦資料。"]],
        ["爵士和弦生成系統升級", ["新增 Rootless Voicing，可自行決定生成指法是否包含根音；無根音模式優先保留三音、七音及重要延伸音。", "新增六條琴弦自由選擇器，可指定相鄰或非相鄰琴弦組合。", "生成結果會遵守指定琴弦、根音設定與實際可演奏條件；友好模式優先小跨度指法，進階模式提供更多爵士聲部排列。", "無法生成符合條件的指法時會顯示明確提示。"]],
        ["和弦加音模擬器升級", ["將原和弦組合器升級為和弦加音模擬器，可先選擇基礎和弦，再加入一個或兩個音。", "支援 2／9、♭9、♯9、4／11、♯11、6／13、♭13，並自動分析新增後的結構與名稱。", "可正確區分 Cadd9、C9、Cmaj9，結果可直接開啟吉他指板及指法檢視。"]],
        ["音樂功能與操作改善", ["保留和弦音程分析、指板音名／音程度數切換及不同指法變體。", "保留吉他與鋼琴試聽並優化合成播放模式。", "保留中英文介面切換，改善搜尋、分類瀏覽與整體操作流程。"]],
        ["首次開啟更新公告", ["新增首次開啟公告，同一瀏覽器以 localStorage 記錄已讀狀態並只顯示一次。", "點擊公告任意位置即可關閉，支援淡出動畫與手機、平板、電腦響應式顯示。", "公告完整呈現主要更新，並提供以新分頁開啟 Brian Code 官方網站的完整紀錄連結。"]],
        ["六種網站風格模式", ["新增 Classic、Dark Professional、Minimal Light、Vintage Jazz、Tech Blue、Forest Green 六種完整風格。", "風格會同步套用全站文字、背景、按鈕、面板、選單與彈窗，並支援各尺寸裝置。", "使用 localStorage 記住選擇，重新開啟網站會自動恢復。"]]
      ],
      en: [
        ["Chord database and classification", ["Reorganized the library by pitch content, interval structure, and harmonic function, consolidating 55 distinct chord types.", "Moved add chords into the added-tone simulator, removed the jazz-color category, and reassigned valid extensions.", "Retained Half-Diminished (m7♭5), Sus2, and Sus4 while expanding sixth, seventh, ninth, and extended chords.", "Expanded sixth and ninth families, refined altered-note naming, and synchronized Chinese and English local API data."]],
        ["Jazz chord generation", ["Added optional Rootless Voicing that prioritizes thirds, sevenths, and essential extensions.", "Added a six-string selector supporting adjacent and non-adjacent string sets.", "Results respect string, root, and playability constraints; friendly mode favors compact shapes while advanced mode enables richer jazz voicings.", "Clear feedback is shown when no playable voicing matches the selected conditions."]],
        ["Added-tone simulator", ["Upgraded the chord builder into an added-tone simulator with one or two optional notes.", "Supports 2/9, ♭9, ♯9, 4/11, ♯11, 6/13, and ♭13 with automatic naming and structural analysis.", "Correctly distinguishes Cadd9, C9, and Cmaj9 and opens results directly on the fretboard and fingering viewer."]],
        ["Music and usability improvements", ["Retained interval analysis, note/degree fretboard labels, and voicing variants.", "Kept guitar and piano playback while improving synthesis.", "Preserved bilingual controls and improved search, category browsing, and overall flow."]],
        ["First-visit announcement", ["Added a one-time announcement remembered with localStorage.", "Clicking anywhere dismisses it with a fade animation across phone, tablet, and desktop layouts.", "The notice presents the main changes and links to the full Brian Code update log in a new tab."]],
        ["Six visual styles", ["Added Classic, Dark Professional, Minimal Light, Vintage Jazz, Tech Blue, and Forest Green.", "Each style covers site-wide text, backgrounds, controls, panels, menus, and dialogs on every screen size.", "The selected style is saved in localStorage and restored automatically."]]
      ]
    }
  },
  {
    date: "2026-08-02",
    title: { zh: "Guitar Chord Master 完整體驗升級", en: "Guitar Chord Master Experience Upgrade" },
    sections: {
      zh: [["新增與改善", ["擴充和弦與 24 種音階資料，新增搜尋、和弦組合器及吉他樂理。", "加入吉他與鋼琴音色、播放效能改善、藝廊式視覺與行動版優化。"]]],
      en: [["New and improved", ["Expanded the chord library and 24-scale collection with search, a chord builder, and guitar theory.", "Added guitar and piano sounds, playback improvements, gallery-inspired visuals, and mobile optimization."]]]
    }
  },
  {
    date: "2026-06-24",
    title: { zh: "天氣系統上線", en: "Weather System Launch" },
    sections: {
      zh: [["藝術天氣嚮導", ["ArtWeather Muse 2.0 正式收錄至作品集，結合天氣數據、藝術風格與穿搭指引。", "新增問題回報表單。"]]],
      en: [["ArtWeather Muse", ["Added ArtWeather Muse 2.0 to the portfolio, combining weather data, art direction, and outfit guidance.", "Added an issue-report form."]]]
    }
  },
  {
    date: "2026-06-23",
    title: { zh: "官方網站重大更新", en: "Official Website Major Update" },
    sections: {
      zh: [["網站與作品集", ["吉他顧問正式整合至作品集。", "重構網站架構並加入 3D 開場動畫與卡片式導覽。", "改用 Vite + React，改善靜態部署與載入體驗。"]]],
      en: [["Website and portfolio", ["Integrated Guitar Advisor into the portfolio.", "Rebuilt the site architecture with a 3D intro and card-based directory.", "Migrated to Vite + React for more reliable static deployment and loading."]]]
    }
  }
].sort((a, b) => b.date.localeCompare(a.date));

const formatDate = (date, lang) => {
  const [year, month, day] = date.split("-");
  return lang === "zh" ? `${year} 年 ${month} 月 ${day} 日` : `${year}-${month}-${day}`;
};

// 4. Update Log Modal
const UpdateLogModal = ({ onClose, lang }) => {

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="theme-modal relative w-full max-w-4xl p-6 md:p-10 border shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #38BDF8 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <button onClick={onClose} className="absolute top-6 right-6 text-2xl opacity-50 hover:opacity-100 transition-opacity z-10">&times;</button>
        
        <h2 className="text-3xl font-serif mb-2">{lang === 'zh' ? '網站更新紀錄' : 'Website Update Log'}</h2>
        <div className="theme-accent-text text-xs tracking-widest uppercase mb-8">Brian Code · Changelog</div>

        <div className="space-y-5 relative z-10 max-h-[65vh] overflow-y-auto pr-2 md:pr-4 pb-6">
          {changelogEntries.map((entry, index) => (
            <details key={entry.date} open={index === 0} className="theme-card changelog-entry rounded-xl border p-5 md:p-6">
              <summary className="cursor-pointer list-none pr-8 relative">
                <h3 className="text-lg md:text-xl font-serif font-bold">{entry.title[lang]}</h3>
                <p className="theme-accent-text mt-2 text-xs md:text-sm font-sans tracking-wider">
                  {lang === "zh" ? "發布日期：" : "Published: "}{formatDate(entry.date, lang)}
                </p>
              </summary>
              <div className="mt-6 space-y-6">
                {entry.sections[lang].map(([heading, items]) => (
                  <section key={heading}>
                    <h4 className="theme-accent-text mb-3 font-bold">{heading}</h4>
                    <ul className="space-y-2 text-sm md:text-base leading-relaxed opacity-90">
                      {items.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true">◆</span><span>{item}</span></li>)}
                    </ul>
                  </section>
                ))}
              </div>
            </details>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Page ---
const themeOptions = [
  { id: "classic", zh: "經典風格", en: "Classic" },
  { id: "dark-professional", zh: "深色專業", en: "Dark Professional" },
  { id: "minimal-light", zh: "極簡淺色", en: "Minimal Light" },
  { id: "vintage-jazz", zh: "爵士復古", en: "Vintage Jazz" },
  { id: "tech-blue", zh: "科技藍", en: "Tech Blue" },
  { id: "forest-green", zh: "森林綠", en: "Forest Green" }
];

const getInitialTheme = () => {
  if (typeof window === "undefined") return "classic";
  const saved = window.localStorage.getItem("brian-code-theme");
  return themeOptions.some((option) => option.id === saved) ? saved : "classic";
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [theme, setTheme] = useState(getInitialTheme);
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<"home" | "detail">("home");
  const [activeProjectId, setActiveProjectId] = useState<string>("guitar-advisor");
  const [showLog, setShowLog] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const completeIntro = () => {
    setShowIntro(false);
    window.requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("brian-code-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  }, [lang]);

  const activeProject = projectsData.find(p => p.id === activeProjectId) || projectsData[0];

  const ui = {
    title: { en: "Portfolio Navigation", zh: "作品集導覽" },
    visitSite: { en: "Launch Website", zh: "立即前往網站" },
    demo: { en: "Interactive Preview", zh: "即時預覽" },
    style: { en: "Change style", zh: "更改風格" },
    footer: { en: "© 2026. This website is in testing phase: please report any issues.", zh: "© 2026. 本網站為測試階段:如有問題，請回報。" },
    brand: "Brian&code"
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <React.Suspense fallback={<div className="fixed inset-0 z-[300] bg-[#030405]" aria-hidden="true" />}>
            <PixelEarthIntro onComplete={completeIntro} />
          </React.Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLog && <UpdateLogModal onClose={() => setShowLog(false)} lang={lang} />}
      </AnimatePresence>

      <main ref={mainRef} tabIndex={-1} data-theme={theme} className="theme-shell min-h-screen transition-colors duration-500 overflow-x-hidden relative flex flex-col focus:outline-none">
        {/* Navigation / Header */}
        <nav className="w-full p-6 md:px-12 md:py-8 flex justify-between items-center z-30 absolute top-0 left-0">
          <div className="text-sm font-sans font-bold tracking-[0.2em] uppercase cursor-pointer" onClick={() => setCurrentView("home")}>
            {ui.title[lang]}
          </div>
          <div className="flex flex-wrap justify-end items-center gap-2 md:gap-4">
            <span className="theme-accent-text hidden sm:inline text-sm font-sans font-bold tracking-[0.2em]">{ui.brand}</span>
            <label className="sr-only" htmlFor="theme-select">{ui.style[lang]}</label>
            <select
              id="theme-select"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              className="theme-control max-w-[9.5rem] md:max-w-none text-xs font-sans font-bold border px-3 py-2 rounded-full cursor-pointer"
              aria-label={ui.style[lang]}
            >
              {themeOptions.map((option) => (
                <option key={option.id} value={option.id}>{option[lang]}</option>
              ))}
            </select>
            <button
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="theme-control text-xs font-sans font-bold tracking-widest uppercase border px-4 py-2 rounded-full transition-all duration-300 shadow-sm"
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
                onSelectProject={(id) => {
                  setActiveProjectId(id);
                  setCurrentView("detail");
                }} 
              />
            )}
            {!showIntro && currentView === "detail" && (
              <DetailView 
                key="detail"
                project={activeProject}
                lang={lang} 
                ui={ui} 
                onBack={() => setCurrentView("home")}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="theme-border p-6 text-center text-xs font-sans tracking-widest opacity-80 relative z-30 flex flex-col items-center gap-4 border-t">
          <div>{ui.footer[lang]}</div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setShowLog(true)}
              className="theme-control px-4 py-2 rounded-full border transition-colors"
            >
              {lang === 'zh' ? '查看更新日誌 (Changelog)' : 'View Update Log'}
            </button>
            <a 
              href="https://forms.gle/6UxbjJfYSMPx9qpJ7"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-control theme-accent-text px-4 py-2 rounded-full border transition-colors"
            >
              {lang === 'zh' ? '問題回報 (Report Issue)' : 'Report Issue'}
            </a>
          </div>
        </footer>

      </main>
    </>
  );
}
