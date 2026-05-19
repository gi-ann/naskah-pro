import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, deleteDoc, onSnapshot } from 'firebase/firestore';
import { CheckCircle2, Cloud, Loader2, PenTool, Type, FileText, LayoutTemplate, CornerDownRight, Download, ChevronDown, ChevronRight, FolderOpen, Plus, X, Trash2, FileEdit, Upload, LogOut, User as UserIcon, FolderPlus, ArrowDownCircle, ChevronLeft, Folder, CheckSquare, Share2, Copy, MoveRight, Sun, Moon, Move, Home as HomeIcon, UserCog, Clock, CalendarPlus, ListOrdered } from 'lucide-react';

// --- FIREBASE INITIALIZATION ---
let firebaseConfig = {
  apiKey: "AIzaSyCmFz7pYvY1XNShFCNusV-cgQXyXaX8Qm4", 
  authDomain: "naskah-pro.firebaseapp.com",
  projectId: "naskah-pro",
  storageBucket: "naskah-pro.firebasestorage.app",
  messagingSenderId: "719016451723",
  appId: "1:719016451723:web:9165e87ae960fe9d35fe8e",
  measurementId: "G-PQF459544W"
};

if (typeof __firebase_config !== 'undefined' && __firebase_config) {
  try { firebaseConfig = JSON.parse(__firebase_config); } catch (e) { console.error(e); }
}

const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10 && firebaseConfig.apiKey !== "API_KEY_ASLI_KAMU_DISINI";
const app = isConfigValid ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = (typeof __app_id !== 'undefined' ? __app_id : 'naskah-app-default').replace(/\//g, '-');

// --- DAFTAR IKON CERDAS ---
const SOLID_ICONS_MAP = {
  "solid:Folder": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>,
  "solid:Book": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>,
  "solid:File": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>,
  "solid:Archive": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20 21H4V10h16v11zM3 3h18v6H3V3zm8 9h2v3h-2v-3z"/></svg>,
  "solid:Camera": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><circle cx="12" cy="12" r="3.2"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>,
  "solid:Image": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  "solid:Movie": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-2z"/></svg>,
  "solid:User": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  "solid:Smile": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 8c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-7 0c.83 0 1.5.67 1.5 1.5S9.33 13 8.5 13 7 12.33 7 11.5 7.67 10 8.5 10zm3.5 8c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/></svg>,
  "solid:Star": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
  "solid:Heart": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  "solid:Zap": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>,
  "solid:Home": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  "solid:Bell": (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
};

const FOLDER_EMOJIS = ['📁', '📂', '🎬', '📝', '🎥', '🎭', '🌟', '🔥', '💡', '📚', '🏆', '📸', '🎨', '🚀', '💼', '📌', '❤️', '✅', '🌈', '🎉', '💻', '📱', '🎧', '🎸', '🍔', '☕', '🚗', '✈️', '🏝️', '🌙'];

const FOLDER_SOLID = ["solid:Folder", "solid:Book", "solid:File", "solid:Archive", "solid:Image", "solid:Movie", "solid:Star", "solid:Heart"];

const PROFILE_SOLID = ["solid:User", "solid:Smile", "solid:Star", "solid:Heart", "solid:Zap", "solid:Bell", "solid:Camera", "solid:Archive"];

const PROFILE_ICONS_3D = [
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cold%20face/3D/cold_face_3d.png", 
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20sunglasses/3D/smiling_face_with_sunglasses_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Nerd%20face/3D/nerd_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Partying%20face/3D/partying_face_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Alien%20monster/3D/alien_monster_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Robot/3D/robot_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Ghost/3D/ghost_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Ninja/3D/ninja_3d.png",
  "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Crown/3D/crown_3d.png"
];

const ICONS_3D = [
  { name: "Folder", native: "📁", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/File%20Folder.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/File%20folder/3D/file_folder_3d.png" },
  { name: "Open Folder", native: "📂", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20File%20Folder.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Open%20file%20folder/3D/open_file_folder_3d.png" },
  { name: "Eye", native: "👁️", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Eye.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Eye/3D/eye_3d.png" },
  { name: "Eyes", native: "👀", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Eyes.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Eyes/3D/eyes_3d.png" },
  { name: "Grinning", native: "😀", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Grinning%20face/3D/grinning_face_3d.png" },
  { name: "Cool", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Sunglasses.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20sunglasses/3D/smiling_face_with_sunglasses_3d.png" },
  { name: "Nerd", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Nerd%20Face.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Nerd%20face/3D/nerd_face_3d.png" },
  { name: "Party", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Partying%20Face.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Partying%20face/3D/partying_face_3d.png" },
  { name: "Star Struck", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Star-struck/3D/star-struck_3d.png" },
  { name: "Alien", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Alien%20Monster.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Alien%20monster/3D/alien_monster_3d.png" },
  { name: "Robot", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Robot/3D/robot_3d.png" },
  { name: "Ghost", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Ghost.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Ghost/3D/ghost_3d.png" },
  { name: "Fire", native: "🔥", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fire.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fire/3D/fire_3d.png" },
  { name: "Rocket", native: "🚀", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rocket/3D/rocket_3d.png" },
  { name: "Laptop", native: "💻", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Laptop.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Laptop/3D/laptop_3d.png" },
  { name: "Trophy", native: "🏆", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Trophy/3D/trophy_3d.png" },
  { name: "Books", native: "📚", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Books/3D/books_3d.png" },
  { name: "Lightbulb", native: "💡", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Light%20bulb/3D/light_bulb_3d.png" },
  { name: "Pizza", native: "🍕", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Pizza.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Pizza/3D/pizza_3d.png" },
  { name: "Coffee", native: "☕", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Hot%20Beverage.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Hot%20beverage/3D/hot_beverage_3d.png" },
  { name: "Cat", native: "🐱", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Cat%20Face.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cat%20face/3D/cat_face_3d.png" },
  { name: "Dog", native: "🐶", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog%20Face.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Dog%20face/3D/dog_face_3d.png" },
  { name: "Fox", native: "🦊", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Fox.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fox/3D/fox_3d.png" },
  { name: "Bear", native: "🐻", anim: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png", static: "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bear/3D/bear_3d.png" }
];


// --- KOMPONEN SAFE ICON ---
const SafeIcon = ({ iconStr, className = "" }) => {
  const [hasError, setHasError] = useState(false);
  const [useNative, setUseNative] = useState(false);

  let safeStr = iconStr;
  if (typeof iconStr === 'object' && iconStr !== null) {
    safeStr = iconStr.anim || iconStr.static || iconStr.native || "solid:Folder";
  }
  if (typeof safeStr !== 'string') {
    safeStr = "solid:Folder";
  }

  useEffect(() => {
    setHasError(false);
    setUseNative(!safeStr.startsWith('http') && !safeStr.startsWith('solid:'));
  }, [safeStr]);

  if (!safeStr) return null;

  const sizeClass = className.includes('w-') || className.includes('h-') || className.includes('text-') ? '' : 'w-full h-full';

  if (safeStr.startsWith('solid:')) {
    const SolidComp = SOLID_ICONS_MAP[safeStr] || SOLID_ICONS_MAP["solid:Folder"];
    return <SolidComp className={`${sizeClass} ${className}`.trim()} />;
  }

  const iconObj = ICONS_3D.find(i => i.anim === safeStr || i.static === safeStr || i.native === safeStr);

  if (useNative) {
    const displayStr = (!safeStr.startsWith('http') && !safeStr.startsWith('solid:')) ? safeStr : (iconObj ? iconObj.native : '📁');
    return <span className={`flex items-center justify-center ${sizeClass} ${className}`.trim()}>{displayStr}</span>;
  }

  return (
    <img 
      src={hasError && iconObj ? iconObj.static : safeStr} 
      alt="Icon" 
      className={`object-contain drop-shadow-sm ${sizeClass} ${className}`.trim()} 
      onError={() => {
        if (!hasError && iconObj && safeStr === iconObj.anim && iconObj.static) {
          setHasError(true);
        } else {
          setUseNative(true);
        }
      }}
    />
  );
};

// --- HELPER UNTUK FORMAT NASKAH ---
const BLOCK_TYPES = {
  SCENE: 'scene', ACTION: 'action', CHARACTER: 'character', 
  DIALOGUE: 'dialogue', PARENTHETICAL: 'parenthetical', TRANSITION: 'transition'
};

const TAB_CYCLE = [
  BLOCK_TYPES.ACTION, BLOCK_TYPES.CHARACTER, BLOCK_TYPES.PARENTHETICAL,
  BLOCK_TYPES.DIALOGUE, BLOCK_TYPES.SCENE, BLOCK_TYPES.TRANSITION
];

const getNextTypeOnEnter = (currentType) => {
  switch (currentType) {
    case BLOCK_TYPES.SCENE: return BLOCK_TYPES.ACTION;
    case BLOCK_TYPES.ACTION: return BLOCK_TYPES.ACTION;
    case BLOCK_TYPES.CHARACTER: return BLOCK_TYPES.DIALOGUE;
    case BLOCK_TYPES.DIALOGUE: return BLOCK_TYPES.ACTION;
    case BLOCK_TYPES.PARENTHETICAL: return BLOCK_TYPES.DIALOGUE;
    case BLOCK_TYPES.TRANSITION: return BLOCK_TYPES.SCENE;
    default: return BLOCK_TYPES.ACTION;
  }
};

const generateUniqueId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const parseTXT = (text) => {
  const cleanRawText = text.replace(/[\u200B-\u200D\uFEFF\u00A0\u2028\r]/g, ' ');
  const lines = cleanRawText.split('\n');
  const blocks = [];
  let delay = 0;
  for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.replace(/[\n\t]+/g, ' ').trim();
    if (trimmed === "") continue;

    let type = BLOCK_TYPES.ACTION;
    if (trimmed.match(/^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)/i)) {
      type = BLOCK_TYPES.SCENE;
    } else if (trimmed === trimmed.toUpperCase() && !trimmed.match(/[.?!]$/) && trimmed.length < 40) {
      if (trimmed.match(/TO:$/)) type = BLOCK_TYPES.TRANSITION;
      else type = BLOCK_TYPES.CHARACTER;
    } else if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
      type = BLOCK_TYPES.PARENTHETICAL;
    } else {
      const prevType = blocks.length > 0 ? blocks[blocks.length-1].type : null;
      if (prevType === BLOCK_TYPES.CHARACTER || prevType === BLOCK_TYPES.PARENTHETICAL || prevType === BLOCK_TYPES.DIALOGUE) {
        type = BLOCK_TYPES.DIALOGUE;
      }
    }
    blocks.push({ id: Date.now().toString() + (delay++) + Math.random().toString(36).substr(2, 5), type, text: trimmed });
  }
  return blocks;
};

const parseFDX = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const paragraphs = xmlDoc.getElementsByTagName("Paragraph");
  const blocks = [];
  let delay = 0;
  const typeMap = {
    'Scene Heading': BLOCK_TYPES.SCENE, 'Action': BLOCK_TYPES.ACTION,
    'Character': BLOCK_TYPES.CHARACTER, 'Dialogue': BLOCK_TYPES.DIALOGUE,
    'Parenthetical': BLOCK_TYPES.PARENTHETICAL, 'Transition': BLOCK_TYPES.TRANSITION
  };

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const fdxType = p.getAttribute("Type");
    const type = typeMap[fdxType] || BLOCK_TYPES.ACTION;
    let text = "";
    const textNodes = p.getElementsByTagName("Text");
    for (let j = 0; j < textNodes.length; j++) text += textNodes[j].textContent;

    const cleanText = text.replace(/[\u200B-\u200D\uFEFF\u00A0\u2028\n\r\t]+/g, ' ').trim();
    if (cleanText.length > 0) {
       blocks.push({ id: Date.now().toString() + (delay++) + Math.random().toString(36).substr(2, 5), type, text: cleanText });
    }
  }
  return blocks;
};

// --- KOMPONEN AUTORESIZE TEXTAREA ---
const AutoResizeTextarea = React.forwardRef(({ value, onChange, onKeyDown, onFocus, onSelect, className, style, placeholder }, ref) => {
  const internalRef = useRef(null);

  const setRefs = useCallback((node) => {
    internalRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const styleString = JSON.stringify(style || {});

  const adjustHeight = useCallback(() => {
    if (internalRef.current) {
      const scrollContainer = document.getElementById('main-scroll-container');
      const scrollPos = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      
      internalRef.current.style.height = '1px'; 
      internalRef.current.style.height = internalRef.current.scrollHeight + 'px';
      
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollPos;
      } else {
        window.scrollTo(0, scrollPos); 
      }
    }
  }, []);

  useLayoutEffect(() => {
    adjustHeight();
  }, [value, className, styleString, adjustHeight]);

  useEffect(() => {
    adjustHeight();
    const timer1 = setTimeout(adjustHeight, 100);
    const timer2 = setTimeout(adjustHeight, 600);

    if (document.fonts) document.fonts.ready.then(adjustHeight);
    
    let observer;
    if (internalRef.current && window.ResizeObserver) {
      observer = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          adjustHeight();
        });
      });
      observer.observe(internalRef.current);
    } else {
      window.addEventListener('resize', adjustHeight);
    }

    return () => { 
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', adjustHeight); 
    };
  }, [adjustHeight]);

  return (
    <textarea
      ref={setRefs}
      value={value}
      onChange={(e) => { adjustHeight(); if (onChange) onChange(e); }}
      onKeyDown={onKeyDown}
      onFocus={(e) => { adjustHeight(); if (onFocus) onFocus(e); }}
      onSelect={onSelect}
      className={className}
      placeholder={placeholder}
      rows={1}
      spellCheck={false}
      style={{ ...style, minHeight: '1.5em' }}
    />
  );
});

// --- KOMPONEN BANTUAN UI ---
const FontSelector = ({ selected, onSelect, title, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fonts = [
    { id: 'default', label: 'Default (Mono)', class: 'font-mono' },
    { id: 'fanwood', label: 'Fanwood Text', class: 'font-fanwood' },
    { id: 'roboto', label: 'Roboto', class: 'font-roboto' }
  ];

  const currentFontLabel = fonts.find(f => f.id === selected)?.label || 'Default';

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
      >
        <span className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{title}</span>
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-semibold ${isDark ? 'text-[#0A84FF]' : 'text-blue-500'}`}>{currentFontLabel}</span>
          {isExpanded ? <ChevronDown size={14} className={isDark ? 'text-white/50' : 'text-gray-500'} /> : <ChevronRight size={14} className={isDark ? 'text-white/50' : 'text-gray-500'} />}
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-48 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`flex flex-col space-y-1 p-1 rounded-xl ${isDark ? 'bg-black/20' : 'bg-white shadow-sm border border-gray-100'}`}>
          {fonts.map(font => (
            <button 
              key={font.id} 
              onClick={() => { onSelect(font.id); setIsExpanded(false); }} 
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-lg transition-colors ${font.class}
                ${selected === font.id ? (isDark ? 'bg-[#0A84FF]/20 text-[#0A84FF]' : 'bg-blue-50 text-[#0A84FF]') : (isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50')}
              `}
            >
              <span>{font.label}</span>
              {selected === font.id && <CheckCircle2 size={14} className="text-[#0A84FF]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SliderControl = ({ label, value, min, max, step, onChange, suffix = "" }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const stopPropagation = (e) => e.stopPropagation();
    el.addEventListener('touchstart', stopPropagation, { passive: false });
    el.addEventListener('touchmove', stopPropagation, { passive: false });
    return () => {
      el.removeEventListener('touchstart', stopPropagation);
      el.removeEventListener('touchmove', stopPropagation);
    };
  }, []);

  return (
    <div className="mb-4 last:mb-1 relative z-50">
      <div className="flex justify-between text-[10px] mb-2 opacity-80 font-medium uppercase tracking-wider">
        <span>{label}</span>
        <span>{value}{suffix}</span>
      </div>
      <div className="py-2">
        <input 
          ref={inputRef}
          type="range" min={min} max={max} step={step || 1} value={value} 
          onChange={(e) => onChange(Number(e.target.value))} 
          onInput={(e) => onChange(Number(e.target.value))} 
          onMouseDown={(e) => e.stopPropagation()} 
          className="w-full accent-[#0A84FF] h-1.5 bg-gray-200 dark:bg-white/20 rounded-lg cursor-pointer appearance-none outline-none block touch-none" 
        />
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // TEMA (DARK / LIGHT MODE)
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('naskah_theme');
    return savedTheme ? savedTheme === 'dark' : true; 
  });

  // State Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);

  // State Profile
  const [profileName, setProfileName] = useState("Penulis");
  const [profileIcon, setProfileIcon] = useState(PROFILE_ICONS_3D[0]);

  const [blocks, setBlocks] = useState([]);
  const [scriptTitle, setScriptTitle] = useState("Naskah Tanpa Judul");
  const [currentScriptId, setCurrentScriptId] = useState(null);
  const [scriptsList, setScriptsList] = useState([]);
  const [folders, setFolders] = useState([]);
  
  const [view, setView] = useState('home'); 
  const [navDirection, setNavDirection] = useState('fade'); // 'forward', 'backward', 'fade'
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  // Ref dan State untuk Sistem Click-Outside Pop-up Menu
  const fontMenuRef = useRef(null);
  const optionMenuRef = useRef(null);
  const exportMenuRef = useRef(null);
  const emojiMenuRef = useRef(null);
  
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editProfileNameInput, setEditProfileNameInput] = useState("");
  const [editProfileIconInput, setEditProfileIconInput] = useState("");

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false); 
  
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderName, setEditingFolderName] = useState(""); 
  const [editingFolderIcon, setEditingFolderIcon] = useState(""); 
  
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('updatedDesc');
  
  const [activeSuggestions, setActiveSuggestions] = useState([]);
  const [suggestionTargetId, setSuggestionTargetId] = useState(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const [isHeaderSplit, setIsHeaderSplit] = useState(false);
  const [isFooterHidden, setIsFooterHidden] = useState(false);

  // --- STATE FONT BARU ---
  const [settingsTab, setSettingsTab] = useState('umum');
  const [selectedFont, setSelectedFont] = useState('default');
  const [titleFont, setTitleFont] = useState('roboto');
  
  const [titleFontSize, setTitleFontSize] = useState(64);
  const [titleFontWeight, setTitleFontWeight] = useState(400);
  const [titlePaddingTop, setTitlePaddingTop] = useState(48); 
  const [titlePaddingBottom, setTitlePaddingBottom] = useState(48); 
  const [titleLineHeight, setTitleLineHeight] = useState(1.1);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  // --- DRAG AND DROP STATE ---
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const [touchDragState, setTouchDragState] = useState({ isDragging: false, x: 0, y: 0, item: null });
  const dragNavTimeout = useRef(null); 
  const touchTimerRef = useRef(null);

  // Custom Alert & Toast System
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null, isDestructive: false });

  const blockRefs = useRef({});
  const fileInputRef = useRef(null);

  // Ref untuk Force Save on Exit
  const latestBlocksRef = useRef(blocks);
  const latestTitleRef = useRef(scriptTitle);

  useEffect(() => { latestBlocksRef.current = blocks; }, [blocks]);
  useEffect(() => { latestTitleRef.current = scriptTitle; }, [scriptTitle]);

  const isFolderSelected = selectedItems.some(id => folders.some(f => f.id === id));

  // --- KLIK DI LUAR MENU LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target)) setIsFontMenuOpen(false);
      if (optionMenuRef.current && !optionMenuRef.current.contains(event.target)) setIsOptionMenuOpen(false);
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) setIsExportMenuOpen(false);
      if (emojiMenuRef.current && !emojiMenuRef.current.contains(event.target)) setIsEmojiPickerOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // --- RENDER 3D ICON ---
  const renderProfileIcon = (iconStr, className = "") => {
    let safeStr = iconStr;
    if (typeof iconStr === 'object' && iconStr !== null) {
      safeStr = iconStr.anim || iconStr.static || iconStr.native || PROFILE_ICONS_3D[0];
    }
    if (typeof safeStr !== 'string') safeStr = PROFILE_ICONS_3D[0];

    if (safeStr.startsWith('http')) {
      return <img src={safeStr} alt="Profile" className={`w-full h-full object-contain ${className}`} />;
    }
    if (safeStr.startsWith('solid:')) {
      const SolidComp = SOLID_ICONS_MAP[safeStr] || SOLID_ICONS_MAP["solid:User"];
      return <SolidComp className={`w-full h-full ${className}`} />;
    }
    return <span className={`flex items-center justify-center w-full h-full ${className}`}>{safeStr}</span>;
  };

  // --- FUNGSI NAVIGASI ANIMASI ---
  const goToView = (targetView) => {
    const order = { 'home': 0, 'folder': 1, 'editor': 2 };
    if (order[targetView] > order[view]) {
      setNavDirection('forward');
    } else if (order[targetView] < order[view]) {
      setNavDirection('backward');
    } else {
      setNavDirection('fade');
    }
    setView(targetView);
  };

  const getAnimationClass = () => {
    if (navDirection === 'forward') return 'animate-slide-forward';
    if (navDirection === 'backward') return 'animate-slide-backward';
    return 'animate-in fade-in duration-300';
  };

  // --- KONTROL TOAST ---
  const showToast = (message) => {
    setToast({ isVisible: true, message });
    setTimeout(() => setToast({ isVisible: false, message: '' }), 3000);
  };

  // --- TOGGLE TEMA ---
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('naskah_theme', newTheme ? 'dark' : 'light');
  };

  // --- UNDO / REDO STATE ---
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const blocksRef = useRef(blocks);
  const typingTimer = useRef(null);
  const isUndoRedoAction = useRef(false);
  const selectionRef = useRef(null);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  const clearHistory = useCallback(() => {
    pastRef.current = [];
    futureRef.current = [];
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = null;
  }, []);

  const setBlocksWithHistory = useCallback((newBlocksOrUpdater, isTextTyping = false) => {
    setBlocks(prevBlocks => {
      const newBlocks = typeof newBlocksOrUpdater === 'function' ? newBlocksOrUpdater(prevBlocks) : newBlocksOrUpdater;
      
      if (isUndoRedoAction.current) return newBlocks;
      if (JSON.stringify(prevBlocks) === JSON.stringify(newBlocks)) return newBlocks;

      const currentState = { blocks: prevBlocks, selection: selectionRef.current ? { ...selectionRef.current } : null };

      if (isTextTyping) {
        if (!typingTimer.current) {
          pastRef.current = [...pastRef.current, currentState].slice(-50);
          futureRef.current = [];
        }
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => {
          typingTimer.current = null;
        }, 800); 
      } else {
        pastRef.current = [...pastRef.current, currentState].slice(-50);
        futureRef.current = [];
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
      }
      return newBlocks;
    });
  }, []);

  const handleUndo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const previousState = pastRef.current.pop();
    
    futureRef.current.push({ blocks: blocksRef.current, selection: selectionRef.current ? { ...selectionRef.current } : null });
    
    isUndoRedoAction.current = true;
    setBlocks(previousState.blocks);
    
    setTimeout(() => { 
      isUndoRedoAction.current = false; 
      if (previousState.selection && blockRefs.current[previousState.selection.id]) {
        const el = blockRefs.current[previousState.selection.id];
        el.focus();
        el.setSelectionRange(previousState.selection.start, previousState.selection.end);
      }
    }, 50);
  }, []);

  const handleRedo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const nextState = futureRef.current.pop();
    
    pastRef.current.push({ blocks: blocksRef.current, selection: selectionRef.current ? { ...selectionRef.current } : null });
    
    isUndoRedoAction.current = true;
    setBlocks(nextState.blocks);
    
    setTimeout(() => { 
      isUndoRedoAction.current = false; 
      if (nextState.selection && blockRefs.current[nextState.selection.id]) {
        const el = blockRefs.current[nextState.selection.id];
        el.focus();
        el.setSelectionRange(nextState.selection.start, nextState.selection.end);
      }
    }, 50);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleUndo, handleRedo]);


  // --- 1. AUTHENTICATION & LOGIN ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) { console.error("Auth error:", err); }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) { setAuthError('Email dan password wajib diisi'); return; }
    setIsAuthProcessing(true); setAuthError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setAuthError(error.message.replace('Firebase:', '').trim());
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsAuthProcessing(true);
    try { await signInAnonymously(auth); } 
    catch (error) { setAuthError('Gagal login tamu.'); } 
    finally { setIsAuthProcessing(false); }
  };

  const requestLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Keluar Akun",
      message: "Apakah kamu yakin ingin keluar? Naskahmu telah tersimpan aman di Cloud.",
      isDestructive: true,
      onConfirm: async () => {
        await signOut(auth);
        goToView('home'); setCurrentFolderId(null); setFolders([]); setScriptsList([]);
      }
    });
  };

  // --- 2. LOAD DATA DENGAN REAL-TIME ONSNAPSHOT ---
  useEffect(() => {
    if (!user || !db) {
      if (!user && !authLoading) setIsLoaded(true);
      return;
    }
    
    setIsLoaded(false);

    // Listener Real-time Folder
    const unsubFolders = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'folders'), (snap) => {
      const loadedFolders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFolders(loadedFolders);
    }, (err) => console.error("Error folders:", err));

    // Listener Real-time Scripts
    const unsubScripts = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'scripts'), (snap) => {
      const loadedScripts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter out scripts with non-existent folders
      const validFolderIds = new Set(folders.map(f => f.id));
      const validScripts = loadedScripts.filter(s => !s.folderId || validFolderIds.has(s.folderId));
      
      setScriptsList(validScripts);
      setIsLoaded(true);
    }, (err) => {
      console.error("Error scripts:", err);
      setIsLoaded(true);
    });

    // Load Profile (sekali saja)
    getDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'preferences', 'app_settings')).then(prefSnap => {
      if (prefSnap.exists()) {
        const pd = prefSnap.data();
        if (pd.profileName) setProfileName(pd.profileName);
        if (pd.profileIcon) {
          let loadedIcon = pd.profileIcon;
          if (typeof loadedIcon === 'object') loadedIcon = loadedIcon.anim || loadedIcon.static || loadedIcon.native || PROFILE_ICONS_3D[0];
          setProfileIcon(loadedIcon);
        }
      }
    });

    return () => {
      unsubFolders();
      unsubScripts();
    };
  }, [user, db, folders.length]); // folder length dependency for orphan script filter

  // --- PROFILE UPDATE ---
  const handleSaveProfile = async () => {
    const newName = editProfileNameInput.trim() || "Penulis";
    const newIcon = editProfileIconInput || PROFILE_ICONS_3D[0];
    
    setProfileName(newName);
    setProfileIcon(newIcon);
    setIsEditProfileModalOpen(false);
    showToast("Profil berhasil diperbarui!");
    
    if (user && db) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'preferences', 'app_settings'), {
          profileName: newName,
          profileIcon: newIcon
        }, { merge: true });
      } catch (err) {}
    }
  };

  // --- SORTING LOGIC ---
  const getSortedItems = (items) => {
    return [...items].sort((a, b) => {
      if (sortOrder === 'updatedDesc') return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sortOrder === 'createdDesc') return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
      if (sortOrder === 'nameAsc') {
        const nameA = (a.name || a.title || '').toLowerCase();
        const nameB = (b.name || b.title || '').toLowerCase();
        return nameA.localeCompare(nameB);
      }
      return 0;
    });
  };

  // --- FOLDER ACTIONS ---
  const openNewFolderModal = () => {
    setNewFolderName("");
    setTimeout(() => setIsNewFolderModalOpen(true), 50); 
  };

  const handleCreateFolderSubmit = async () => {
    if (!newFolderName || newFolderName.trim() === "") return;
    const newId = `folder_${Date.now()}`;
    const newFolder = { id: newId, name: newFolderName.trim(), icon: "solid:Folder", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setIsNewFolderModalOpen(false);
    showToast("Folder berhasil dibuat!");
    try { await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'folders', newId), newFolder); } catch (err) {}
  };

  const handleUpdateFolder = async (id, newName, newIcon) => {
    const folder = folders.find(f => f.id === id);
    if(!folder) return;
    
    let updatedName = newName && newName.trim() !== "" ? newName.trim() : folder.name;
    let updatedIcon = newIcon !== undefined ? newIcon : folder.icon;

    setEditingFolderName(updatedName);
    setEditingFolderIcon(updatedIcon);
    try { 
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'folders', id), { name: updatedName, icon: updatedIcon, updatedAt: new Date().toISOString() }, { merge: true }); 
    } catch (err) {}
  };

  const openFolder = (id) => {
    if (selectionMode) { toggleSelection(id); return; }
    setCurrentFolderId(id);
    const folder = folders.find(f => f.id === id);
    if(folder) {
      setEditingFolderName(folder.name);
      setEditingFolderIcon(folder.icon || ""); 
    }
    goToView('folder');
  };

  // --- FORCE SAVE ON EXIT ---
  const forceSaveScript = async () => {
    if (!user || !currentScriptId || !db || latestBlocksRef.current.length === 0) return;
    const isoDate = new Date().toISOString();
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', currentScriptId), { 
        id: currentScriptId, 
        title: latestTitleRef.current, 
        blocks: latestBlocksRef.current, 
        updatedAt: isoDate,
        titleFont, titleFontSize, titleFontWeight, titlePaddingTop, titlePaddingBottom, titleLineHeight
      }, { merge: true });
    } catch (err) { console.error("Force save failed", err); }
  };

  // --- SCRIPT ACTIONS ---
  const loadSpecificScript = async (scriptId) => {
    if (!user || !db) return;
    setIsLoaded(false);
    clearHistory();
    try {
      const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', scriptId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let sanitizedBlocks = data.blocks || [];
        
        sanitizedBlocks = sanitizedBlocks
          .filter(b => {
             const clean = b.text.replace(/[\u200B-\u200D\uFEFF\u00A0\u2028\n\r\t]/g, '').trim();
             return clean.length > 0;
          })
          .map(b => ({
             ...b,
             text: b.text.replace(/[\u200B-\u200D\uFEFF\u00A0\u2028\n\r\t]+/g, ' ').trim()
          }));

        if (sanitizedBlocks.length === 0) {
          sanitizedBlocks = [{ id: generateUniqueId(), type: BLOCK_TYPES.ACTION, text: 'Ketik adegan di sini...' }];
        }

        setBlocks(sanitizedBlocks); 
        setScriptTitle(data.title || "Naskah Tanpa Judul");
        setCurrentScriptId(scriptId); setLastSaved(new Date(data.updatedAt));
        
        // Memuat pengaturan gaya judul unik untuk naskah ini
        setTitleFont(data.titleFont || 'roboto');
        setTitleFontSize(data.titleFontSize || 64);
        setTitleFontWeight(data.titleFontWeight || 400);
        setTitlePaddingTop(data.titlePaddingTop !== undefined ? data.titlePaddingTop : 48);
        setTitlePaddingBottom(data.titlePaddingBottom !== undefined ? data.titlePaddingBottom : 48);
        setTitleLineHeight(data.titleLineHeight || 1.1);
      }
    } catch (err) { console.error("Gagal memuat:", err); } 
    finally { setIsLoaded(true); }
  };

  const createNewScript = async () => {
    if (!user || !db) return;
    setIsLoaded(false);
    clearHistory();
    const newId = `script_${Date.now()}`;
    const initialBlocks = [
      { id: Date.now().toString(), type: BLOCK_TYPES.SCENE, text: 'INT. KAMAR - PAGI' },
      { id: (Date.now() + 1).toString(), type: BLOCK_TYPES.ACTION, text: 'Terlihat layar menyala.' }
    ];
    const newTitle = "Naskah Baru";
    
    setTitleFont('roboto'); setTitleFontSize(64); setTitleFontWeight(400); 
    setTitlePaddingTop(48); setTitlePaddingBottom(48); setTitleLineHeight(1.1);

    setBlocks(initialBlocks); setScriptTitle(newTitle); setCurrentScriptId(newId);
    const newScriptData = { 
      id: newId, folderId: currentFolderId, title: newTitle, blocks: initialBlocks, 
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      titleFont: 'roboto', titleFontSize: 64, titleFontWeight: 400, titlePaddingTop: 48, titlePaddingBottom: 48, titleLineHeight: 1.1
    };

    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', newId), newScriptData);
    } catch (err) { console.error("Gagal:", err); } 
    finally { setIsLoaded(true); goToView('editor'); }
  };

  const createImportedScript = async (title, initialBlocks) => {
    if (!user || !db) return;
    setIsLoaded(false);
    clearHistory();
    const newId = `script_${Date.now()}`;
    
    setTitleFont('roboto'); setTitleFontSize(64); setTitleFontWeight(400); 
    setTitlePaddingTop(48); setTitlePaddingBottom(48); setTitleLineHeight(1.1);

    setBlocks(initialBlocks); setScriptTitle(title); setCurrentScriptId(newId);
    const newScriptData = { 
      id: newId, folderId: currentFolderId, title: title, blocks: initialBlocks, 
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      titleFont: 'roboto', titleFontSize: 64, titleFontWeight: 400, titlePaddingTop: 48, titlePaddingBottom: 48, titleLineHeight: 1.1
    };

    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', newId), newScriptData);
    } catch (err) { console.error("Gagal import:", err); }
    finally { setIsLoaded(true); showToast("Naskah berhasil diimpor!"); goToView('editor'); }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const extension = file.name.split('.').pop().toLowerCase();
      let newBlocks = [];
      let newTitle = file.name.replace(/\.[^/.]+$/, "");

      if (extension === 'fdx') newBlocks = parseFDX(content);
      else if (extension === 'txt') newBlocks = parseTXT(content);
      else { showToast("Format file tidak didukung."); return; }

      if (newBlocks.length === 0) newBlocks = [{ id: Date.now().toString(), type: BLOCK_TYPES.ACTION, text: "File kosong atau tidak dapat diurai." }];
      await createImportedScript(newTitle, newBlocks);
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const openScript = (script) => {
    if (selectionMode) { toggleSelection(script.id); return; }
    loadSpecificScript(script.id);
    goToView('editor');
  };

  // --- MULTI-SELECT & SHARE ACTIONS ---
  const toggleSelection = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const requestDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: "Hapus Permanen",
      message: `Apakah kamu yakin ingin menghapus ${selectedItems.length} item yang dipilih? Tindakan ini tidak dapat dibatalkan.`,
      isDestructive: true,
      onConfirm: async () => {
        try {
          const foldersToDelete = selectedItems.filter(id => folders.some(f => f.id === id));
          let orphanedScripts = [];

          if (foldersToDelete.length > 0) {
            for (const id of foldersToDelete) {
              await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'folders', id));
              const scriptsInFolder = scriptsList.filter(s => s.folderId === id);
              scriptsInFolder.forEach(s => orphanedScripts.push(s.id));
            }
          }
          
          const scriptsToDelete = selectedItems.filter(id => scriptsList.some(s => s.id === id));
          const allScriptsToDelete = [...new Set([...scriptsToDelete, ...orphanedScripts])];

          if (allScriptsToDelete.length > 0) {
            for (const id of allScriptsToDelete) {
              await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', id));
            }
          }

          setSelectedItems([]); setSelectionMode(false); setIsActionMenuOpen(false);
          showToast("Item berhasil dihapus.");
        } catch(err) { showToast("Gagal menghapus item."); }
      }
    });
  };

  const handleShareSelected = () => {
    const dummyLink = "https://naskahwriter.pro/share/" + selectedItems[0];
    const textArea = document.createElement("textarea");
    textArea.value = dummyLink;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast("Tautan berhasil disalin ke clipboard!");
    } catch (err) {
      showToast("Gagal menyalin tautan.");
    }
    document.body.removeChild(textArea);
    setIsActionMenuOpen(false); setSelectionMode(false); setSelectedItems([]);
  };

  const duplicateSelected = async () => {
    setIsActionMenuOpen(false);
    const itemsToDuplicate = scriptsList.filter(s => selectedItems.includes(s.id));
    if (itemsToDuplicate.length === 0) return;

    for (const item of itemsToDuplicate) {
      const newId = `script_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const duplicatedData = { ...item, id: newId, title: `${item.title} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      try { await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', newId), duplicatedData); } catch (err) {}
    }
    setSelectedItems([]); setSelectionMode(false);
    showToast("Berhasil menduplikasi naskah.");
  };

  // Menggabungkan logika pemindahan item agar dapat digunakan ulang
  const moveItemsToFolder = async (itemIds, targetFolderId) => {
    const scriptsToMove = itemIds.filter(id => scriptsList.some(s => s.id === id));
    if (scriptsToMove.length === 0) return;
    
    scriptsToMove.forEach(async (id) => {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', id), { folderId: targetFolderId, updatedAt: new Date().toISOString() }, { merge: true });
      } catch(err) {}
    });
    
    showToast(targetFolderId ? `${scriptsToMove.length} naskah dipindahkan.` : `${scriptsToMove.length} naskah dikembalikan ke Beranda.`);
  };

  const processDropAction = async (draggedData, targetId, targetType) => {
    if (!draggedData || !draggedData.items || draggedData.items.includes(targetId)) return;
    const sourceItems = draggedData.items;
    const hasFolder = sourceItems.some(itemId => folders.some(f => f.id === itemId));

    if (hasFolder && targetType === 'script') {
      const folderId = sourceItems.find(itemId => folders.some(f => f.id === itemId));
      if (folderId) await moveItemsToFolder([targetId], folderId);
    } 
    else if (!hasFolder && targetType === 'folder') {
      await moveItemsToFolder(sourceItems, targetId);
    } 
    else if (!hasFolder && targetType === 'script') {
      if (currentFolderId !== null) return;
      const newFolderId = `folder_${Date.now()}`;
      const newFolder = { id: newFolderId, name: "Grup Baru", icon: "solid:Folder", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

      const scriptsToMove = sourceItems.filter(itemId => scriptsList.some(s => s.id === itemId));
      if (!scriptsToMove.includes(targetId)) scriptsToMove.push(targetId);

      try { 
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'folders', newFolderId), newFolder); 
        scriptsToMove.forEach(async (itemId) => { 
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', itemId), { folderId: newFolderId, updatedAt: new Date().toISOString() }, { merge: true }); 
        });
      } catch(err) {}
      showToast(`Grup naskah baru dibuat dengan ${scriptsToMove.length} item.`);
    }

    if (draggedData.isMulti) { setSelectedItems([]); setSelectionMode(false); }
  };

  const processNavDrop = (draggedData, isHomeBtn) => {
    if (!draggedData || !draggedData.items || draggedData.items.length === 0) return;
    
    let targetFolderId = null;
    let nextView = 'home';
    
    if (!isHomeBtn && view === 'editor' && currentFolderId) {
        targetFolderId = currentFolderId;
        nextView = 'folder';
    }

    moveItemsToFolder(draggedData.items, targetFolderId);
    
    if (draggedData.isMulti) { 
        setSelectedItems([]); 
        setSelectionMode(false); 
    }
    
    goToView(nextView);
    if (nextView === 'home') setCurrentFolderId(null);
  };

  // --- CUSTOM TOUCH ENGINE (PROCREATE STYLE MOBILE DRAG) ---
  const handleTouchStart = (e, id, type, title) => {
    if (selectionMode && !selectedItems.includes(id)) return;
    
    const touch = e.touches[0];
    let dragItems = [id];
    let isMulti = false;
    let ghostText = title || "Memindahkan...";

    if (selectionMode) {
      if (selectedItems.includes(id)) {
        isMulti = true; dragItems = selectedItems; ghostText = `Memindahkan ${selectedItems.length} item...`;
      }
    }
    const itemData = { id, type, isMulti, items: dragItems, ghostText };

    touchTimerRef.current = setTimeout(() => {
      setTouchDragState({ isDragging: true, x: touch.clientX, y: touch.clientY, item: itemData });
      setDraggedItem(itemData);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 300);
  };

  const handleTouchMove = (e) => {
    if (!touchDragState.isDragging) {
      if (touchTimerRef.current) { clearTimeout(touchTimerRef.current); touchTimerRef.current = null; }
      return;
    }
    
    const touch = e.touches[0];
    setTouchDragState(prev => ({ ...prev, x: touch.clientX, y: touch.clientY }));
    
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elemBelow) return;

    const dropTarget = elemBelow.closest('[data-droppable="true"]');
    if (dropTarget) {
      const targetId = dropTarget.getAttribute('data-id');
      const targetType = dropTarget.getAttribute('data-type');
      
      let isDroppable = true;
      if (draggedItem && draggedItem.items && draggedItem.items.includes(targetId)) isDroppable = false;
      const hasFolder = draggedItem && draggedItem.items && draggedItem.items.some(itemId => folders.some(f => f.id === itemId));
      if (hasFolder && targetType === 'folder') isDroppable = false;
      if (hasFolder && targetType === 'script' && draggedItem && draggedItem.items && draggedItem.items.length > 1) isDroppable = false;
      if (!hasFolder && targetType === 'script' && currentFolderId !== null) isDroppable = false;

      if (isDroppable) {
        setDragOverTarget(targetId);
      } else {
        setDragOverTarget(null);
      }
    } else if (elemBelow.closest('#nav-home-btn')) {
      handleDragOverNav({ preventDefault: ()=>{}, stopPropagation: ()=>{}, dataTransfer: { dropEffect: 'move' } }, 'home');
    } else if (elemBelow.closest('#nav-back-btn')) {
      const target = (view === 'editor' && currentFolderId) ? 'folder' : 'home';
      handleDragOverNav({ preventDefault: ()=>{}, stopPropagation: ()=>{}, dataTransfer: { dropEffect: 'move' } }, target);
    } else {
      setDragOverTarget(null);
      if (dragNavTimeout.current) { clearTimeout(dragNavTimeout.current); dragNavTimeout.current = null; }
    }
  };

  const handleTouchEnd = (e) => {
    if (touchTimerRef.current) { clearTimeout(touchTimerRef.current); touchTimerRef.current = null; }
    if (!touchDragState.isDragging) return;

    const touch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    setTouchDragState({ isDragging: false, x: 0, y: 0, item: null });
    
    if (elemBelow) {
      const dropTarget = elemBelow.closest('[data-droppable="true"]');
      if (dropTarget && dragOverTarget === dropTarget.getAttribute('data-id')) {
        const targetId = dropTarget.getAttribute('data-id');
        const targetType = dropTarget.getAttribute('data-type');
        processDropAction(draggedItem, targetId, targetType);
        return;
      }
      
      if (elemBelow.closest('#nav-home-btn') || elemBelow.closest('#nav-back-btn')) {
        const isHomeBtn = !!elemBelow.closest('#nav-home-btn');
        processNavDrop(draggedItem, isHomeBtn);
        setDraggedItem(null); setDragOverTarget(null);
        return;
      }
    }

    if (draggedItem && view === 'home' && dragOverTarget === null) {
      if(draggedItem.items && draggedItem.items.length > 0) {
        moveItemsToFolder(draggedItem.items, null);
      }
      if (draggedItem.isMulti) { setSelectedItems([]); setSelectionMode(false); }
    }

    setDraggedItem(null); setDragOverTarget(null);
  };

  // --- HTML5 DRAG AND DROP (UNTUK DESKTOP) ---
  const handleDragStart = (e, id, type, title) => {
    if (selectionMode && !selectedItems.includes(id)) { e.preventDefault(); return; }
    let dragItems = [id]; let isMulti = false; let ghostText = title || "Memindahkan...";
    if (selectionMode) { if (selectedItems.includes(id)) { isMulti = true; dragItems = selectedItems; ghostText = `Memindahkan ${selectedItems.length} item...`; } }
    setDraggedItem({ id, type, isMulti, items: dragItems });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    const ghostEl = document.getElementById('custom-drag-ghost');
    const ghostTextEl = document.getElementById('drag-ghost-text');
    if (ghostEl && ghostTextEl) { ghostTextEl.textContent = ghostText; e.dataTransfer.setDragImage(ghostEl, -15, -15); }
  };

  const handleDragOver = (e, targetId, targetType) => {
    e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'move';
    
    let isDroppable = true;
    if (draggedItem && draggedItem.items && draggedItem.items.includes(targetId)) isDroppable = false;
    const hasFolder = draggedItem && draggedItem.items && draggedItem.items.some(itemId => folders.some(f => f.id === itemId));
    if (hasFolder && targetType === 'folder') isDroppable = false;
    if (hasFolder && targetType === 'script' && draggedItem && draggedItem.items && draggedItem.items.length > 1) isDroppable = false;
    if (!hasFolder && targetType === 'script' && currentFolderId !== null) isDroppable = false;

    if (isDroppable) {
      setDragOverTarget(targetId);
    } else { 
      setDragOverTarget(null); 
    }
  };

  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOverTarget(null); };
  const handleDragEnd = () => { setDraggedItem(null); setDragOverTarget(null); if (dragNavTimeout.current) { clearTimeout(dragNavTimeout.current); dragNavTimeout.current = null; } };

  const handleDrop = async (e, targetId, targetType) => {
    e.preventDefault(); e.stopPropagation(); setDragOverTarget(null);
    await processDropAction(draggedItem, targetId, targetType);
    setDraggedItem(null);
  };

  const handleDragOverNav = (e, targetView) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(targetView === 'home' ? 'nav-home' : 'nav-back');

    if (draggedItem && !dragNavTimeout.current) {
      dragNavTimeout.current = setTimeout(() => {
        if (targetView === 'home' && view !== 'home') { 
            goToView('home'); 
            setCurrentFolderId(null); 
            setDragOverTarget(null); 
        } else if (targetView === 'folder' && view !== 'folder') {
            goToView('folder');
            setDragOverTarget(null);
        }
        dragNavTimeout.current = null;
      }, 500); 
    }
  };

  const handleDragLeaveNav = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDragOverTarget(null);
    if (dragNavTimeout.current) { clearTimeout(dragNavTimeout.current); dragNavTimeout.current = null; }
  };

  // --- AUTO-SAVE DEBOUNCED ---
  useEffect(() => {
    if (view !== 'editor' || !user || !currentScriptId || blocks.length === 0 || !db) return;
    const saveToCloud = async () => {
      setIsSaving(true);
      const isoDate = new Date().toISOString();
      try {
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'scripts', currentScriptId);
        await setDoc(docRef, { 
          id: currentScriptId, 
          title: scriptTitle, 
          blocks, 
          updatedAt: isoDate,
          titleFont, titleFontSize, titleFontWeight, titlePaddingTop, titlePaddingBottom, titleLineHeight
        }, { merge: true });
        setLastSaved(new Date());
      } catch (err) {} finally { setIsSaving(false); }
    };
    const timeoutId = setTimeout(saveToCloud, 1000); // 1 detik debounce
    return () => clearTimeout(timeoutId);
  }, [blocks, scriptTitle, currentScriptId, user, view, titleFont, titleFontSize, titleFontWeight, titlePaddingTop, titlePaddingBottom, titleLineHeight]);

  const updatePagination = useCallback(() => {}, []);

  useEffect(() => {
    const timeout = setTimeout(updatePagination, 400);
    return () => clearTimeout(timeout);
  }, [blocks, updatePagination]);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updatePagination, 400);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePagination]);

  // --- SCROLL ANIMATION LISTENER ---
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollContainer = document.getElementById('main-scroll-container');
          const currentScrollY = scrollContainer ? scrollContainer.scrollTop : window.pageYOffset;
          const isScrollingDown = currentScrollY > lastScrollY;
          
          if (currentScrollY > 60) { 
            setIsHeaderSplit(isScrollingDown); 
            setIsFooterHidden(isScrollingDown); 
          } else { 
            setIsHeaderSplit(false); 
            setIsFooterHidden(false); 
          }
          lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
          ticking = false;
        });
        ticking = true;
      }
    };
    
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // --- KONTROL EDITOR ---
  const updateBlock = (id, newProps, isTextTyping = false) => {
    setBlocksWithHistory(prev => prev.map(b => b.id === id ? { ...b, ...newProps } : b), isTextTyping);
  };
  
  const focusBlock = (id) => {
    setTimeout(() => { const el = blockRefs.current[id]; if (el) { el.focus(); el.selectionStart = el.selectionEnd = el.value.length; } }, 10);
  };

  const handleKeyDown = (e, index) => {
    const block = blocks[index];

    if (e.altKey) {
      let newType = null;
      switch (e.key.toLowerCase()) {
        case 's': newType = BLOCK_TYPES.SCENE; break;
        case 'a': newType = BLOCK_TYPES.ACTION; break;
        case 'c': newType = BLOCK_TYPES.CHARACTER; break;
        case 'd': newType = BLOCK_TYPES.DIALOGUE; break;
        case 'p': newType = BLOCK_TYPES.PARENTHETICAL; break;
        case 't': newType = BLOCK_TYPES.TRANSITION; break;
      }
      if (newType) {
        e.preventDefault(); 
        updateBlock(block.id, { type: newType }, false);
        setActiveSuggestions([]); setSuggestionTargetId(null); return; 
      }
    }

    if (suggestionTargetId === block.id && activeSuggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSuggestionIndex(prev => (prev + 1) % activeSuggestions.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSuggestionIndex(prev => (prev - 1 + activeSuggestions.length) % activeSuggestions.length); return; }
      if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault();
        const selectedText = activeSuggestions[suggestionIndex];
        if (e.key === 'Enter') {
          const newType = getNextTypeOnEnter(block.type);
          const newBlock = { id: Date.now().toString() + Math.random().toString(36).substr(2, 5), type: newType, text: '' };
          
          setBlocksWithHistory(prev => {
            const nb = [...prev];
            nb[index] = { ...block, text: selectedText };
            nb.splice(index + 1, 0, newBlock);
            return nb;
          }, false);
          
          setActiveSuggestions([]); setSuggestionTargetId(null); focusBlock(newBlock.id);
        } else {
          updateBlock(block.id, { text: selectedText }, false); 
          setActiveSuggestions([]); setSuggestionTargetId(null);
        }
        return;
      }
      if (e.key === 'Escape') { setActiveSuggestions([]); setSuggestionTargetId(null); return; }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (block.text.trim() === '') {
        if (block.type !== BLOCK_TYPES.ACTION) {
          updateBlock(block.id, { type: BLOCK_TYPES.ACTION }, false);
        }
        return; 
      }
      
      const newType = getNextTypeOnEnter(block.type);
      const newBlock = { id: Date.now().toString() + Math.random().toString(36).substr(2, 5), type: newType, text: '' };
      
      setBlocksWithHistory(prev => {
        const nb = [...prev];
        nb.splice(index + 1, 0, newBlock);
        return nb;
      }, false);
      focusBlock(newBlock.id);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const nextTypeIndex = (TAB_CYCLE.indexOf(block.type) + 1) % TAB_CYCLE.length;
      updateBlock(block.id, { type: TAB_CYCLE[nextTypeIndex] }, false);
      setActiveSuggestions([]); setSuggestionTargetId(null);
      return;
    }

    if (e.key === 'Backspace' && block.text === '') {
      e.preventDefault();
      if (blocks.length > 1) {
        setBlocksWithHistory(prev => prev.filter(b => b.id !== block.id), false);
        const remainingBlocks = blocks.filter(b => b.id !== block.id);
        focusBlock(index > 0 ? remainingBlocks[index - 1].id : remainingBlocks[0].id);
      }
      return;
    }

    if (e.key === 'ArrowUp' && index > 0) { e.preventDefault(); focusBlock(blocks[index - 1].id); return; }
    if (e.key === 'ArrowDown' && index < blocks.length - 1) { e.preventDefault(); focusBlock(blocks[index + 1].id); return; }
  };

  const handleInput = (e, id, type) => {
    const newText = e.target.value;
    updateBlock(id, { text: newText }, true);

    if (type === BLOCK_TYPES.SCENE || type === BLOCK_TYPES.CHARACTER) {
      const val = newText.toUpperCase();
      if (val.trim().length > 0) {
        const pool = Array.from(new Set(blocks.filter(b => b.type === type && b.id !== id && b.text.trim() !== '').map(b => b.text.toUpperCase())));
        const matches = pool.filter(item => item.startsWith(val) && item !== val);
        if (matches.length > 0) { setActiveSuggestions(matches); setSuggestionTargetId(id); setSuggestionIndex(0); } 
        else { setActiveSuggestions([]); setSuggestionTargetId(null); }
      } else { setActiveSuggestions([]); setSuggestionTargetId(null); }
    } else { setActiveSuggestions([]); setSuggestionTargetId(null); }
  };

  const applySuggestion = (text, block, index) => {
    updateBlock(block.id, { text }, false); setActiveSuggestions([]); setSuggestionTargetId(null); focusBlock(block.id);
  };

  // --- FUNGSI EXPORT ---
  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    setIsExportMenuOpen(false); setIsActionMenuOpen(false);
    showToast(`Berhasil mengekspor: ${fileName}`);
  };

  const escapeXml = (unsafe) => unsafe ? unsafe.replace(/[<>&'"]/g, c => ({'<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;'}[c] || c)) : "";

  const exportTXT = () => {
    let txtContent = "";
    blocks.forEach(b => {
      switch(b.type) {
        case BLOCK_TYPES.SCENE: txtContent += b.text.toUpperCase() + "\n\n"; break;
        case BLOCK_TYPES.ACTION: txtContent += b.text + "\n\n"; break;
        case BLOCK_TYPES.CHARACTER: txtContent += "                    " + b.text.toUpperCase() + "\n"; break;
        case BLOCK_TYPES.PARENTHETICAL: txtContent += "               " + b.text + "\n"; break;
        case BLOCK_TYPES.DIALOGUE: txtContent += "          " + b.text + "\n\n"; break;
        case BLOCK_TYPES.TRANSITION: txtContent += "                                        " + b.text.toUpperCase() + "\n\n"; break;
        default: txtContent += b.text + "\n";
      }
    });
    downloadFile(txtContent, `${scriptTitle}.txt`, 'text/plain');
  };

  const exportFDX = () => {
    let fdxContent = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<FinalDraft DocumentType="Script" Template="No" Version="1">\n  <Content>\n`;
    const typeMap = { [BLOCK_TYPES.SCENE]: 'Scene Heading', [BLOCK_TYPES.ACTION]: 'Action', [BLOCK_TYPES.CHARACTER]: 'Character', [BLOCK_TYPES.DIALOGUE]: 'Dialogue', [BLOCK_TYPES.PARENTHETICAL]: 'Parenthetical', [BLOCK_TYPES.TRANSITION]: 'Transition' };
    blocks.forEach(b => { fdxContent += `    <Paragraph Type="${typeMap[b.type] || 'Action'}">\n      <Text>${escapeXml(b.text)}</Text>\n    </Paragraph>\n`; });
    fdxContent += `  </Content>\n</FinalDraft>`;
    downloadFile(fdxContent, `${scriptTitle}.fdx`, 'application/vnd.finaldraft+xml');
  };

  const exportPDF = () => {
    const fontFamily = selectedFont === 'fanwood' ? "'Fanwood Text', serif" : (selectedFont === 'roboto' ? "'Roboto', sans-serif" : '"Courier New", Courier, monospace');
    const titleFontFamilyExport = titleFont === 'fanwood' ? "'Fanwood Text', serif" : (titleFont === 'roboto' ? "'Roboto', sans-serif" : '"Courier New", Courier, monospace');
    
    let html = `<html><head><title>${scriptTitle}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Fanwood+Text&family=Roboto:wght@100;300;400;500;700;900&display=swap');
        @page { size: letter; margin: 1in 1in 1in 1.5in; }
        body { font-family: ${fontFamily}; font-size: 12pt; line-height: 1.1; margin: 0; padding: 0; }
        .script-title { font-family: ${titleFontFamilyExport}; font-size: ${titleFontSize}px; font-weight: ${titleFontWeight}; line-height: ${titleLineHeight}; text-align: center; padding-top: ${titlePaddingTop}px; padding-bottom: ${titlePaddingBottom}px; margin: 0; }
        .script-block { page-break-inside: avoid; }
        .scene { text-transform: uppercase; margin-top: 1.5em; margin-bottom: 1em; font-weight: bold; }
        .action { margin-top: 1em; margin-bottom: 1em; }
        .character { text-transform: uppercase; margin-top: 1.5em; margin-bottom: 0; margin-left: 2.5in; width: 4in; }
        .dialogue { margin-bottom: 1em; margin-left: 1.5in; width: 3.5in; }
        .parenthetical { margin-left: 2in; width: 3in; margin-bottom: 0; }
        .transition { text-transform: uppercase; text-align: right; margin-top: 1.5em; margin-bottom: 1.5em; width: 100%; }
      </style></head><body>
      <div class="script-title">${escapeXml(scriptTitle).replace(/\n/g, '<br/>')}</div>
      `;
    blocks.forEach(b => { html += `<div class="script-block ${b.type}">${escapeXml(b.text).replace(/\n/g, '<br/>')}</div>`; });
    html += `</body></html>`;
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed'; iframe.style.right = '0'; iframe.style.bottom = '0'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = '0';
    document.body.appendChild(iframe);
    iframe.contentWindow.document.open(); iframe.contentWindow.document.write(html); iframe.contentWindow.document.close(); iframe.contentWindow.focus();
    setTimeout(() => { iframe.contentWindow.print(); document.body.removeChild(iframe); setIsExportMenuOpen(false); }, 250);
  };

  const getBlockStyle = (type) => {
    const fontClass = selectedFont === 'fanwood' ? 'font-fanwood' : (selectedFont === 'roboto' ? 'font-roboto' : 'font-mono');
    const baseStyle = `block bg-transparent outline-none resize-none overflow-hidden ${fontClass} transition-none leading-relaxed text-[13px] sm:text-[14px] py-[2px] relative z-10 ${isDark ? 'text-[#E5E5EA] selection:bg-[#0A84FF]/40 placeholder-white/20' : 'text-gray-900 selection:bg-blue-300 placeholder-gray-400'}`;
    
    switch (type) {
      case BLOCK_TYPES.SCENE: return `${baseStyle} w-full font-bold uppercase mt-4 mb-1 tracking-wide ${isDark ? 'text-white' : 'text-black'}`;
      case BLOCK_TYPES.ACTION: return `${baseStyle} w-full mb-1.5 ${isDark ? 'opacity-90' : 'opacity-100'}`;
      case BLOCK_TYPES.CHARACTER: return `${baseStyle} w-[50%] mx-auto text-center uppercase mt-3 mb-0 text-[#0A84FF] font-semibold tracking-wide`;
      case BLOCK_TYPES.DIALOGUE: return `${baseStyle} w-[75%] mx-auto mb-1.5 ${isDark ? 'opacity-95' : 'opacity-100'}`;
      case BLOCK_TYPES.PARENTHETICAL: return `${baseStyle} w-[50%] mx-auto text-center mb-0 italic ${isDark ? 'opacity-70' : 'opacity-90'}`;
      case BLOCK_TYPES.TRANSITION: return `${baseStyle} w-full uppercase mt-4 mb-1.5 text-right pr-[5%] font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`;
      default: return `${baseStyle} w-full`;
    }
  };

  const getFormatText = (type) => {
    const style = "text-[10px] font-mono font-bold tracking-widest uppercase";
    switch (type) {
      case BLOCK_TYPES.SCENE: return <span className={`${style} text-[#0A84FF]`}>SCN</span>;
      case BLOCK_TYPES.ACTION: return <span className={`${style} ${isDark ? 'text-white/50' : 'text-gray-500'}`}>ACT</span>;
      case BLOCK_TYPES.CHARACTER: return <span className={`${style} text-[#BF5AF2]`}>CHR</span>;
      case BLOCK_TYPES.DIALOGUE: return <span className={`${style} text-[#32D74B]`}>DLG</span>;
      case BLOCK_TYPES.PARENTHETICAL: return <span className={`${style} text-[#FF9F0A]`}>PAR</span>;
      case BLOCK_TYPES.TRANSITION: return <span className={`${style} text-[#FF453A]`}>TRN</span>;
      default: return null;
    }
  };

  // --- RENDER LAYAR LOGIN ---
  if (authLoading) return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}><Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-[#0A84FF]' : 'text-blue-500'}`} /></div>;
  
  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center pureref-bg ${isDark ? 'dark' : 'light'} relative font-sans`}>
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0A84FF]/10 to-transparent' : 'bg-white/40 backdrop-blur-sm'} z-0`}></div>
        <div className={`relative z-10 w-full max-w-md ${isDark ? 'bg-white/[0.02] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} backdrop-blur-xl border p-8 rounded-[2rem] text-center shadow-2xl`}>
          <div className="w-16 h-16 bg-[#0A84FF]/20 text-[#0A84FF] rounded-2xl flex items-center justify-center mx-auto mb-6"><LayoutTemplate size={32} /></div>
          <h1 className="text-2xl font-bold mb-2 tracking-wide">Naskah Pro</h1>
          <p className={`text-sm mb-8 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Masuk untuk mengelola dan menyimpan naskahmu.</p>
          {authError && <div className="mb-6 p-3 bg-red-500/20 text-red-600 text-xs rounded-xl border border-red-500/20">{authError}</div>}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className={`w-full ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#0A84FF]/50 transition-all`} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className={`w-full ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#0A84FF]/50 transition-all`} />
            <button type="submit" disabled={isAuthProcessing} className="w-full bg-[#0A84FF] hover:bg-[#007AFF] active:scale-95 text-white font-semibold py-3.5 rounded-xl flex justify-center items-center transition-all duration-200">
              {isAuthProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'Daftar' : 'Masuk')}
            </button>
          </form>
          <div className="mt-6 flex flex-col space-y-4">
            <button onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }} className={`text-sm ${isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}>
              {isRegistering ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
            </button>
            <div className="flex items-center justify-center space-x-4"><div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div><span className={`text-xs uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Atau</span><div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div></div>
            <button onClick={handleGuestLogin} disabled={isAuthProcessing} className={`w-full ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'} border active:scale-95 py-3 rounded-xl text-sm transition-all duration-200 font-medium`}>Gunakan tanpa Akun</button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) return <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}><Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-white' : 'text-[#0A84FF]'}`} /></div>;

  const folderItems = getSortedItems(folders);
  const currentScripts = view === 'home' ? scriptsList.filter(s => !s.folderId) : scriptsList.filter(s => s.folderId === currentFolderId);
  const scriptItems = getSortedItems(currentScripts);

  return (
    <div className={`min-h-screen pureref-bg overflow-x-hidden relative font-sans ${isDark ? 'dark text-white' : 'light text-gray-900'} w-full h-screen flex ${touchDragState.isDragging ? 'is-touch-dragging' : ''}`}>

      {/* --- CUSTOM DRAG GHOST (Desktop HTML5 DnD) --- */}
      <div id="custom-drag-ghost" className="absolute top-[-10000px] left-[-10000px] bg-[#0A84FF] text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-2xl font-sans font-medium text-sm border border-white/20" style={{ zIndex: -1 }}>
        <Move size={18} />
        <span id="drag-ghost-text" className="truncate max-w-[200px]">Memindahkan...</span>
      </div>

      {/* --- CUSTOM DRAG GHOST (Mobile Procreate Touch Engine) --- */}
      {touchDragState.isDragging && (
        <div 
          className="fixed z-[10000] bg-[#0A84FF]/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-2xl font-medium text-sm border border-white/20 pointer-events-none scale-105 transition-none"
          style={{ left: touchDragState.x - 20, top: touchDragState.y - 20 }}
        >
          <Move size={18} />
          <span className="truncate max-w-[200px]">{touchDragState.item.ghostText}</span>
        </div>
      )}

      {/* --- GLOBAL TOAST NOTIFICATION --- */}
      {toast.isVisible && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[9999] ${isDark ? 'bg-white/95 text-black' : 'bg-gray-900 text-white'} px-5 py-2.5 rounded-full font-medium text-sm shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 ease-out flex items-center space-x-2`}>
          <CheckCircle2 size={16} className="text-[#32D74B]" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* --- KONTAINER UTAMA --- */}
      <div id="main-scroll-container" className="relative h-full w-full z-10 transition-all duration-300 ease-out overflow-y-scroll overflow-x-hidden flex flex-col">
        
        {/* --- HEADER TETAP --- */}
        <header className={`sticky top-0 h-16 ${isDark ? 'bg-[#121212]/80 border-white/5' : 'bg-white/80 border-gray-100'} backdrop-blur-xl z-50 flex items-center justify-between px-4 sm:px-8 border-b shrink-0`}>
          
          {/* KIRI HEADER (DENGAN DRAG TO NAVIGATE) */}
          <div className="flex-1 flex justify-start items-center">
            <button 
              id={view === 'home' ? "nav-home-btn" : "nav-back-btn"}
              onClick={async () => { 
                if (view === 'editor') { 
                  await forceSaveScript(); // FORCE SAVE SEBELUM KELUAR
                  goToView(currentFolderId ? 'folder' : 'home'); 
                  setBlocks([]); 
                } 
                else { 
                  goToView('home'); 
                  setCurrentFolderId(null); 
                  setSelectedItems([]); 
                  setSelectionMode(false); 
                }
              }} 
              onDragOver={(e) => handleDragOverNav(e, (view === 'editor' && currentFolderId) ? 'folder' : 'home')}
              onDragLeave={handleDragLeaveNav}
              onDrop={(e) => {
                e.preventDefault(); handleDragLeaveNav(e);
                if (draggedItem && draggedItem.items && draggedItem.items.length > 0) {
                  const targetFolder = (view === 'editor' && currentFolderId) ? currentFolderId : null;
                  moveItemsToFolder(draggedItem.items, view === 'home' ? null : targetFolder);
                  if (draggedItem.isMulti) { setSelectedItems([]); setSelectionMode(false); }
                  setDraggedItem(null);
                }
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20' : 'bg-blue-50 hover:bg-blue-100'} text-[#0A84FF] transition-all duration-200 active:scale-95 select-none touch-none relative overflow-hidden ${dragOverTarget === 'nav-home' || dragOverTarget === 'nav-back' ? 'ring-2 ring-[#0A84FF] scale-105' : ''}`}
            >
              <div className={`absolute flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform pointer-events-none ${view === 'home' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'}`}>
                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bird.png" alt="Home Bird" className="w-7 h-7 object-contain drop-shadow-sm pointer-events-none ml-0.5" />
              </div>
              <div className={`absolute flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform pointer-events-none ${view !== 'home' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                <ChevronLeft size={24} strokeWidth={3} />
              </div>
            </button>
          </div>

          {/* TENGAH HEADER */}
          <div className="flex-1 flex justify-center text-center">
            {view === 'editor' ? (
              <div className="relative" ref={fontMenuRef}>
                <div 
                  onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
                  className={`flex items-center space-x-2 text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 rounded-full ${isDark ? 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'} border shadow-inner cursor-pointer transition-colors`}
                  title="Pengaturan Tampilan"
                >
                  {isSaving ? (
                    <span className="flex items-center space-x-1.5"><Loader2 size={12} className="animate-spin text-[#0A84FF]" /><span className="hidden sm:inline">Menyimpan...</span></span>
                  ) : (
                    <span className="flex items-center space-x-1.5"><CheckCircle2 size={12} className="text-[#32D74B]" /><span className="hidden sm:inline">Tersimpan {lastSaved ? lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span><span className="sm:hidden">Tersimpan</span></span>
                  )}
                </div>

                {/* Pop-up Pengaturan Tampilan Animasi Mac */}
                {isFontMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-[100]">
                    <div className={`w-72 sm:w-80 ${isDark ? 'bg-[#1C1C1E]/95 border-white/10 text-white' : 'bg-white/95 border-gray-200 text-gray-900'} backdrop-blur-[40px] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border flex flex-col p-4 origin-top animate-mac-popup overscroll-none`}>
                      
                      <div className={`flex p-1 rounded-xl mb-4 ${isDark ? 'bg-black/50' : 'bg-gray-100'}`}>
                        <button onClick={() => setSettingsTab('umum')} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${settingsTab === 'umum' ? (isDark ? 'bg-[#2C2C2E] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Umum</button>
                        <button onClick={() => setSettingsTab('judul')} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${settingsTab === 'judul' ? (isDark ? 'bg-[#2C2C2E] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Gaya Judul</button>
                      </div>

                      {settingsTab === 'umum' ? (
                        <div className="animate-in fade-in duration-200">
                          <div className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'} mb-2`}>Tema Aplikasi</div>
                          <div className="flex space-x-2 mb-4">
                            <button onClick={() => { setIsDark(false); localStorage.setItem('naskah_theme', 'light'); }} className={`flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors font-medium ${!isDark ? 'bg-[#0A84FF] text-white shadow-md' : (isDark ? 'bg-white/5 hover:bg-white/10 text-white/70' : 'bg-gray-100 hover:bg-gray-200 text-gray-700')}`}><Sun size={14}/><span>Terang</span></button>
                            <button onClick={() => { setIsDark(true); localStorage.setItem('naskah_theme', 'dark'); }} className={`flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors font-medium ${isDark ? 'bg-[#0A84FF] text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}><Moon size={14}/><span>Gelap</span></button>
                          </div>

                          <div className={`h-px w-full mb-3 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}></div>
                          <FontSelector selected={selectedFont} onSelect={setSelectedFont} title="Pilih Font Naskah" isDark={isDark} />
                        </div>
                      ) : (
                        <div className="animate-in fade-in duration-200 space-y-2 max-h-[60vh] overflow-y-auto overscroll-none hide-scrollbar pr-1 -mr-1">
                          <FontSelector selected={titleFont} onSelect={setTitleFont} title="Pilih Font Judul" isDark={isDark} />
                          <div className={`h-px w-full mb-3 mt-1 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}></div>
                          <SliderControl label="Ukuran Teks" value={titleFontSize} min={16} max={300} onChange={setTitleFontSize} suffix="px" />
                          <SliderControl label="Ketebalan (Weight)" value={titleFontWeight} min={100} max={900} step={100} onChange={setTitleFontWeight} />
                          <SliderControl label="Jarak Atas (Pad Top)" value={titlePaddingTop} min={0} max={300} onChange={setTitlePaddingTop} suffix="px" />
                          <SliderControl label="Jarak Bawah (Pad Bot)" value={titlePaddingBottom} min={0} max={300} onChange={setTitlePaddingBottom} suffix="px" />
                          <SliderControl label="Spasi Antar Baris" value={titleLineHeight} min={0.8} max={2.5} step={0.1} onChange={setTitleLineHeight} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : view === 'folder' && currentFolderId ? (
              <div ref={emojiMenuRef} className={`flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-[13px] px-2 py-1.5 rounded-full ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 focus-within:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 focus-within:bg-white'} transition-all focus-within:border-[#0A84FF]/50 focus-within:ring-2 focus-within:ring-[#0A84FF]/20 border shadow-inner group max-w-[200px] sm:max-w-[300px] relative`}>
                
                <button
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`flex items-center justify-center rounded-full ${isDark ? 'bg-black/40 hover:bg-[#0A84FF]/20' : 'bg-gray-200 hover:bg-blue-100'} transition-colors shrink-0 w-7 h-7 overflow-hidden cursor-pointer`}
                  title="Ubah Ikon"
                >
                  {editingFolderIcon && editingFolderIcon !== "" ? (
                    <div className="w-4 h-4 flex items-center justify-center"><SafeIcon iconStr={editingFolderIcon} className="w-full h-full text-[#0A84FF]" /></div>
                  ) : (
                    <Folder size={14} className="text-[#0A84FF]" />
                  )}
                </button>

                {isEmojiPickerOpen && (
                  <div className={`absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 z-[9999]`}>
                    <div className={`${isDark ? 'bg-[#1C1C1E]/95 border-white/10' : 'bg-white/95 border-gray-200'} backdrop-blur-[40px] border p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-[340px] flex flex-col origin-top animate-mac-popup overscroll-none`}>
                       <div className="flex justify-between items-center mb-3">
                         <span className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Pilih Ikon Folder</span>
                         <button onClick={() => { handleUpdateFolder(currentFolderId, editingFolderName, "solid:Folder"); setIsEmojiPickerOpen(false); }} className={`text-xs font-bold ${isDark ? 'text-red-400 bg-red-500/10' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-md hover:opacity-80 transition-colors`}>Reset</button>
                       </div>
                       
                       <div className="max-h-64 overflow-y-auto overscroll-none custom-scrollbar pr-2 pb-2">
                         <div className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'} mb-2 mt-1`}>Ikon Solid (Datar)</div>
                         <div className="grid grid-cols-6 gap-2 mb-4 text-[#0A84FF]">
                           {FOLDER_SOLID.map(solidStr => (
                             <button key={solidStr} onClick={() => { handleUpdateFolder(currentFolderId, editingFolderName, solidStr); setIsEmojiPickerOpen(false); }} className={`w-10 h-10 flex items-center justify-center ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} rounded-xl transition-all hover:scale-110 active:scale-90`}>
                               <div className="w-5 h-5 flex items-center justify-center"><SafeIcon iconStr={solidStr} /></div>
                             </button>
                           ))}
                         </div>

                         <div className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'} mb-2 mt-1`}>3D Animated & Statis</div>
                         <div className="grid grid-cols-6 gap-2 mb-4">
                           {ICONS_3D.map((obj, idx) => (
                             <button key={`icon-${idx}`} onClick={() => { handleUpdateFolder(currentFolderId, editingFolderName, obj.anim); setIsEmojiPickerOpen(false); }} className={`w-10 h-10 flex items-center justify-center ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} rounded-xl transition-all hover:scale-110 active:scale-90`}>
                               <div className="w-7 h-7 flex items-center justify-center"><SafeIcon iconStr={obj.anim} /></div>
                             </button>
                           ))}
                         </div>

                         <div className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'} mb-2 mt-1`}>Emoji Biasa</div>
                         <div className="grid grid-cols-6 gap-2 mb-4">
                           {FOLDER_EMOJIS.map((emoji, idx) => (
                             <button key={`emoji-${idx}`} onClick={() => { handleUpdateFolder(currentFolderId, editingFolderName, emoji); setIsEmojiPickerOpen(false); }} className={`w-10 h-10 flex items-center justify-center ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} rounded-xl transition-all hover:scale-110 active:scale-90 text-lg`}>
                               {emoji}
                             </button>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  onBlur={() => handleUpdateFolder(currentFolderId, editingFolderName, editingFolderIcon)}
                  onKeyDown={(e) => { if(e.key === 'Enter') e.target.blur(); }}
                  className={`bg-transparent border-none outline-none font-medium ${isDark ? 'text-white/80 focus:text-white placeholder-white/30' : 'text-gray-700 focus:text-gray-900 placeholder-gray-400'} w-full transition-all text-left pr-2 truncate focus:truncate-none`}
                  placeholder="Nama Folder..."
                  title="Ubah Nama Folder"
                />
              </div>
            ) : (
              <div className={`flex items-center space-x-2 text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 rounded-full ${isDark ? 'bg-white/5 border-white/5 text-white/60' : 'bg-gray-50 border-gray-200 text-gray-500'} border shadow-inner pointer-events-none`}>
                <FileText size={12} className="text-[#0A84FF]" />
                <span className="font-medium">
                  {scriptsList.length} <span className="hidden sm:inline">Naskah Total</span>
                </span>
              </div>
            )}
          </div>

          {/* KANAN HEADER */}
          <div className="flex-1 flex justify-end items-center space-x-2 sm:space-x-3">
            {view === 'editor' ? (
              <div className="relative" ref={exportMenuRef}>
                <button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${isDark ? 'bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20 text-[#0A84FF]' : 'bg-blue-50 hover:bg-blue-100 text-[#0A84FF]'}`}>
                  <ArrowDownCircle size={22} strokeWidth={2.5} />
                </button>
                
                {/* Export Menu Pop-up Animasi Mac */}
                {isExportMenuOpen && (
                  <div className={`absolute right-0 mt-4 w-48 ${isDark ? 'bg-[#1C1C1E]/95 border-white/10' : 'bg-white/95 border-gray-200'} backdrop-blur-[40px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border flex flex-col p-1.5 z-50 origin-top-right animate-mac-popup`}>
                    <button onClick={() => exportPDF()} className={`text-left px-4 py-3 text-sm ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} rounded-xl transition-colors`}>Sebagai PDF</button>
                    <button onClick={() => exportFDX()} className={`text-left px-4 py-3 text-sm ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} rounded-xl transition-colors`}>Final Draft (.fdx)</button>
                    <button onClick={() => exportTXT()} className={`text-left px-4 py-3 text-sm ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} rounded-xl transition-colors`}>Plain Text (.txt)</button>
                  </div>
                )}
              </div>
            ) : (
              !selectionMode ? (
                <>
                  <button onClick={() => setSelectionMode(true)} title="Pilih Naskah/Folder" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${isDark ? 'bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20 text-[#0A84FF]' : 'bg-blue-50 hover:bg-blue-100 text-[#0A84FF]'}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path fillRule="evenodd" clipRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.28-5.72a.75.75 0 0 0 1.06 0l6-6a.75.75 0 1 0-1.06-1.06L11.25 14.69l-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3Z" /></svg>
                  </button>

                  <div className="relative" ref={optionMenuRef}>
                    <button onClick={() => setIsOptionMenuOpen(!isOptionMenuOpen)} className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 active:scale-95 ring-2 ring-transparent hover:ring-[#0A84FF]/30 ${isDark ? 'bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20 text-[#0A84FF]' : 'bg-blue-50 hover:bg-blue-100 text-[#0A84FF]'}`}>
                      <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
                         {renderProfileIcon(profileIcon)}
                      </div>
                    </button>

                    {/* V.04 Menu Option Baru */}
                    {isOptionMenuOpen && (
                      <div className={`absolute right-0 top-full mt-4 w-60 ${isDark ? 'bg-[#1C1C1E]/95 border-white/10' : 'bg-white/95 border-gray-200'} backdrop-blur-[40px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border flex flex-col p-2 z-[100] origin-top-right animate-mac-popup`}>
                        
                        {/* Akun */}
                        <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Akun</div>
                        <button onClick={() => { setIsOptionMenuOpen(false); setEditProfileNameInput(profileName); setEditProfileIconInput(profileIcon); setIsEditProfileModalOpen(true); }} className={`w-full text-left px-3 py-2 rounded-xl ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} text-sm flex items-center space-x-3 transition-colors`}>
                            <UserCog size={16} className={isDark ? 'text-white/60' : 'text-gray-500'} /> <span>Edit Profil</span>
                        </button>
                        <button onClick={() => { setIsOptionMenuOpen(false); requestLogout(); }} className={`w-full text-left px-3 py-2 rounded-xl text-red-500 ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-50'} text-sm flex items-center space-x-3 transition-colors`}>
                            <LogOut size={16} /> <span>Keluar</span>
                        </button>

                        <div className={`my-1 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}></div>

                        {/* Tindakan File */}
                        <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Tindakan File</div>
                        <button onClick={() => { setIsOptionMenuOpen(false); openNewFolderModal(); }} className={`w-full text-left px-3 py-2 rounded-xl ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} text-sm flex items-center space-x-3 transition-colors`}>
                            <FolderPlus size={16} className={isDark ? 'text-[#0A84FF]' : 'text-blue-500'} /> <span>Folder Baru</span>
                        </button>
                        <button onClick={() => { setIsOptionMenuOpen(false); fileInputRef.current?.click(); }} className={`w-full text-left px-3 py-2 rounded-xl ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} text-sm flex items-center space-x-3 transition-colors`}>
                            <Upload size={16} className={isDark ? 'text-[#0A84FF]' : 'text-blue-500'} /> <span>Import Naskah</span>
                        </button>

                        <div className={`my-1 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}></div>

                        {/* Urutkan File */}
                        <div className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Urutkan File</div>
                        <button onClick={() => { setIsOptionMenuOpen(false); setSortOrder('updatedDesc'); }} className={`w-full text-left px-3 py-2 rounded-xl ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} text-sm flex items-center justify-between transition-colors`}>
                            <div className="flex items-center space-x-3"><Clock size={16} className={isDark ? 'text-white/60' : 'text-gray-500'} /> <span>Terbaru Diubah</span></div>
                            {sortOrder === 'updatedDesc' && <CheckCircle2 size={14} className="text-[#0A84FF]" />}
                        </button>
                        <button onClick={() => { setIsOptionMenuOpen(false); setSortOrder('createdDesc'); }} className={`w-full text-left px-3 py-2 rounded-xl ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} text-sm flex items-center justify-between transition-colors`}>
                            <div className="flex items-center space-x-3"><CalendarPlus size={16} className={isDark ? 'text-white/60' : 'text-gray-500'} /> <span>Baru Dibuat</span></div>
                            {sortOrder === 'createdDesc' && <CheckCircle2 size={14} className="text-[#0A84FF]" />}
                        </button>
                        <button onClick={() => { setIsOptionMenuOpen(false); setSortOrder('nameAsc'); }} className={`w-full text-left px-3 py-2 rounded-xl ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} text-sm flex items-center justify-between transition-colors`}>
                            <div className="flex items-center space-x-3"><ListOrdered size={16} className={isDark ? 'text-white/60' : 'text-gray-500'} /> <span>Nama (A-Z)</span></div>
                            {sortOrder === 'nameAsc' && <CheckCircle2 size={14} className="text-[#0A84FF]" />}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={requestDeleteSelected} className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-500 text-sm font-medium transition-colors active:scale-95">Hapus</button>
                  <button onClick={() => setIsActionMenuOpen(true)} className={`px-3 py-2 rounded-xl ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} text-sm font-medium transition-colors active:scale-95`}>Lainnya</button>
                  <button onClick={() => { setSelectionMode(false); setSelectedItems([]); }} className={`px-3 py-2 rounded-xl text-[#0A84FF] ${isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50'} text-sm font-medium transition-colors active:scale-95`}>Batal</button>
                </>
              )
            )}
          </div>
        </header>

        {/* --- AREA KONTEN UTAMA --- */}
        <div 
          className="flex-1 w-full relative z-10 pt-8 pb-12 px-4 sm:px-8 max-w-5xl mx-auto"
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onDrop={(e) => { 
            e.preventDefault(); 
            if (draggedItem && draggedItem.items && draggedItem.items.length > 0 && view === 'home') {
              moveItemsToFolder(draggedItem.items, null);
              if (draggedItem.isMulti) { setSelectedItems([]); setSelectionMode(false); }
            }
            setDragOverTarget(null); 
            setDraggedItem(null); 
          }}
        >
          
          <input type="file" accept=".txt,.fdx" ref={fileInputRef} onChange={(e) => { handleImport(e); }} className="hidden" />

          {/* VIEW 1: HOME (DAFTAR FOLDER & DND) */}
          {view === 'home' && (
            <div className={`w-full ${getAnimationClass()}`}>
              <div className="mymind-grid grid gap-4 sm:gap-6">
                
                <div onClick={createNewScript} className={`folder-card group aspect-square ${isDark ? 'bg-[#1A1A1C] border-white/10 hover:border-[#0A84FF]/50' : 'bg-white border-gray-200 hover:border-[#0A84FF] shadow-sm'} border border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer active:scale-[0.98] transition-transform duration-200`}>
                  <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} group-hover:bg-[#0A84FF] flex items-center justify-center transition-colors mb-3`}>
                    <Plus size={24} className={`${isDark ? 'text-white/50' : 'text-gray-400'} group-hover:text-white transition-colors`} />
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-white/50' : 'text-gray-500'} group-hover:text-[#0A84FF] transition-colors`}>Naskah Baru</span>
                </div>

                {folderItems.map(f => (
                  <div 
                    key={f.id} 
                    data-droppable="true"
                    data-id={f.id}
                    data-type="folder"
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, f.id, 'folder', f.name)}
                    onDragOver={(e) => handleDragOver(e, f.id, 'folder')}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, f.id, 'folder')}
                    onClick={() => openFolder(f.id)} 
                    className={`folder-card relative aspect-square rounded-3xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer border overflow-hidden active:scale-[0.98] transition-all duration-200 hover:cursor-grab active:cursor-grabbing
                      ${dragOverTarget === f.id ? 'ring-4 ring-[#32D74B] scale-105 bg-[#32D74B]/20' : ''}
                      ${selectionMode && selectedItems.includes(f.id) ? 'bg-[#0A84FF]/20 border-[#0A84FF]/50 ring-2 ring-[#0A84FF]' : (isDark ? 'bg-[#1A1A1C] border-white/5 hover:border-white/10' : 'bg-white border-gray-200 shadow-sm')}
                    `}
                  >
                    <div className={`flex justify-between items-start z-10 ${draggedItem ? 'pointer-events-none' : ''}`}>
                      <div className={`p-3 rounded-2xl flex items-center justify-center w-12 h-12 ${selectionMode && selectedItems.includes(f.id) ? 'bg-[#0A84FF] text-white' : (isDark ? 'bg-white/5 text-[#0A84FF]' : 'bg-blue-50 text-[#0A84FF]')}`}>
                        {f.icon && f.icon !== "" ? (
                          <SafeIcon iconStr={f.icon} />
                        ) : (
                          <Folder size={24} fill="currentColor" fillOpacity={0.2} />
                        )}
                      </div>
                      {selectionMode && (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedItems.includes(f.id) ? 'bg-[#0A84FF] border-[#0A84FF]' : (isDark ? 'border-white/20' : 'border-gray-300')}`}>
                          {selectedItems.includes(f.id) && <CheckSquare size={14} className="text-white" />}
                        </div>
                      )}
                    </div>
                    <div className={`z-10 mt-auto ${draggedItem ? 'pointer-events-none' : ''}`}>
                      <h3 className={`font-semibold text-lg mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.name}</h3>
                      <p className={`text-xs font-mono ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{scriptsList.filter(s=>s.folderId===f.id).length} Naskah</p>
                    </div>
                    <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${isDark ? 'from-black/60' : 'from-white/90'} to-transparent z-0 pointer-events-none`}></div>
                  </div>
                ))}

                {/* NASKAH TANPA FOLDER DI HALAMAN DEPAN */}
                {scriptItems.map(s => (
                  <div 
                    key={s.id} 
                    data-droppable="true"
                    data-id={s.id}
                    data-type="script"
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, s.id, 'script', s.title)}
                    onDragOver={(e) => handleDragOver(e, s.id, 'script')}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, s.id, 'script')}
                    onTouchStart={(e) => handleTouchStart(e, s.id, 'script', s.title)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    onClick={() => openScript(s)} 
                    className={`folder-card relative aspect-square rounded-3xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer border overflow-hidden active:scale-[0.98] transition-all duration-200 hover:cursor-grab active:cursor-grabbing
                      ${dragOverTarget === s.id ? 'ring-4 ring-[#0A84FF] scale-105 bg-[#0A84FF]/20' : ''}
                      ${selectionMode && selectedItems.includes(s.id) ? 'bg-[#0A84FF]/20 border-[#0A84FF]/50 ring-2 ring-[#0A84FF]' : (isDark ? 'bg-[#1A1A1C] border-white/5 hover:border-white/10' : 'bg-white border-gray-200 shadow-sm')}
                    `}
                  >
                    <div className={`flex justify-between items-start z-10 ${draggedItem ? 'pointer-events-none' : ''}`}>
                      <div className={`p-3 rounded-2xl w-12 h-12 flex items-center justify-center ${selectionMode && selectedItems.includes(s.id) ? 'bg-[#0A84FF] text-white' : (isDark ? 'bg-white/5 text-white/70' : 'bg-gray-100 text-gray-500')}`}>
                        <FileText size={24} fill="currentColor" fillOpacity={0.1} className="pointer-events-none" />
                      </div>
                      {selectionMode && (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedItems.includes(s.id) ? 'bg-[#0A84FF] border-[#0A84FF]' : (isDark ? 'border-white/20' : 'border-gray-300')}`}>
                          {selectedItems.includes(s.id) && <CheckSquare size={14} className="text-white" />}
                        </div>
                      )}
                    </div>
                    <div className={`z-10 mt-auto ${draggedItem ? 'pointer-events-none' : ''}`}>
                      <h3 className={`font-semibold text-lg mb-1 line-clamp-2 break-words leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.title}</h3>
                      <p className={`text-xs font-mono ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : ''}</p>
                    </div>
                    <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${isDark ? 'from-black/60' : 'from-white/90'} to-transparent z-0 pointer-events-none`}></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: FOLDER (DAFTAR NASKAH DI DALAM FOLDER) */}
          {view === 'folder' && (
            <div className={`w-full max-w-3xl mx-auto ${getAnimationClass()}`}>
              <div className="flex flex-col space-y-3">
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div onClick={createNewScript} className={`group ${isDark ? 'bg-[#1A1A1C] border-white/10 hover:border-[#0A84FF]/50' : 'bg-white border-gray-200 hover:border-[#0A84FF]/50 shadow-sm'} border-dashed rounded-[1.5rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 active:scale-[0.98]`}>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} group-hover:bg-[#0A84FF] flex items-center justify-center transition-colors mb-2 sm:mb-3`}>
                      <Plus size={20} className={`${isDark ? 'text-white/50' : 'text-gray-400'} group-hover:text-white transition-colors sm:w-6 sm:h-6`} />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white/50' : 'text-gray-500'} group-hover:text-[#0A84FF] transition-colors`}>Naskah Baru</span>
                  </div>

                  <div onClick={() => fileInputRef.current?.click()} className={`group ${isDark ? 'bg-[#1A1A1C] border-white/10 hover:border-[#0A84FF]/50' : 'bg-white border-gray-200 hover:border-[#0A84FF]/50 shadow-sm'} border-dashed rounded-[1.5rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 active:scale-[0.98]`}>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} group-hover:bg-[#0A84FF] flex items-center justify-center transition-colors mb-2 sm:mb-3`}>
                      <Upload size={18} className={`${isDark ? 'text-white/50' : 'text-gray-400'} group-hover:text-white transition-colors sm:w-5 sm:h-5`} />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-white/50' : 'text-gray-500'} group-hover:text-[#0A84FF] transition-colors`}>Impor Naskah</span>
                  </div>
                </div>

                {scriptItems.map(s => (
                  <div 
                    key={s.id} 
                    data-droppable="true"
                    data-id={s.id}
                    data-type="script"
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, s.id, 'script', s.title)}
                    onDragOver={(e) => handleDragOver(e, s.id, 'script')}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, s.id, 'script')}
                    onTouchStart={(e) => handleTouchStart(e, s.id, 'script', s.title)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    onClick={() => openScript(s)} 
                    className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-[1.5rem] cursor-pointer transition-all duration-200 active:scale-[0.98] border hover:cursor-grab active:cursor-grabbing
                      ${dragOverTarget === s.id ? 'ring-2 ring-[#0A84FF] bg-[#0A84FF]/10 scale-[1.01]' : ''}
                      ${selectionMode && selectedItems.includes(s.id) ? 'bg-[#0A84FF]/20 border-[#0A84FF]/50 ring-1 ring-[#0A84FF]' : (isDark ? 'bg-[#1A1A1C] border-white/5 hover:bg-[#202022]' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm')}
                    `}
                  >
                    <div className={`flex items-center space-x-4 flex-1 ${draggedItem ? 'pointer-events-none' : ''}`}>
                      {selectionMode ? (
                        <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedItems.includes(s.id) ? 'bg-[#0A84FF] border-[#0A84FF]' : (isDark ? 'border-white/20' : 'border-gray-300')}`}>
                          {selectedItems.includes(s.id) && <CheckSquare size={14} className="text-white" />}
                        </div>
                      ) : (
                        <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl ${isDark ? 'bg-white/5 text-[#0A84FF]' : 'bg-blue-50 text-[#0A84FF]'}`}>
                          <FileText size={22} fill="currentColor" fillOpacity={0.1} />
                        </div>
                      )}
                      <div className="flex flex-col items-start w-full pr-4 pointer-events-none">
                        <span className={`font-medium text-base sm:text-lg w-full text-left break-words whitespace-normal leading-snug ${isDark ? 'text-white/90' : 'text-gray-900'}`}>{s.title}</span>
                        <span className={`text-[11px] mt-1.5 font-mono ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : 'Belum pernah diedit'}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {scriptItems.length === 0 && (
                  <div className={`text-center py-20 text-sm font-medium animate-in fade-in duration-500 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                    Folder ini masih kosong.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: EDITOR (MENGEDIT NASKAH) */}
          {view === 'editor' && (
            <div className={`w-full relative z-10 ${getAnimationClass()}`}>
              
              {/* --- AREA JUDUL FULL WINDOW (V.07) --- */}
              <div 
                className="group/title cursor-text relative flex justify-center items-center w-full mx-auto"
                style={{ paddingTop: `${titlePaddingTop}px`, paddingBottom: `${titlePaddingBottom}px` }}
              >
                 <FileEdit size={24} className={`${isDark ? 'text-white/20' : 'text-gray-300'} absolute left-4 sm:left-8 opacity-0 group-hover/title:opacity-100 transition-opacity z-20`} />
                 <AutoResizeTextarea 
                   value={scriptTitle} 
                   onChange={(e) => setScriptTitle(e.target.value.replace(/[\r\n]+/g, ' '))}
                   onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}
                   className={`bg-transparent border-none outline-none tracking-tight w-full px-4 sm:px-12 transition-colors resize-none overflow-hidden block break-words text-center ${titleFont === 'fanwood' ? 'font-fanwood' : titleFont === 'roboto' ? 'font-roboto' : 'font-mono'} ${isDark ? 'text-white hover:text-white/90 focus:text-white placeholder-white/20' : 'text-gray-900 hover:text-gray-800 focus:text-gray-900 placeholder-gray-300'}`}
                   style={{ fontSize: `${titleFontSize}px`, fontWeight: titleFontWeight, lineHeight: titleLineHeight }}
                   placeholder="JUDUL NASKAH..."
                 />
              </div>

              {/* --- AREA CANVAS TERBATAS (KERTAS NASKAH) --- */}
              <div className="max-w-[680px] mx-auto w-full">
                <div id="script-editor-container" className={`w-full relative ${isDark ? 'bg-[#1C1C1E] border border-white/5 shadow-[0_8px_40px_rgba(0,0,0,0.6)]' : 'bg-white border border-gray-200 shadow-xl'} backdrop-blur-[60px] rounded-[2rem] px-8 sm:px-12 md:px-[96px] pt-[96px] pb-[96px] transition-all min-h-[1056px]`}>
                  
                  <div className={`absolute top-0 bottom-0 left-[5px] right-[5px] pointer-events-none ${isDark ? 'page-break-lines-dark' : 'page-break-lines-light'} z-0 rounded-[1.8rem] overflow-hidden`}></div>

                  <div className="w-full mx-auto space-y-0 relative group/editor z-10">
                    {blocks.map((block, index) => (
                      <div key={block.id} className="relative group w-full flex flex-col script-block-container transition-all duration-300" onFocus={() => setActiveBlockId(block.id)}>
                        
                        <div className={`absolute -left-12 sm:-left-16 top-1.5 flex items-center justify-center px-2 py-1 rounded-md transition-all duration-300 ${activeBlockId === block.id ? `opacity-100 scale-100 ${isDark ? 'bg-white/5 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]' : 'bg-gray-100 border border-gray-200 shadow-sm'}` : 'opacity-0 scale-95 group-hover:opacity-40'}`}>
                          {getFormatText(block.type)}
                        </div>

                        <div className="w-full relative flex flex-col">
                          <AutoResizeTextarea
                            value={block.text}
                            className={getBlockStyle(block.type)}
                            placeholder={block.type === BLOCK_TYPES.SCENE ? "INT. LOKASI - WAKTU" : "Ketik di sini..."}
                            onChange={(e) => handleInput(e, block.id, block.type)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={() => {
                              setActiveBlockId(block.id);
                              if (suggestionTargetId !== block.id) { setActiveSuggestions([]); setSuggestionTargetId(null); }
                            }}
                            onSelect={(e) => {
                              selectionRef.current = { id: block.id, start: e.target.selectionStart, end: e.target.selectionEnd };
                            }}
                            ref={(el) => blockRefs.current[block.id] = el}
                          />

                          {/* Autocomplete Menu Pop-up Animasi Mac */}
                          {suggestionTargetId === block.id && activeSuggestions.length > 0 && (
                            <div 
                              className={`absolute z-50 ${isDark ? 'bg-[#1C1C1E]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]' : 'bg-white border-gray-200 shadow-2xl'} backdrop-blur-[50px] border rounded-2xl mt-2 overflow-hidden p-1 origin-top animate-mac-popup`}
                              style={{ top: '100%', left: block.type === BLOCK_TYPES.CHARACTER ? '25%' : '0', width: block.type === BLOCK_TYPES.CHARACTER ? '50%' : '100%', maxWidth: '400px' }}
                            >
                              <ul className="max-h-48 overflow-y-auto py-1 custom-scrollbar">
                                {activeSuggestions.map((sug, i) => (
                                  <li key={i} onMouseDown={(e) => { e.preventDefault(); applySuggestion(sug, block, index); }}
                                    className={`px-4 py-2.5 text-sm cursor-pointer font-mono rounded-xl transition-colors ${i === suggestionIndex ? 'bg-[#0A84FF] text-white' : (isDark ? 'text-white/80 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100')}`}
                                  >
                                    {sug}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* --- MODAL POP-UPS GLOBAL --- */}
      
      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsEditProfileModalOpen(false)}></div>
          <div className={`${isDark ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-3xl w-full max-w-[380px] p-6 relative z-10 shadow-2xl animate-in zoom-in-95 fade-in duration-200 ease-out`}>
            <h3 className="font-semibold text-lg mb-4">Edit Profil Option</h3>
            
            <div className="mb-4">
               <label className={`block text-xs uppercase tracking-widest font-semibold mb-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Nama Menu</label>
               <input 
                 value={editProfileNameInput} 
                 onChange={(e) => setEditProfileNameInput(e.target.value)} 
                 className={`w-full ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl px-4 py-3 outline-none focus:border-[#0A84FF] transition-colors`} 
                 placeholder="Contoh: Menu Option" 
               />
            </div>
            
            <div className="mb-6">
               <div className="flex flex-col max-h-72 overflow-y-auto custom-scrollbar pr-2 pb-2 overscroll-none">
                 
                 {/* Ikon Datar (Solid Vector) */}
                 <label className={`block text-xs uppercase tracking-widest font-semibold mb-2 mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Ikon Solid (Datar)</label>
                 <div className="grid grid-cols-6 gap-2 mb-4 text-[#0A84FF]">
                   {PROFILE_SOLID.map(solidStr => (
                     <div 
                       key={solidStr} 
                       onClick={() => setEditProfileIconInput(solidStr)}
                       className={`cursor-pointer rounded-xl w-10 h-10 flex items-center justify-center transition-all ${editProfileIconInput === solidStr ? 'bg-[#0A84FF]/20 ring-2 ring-[#0A84FF]' : (isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200')}`}
                     >
                       <div className="w-5 h-5 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                         <SafeIcon iconStr={solidStr} />
                       </div>
                     </div>
                   ))}
                 </div>

                 {/* Ikon 3D dan Emoji */}
                 <label className={`block text-xs uppercase tracking-widest font-semibold mb-2 mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>3D Animated Style</label>
                 <div className="grid grid-cols-6 gap-2 mb-4">
                   {PROFILE_ICONS_3D.map((iconUrl, idx) => (
                     <div 
                       key={idx} 
                       onClick={() => setEditProfileIconInput(iconUrl)}
                       className={`cursor-pointer rounded-xl w-10 h-10 flex items-center justify-center transition-all ${editProfileIconInput === iconUrl ? 'bg-[#0A84FF]/20 ring-2 ring-[#0A84FF]' : (isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200')}`}
                     >
                       <img src={iconUrl} alt="3D Icon" className="w-7 h-7 object-contain drop-shadow-md hover:scale-110 transition-transform duration-200" />
                     </div>
                   ))}
                 </div>

               </div>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => setIsEditProfileModalOpen(false)} className={`flex-1 py-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/80' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} font-medium transition-all active:scale-95`}>Batal</button>
              <button onClick={handleSaveProfile} className="flex-1 py-3 rounded-xl bg-[#0A84FF] hover:bg-[#007AFF] text-white font-medium transition-all active:scale-95">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}></div>
          <div className={`${isDark ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-3xl w-full max-w-sm p-6 sm:p-8 relative z-10 shadow-2xl animate-in zoom-in-95 fade-in duration-200 ease-out text-center`}>
            <h3 className="font-semibold text-xl mb-2">{confirmDialog.title}</h3>
            <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{confirmDialog.message}</p>
            <div className="flex space-x-3">
              <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className={`flex-1 py-3.5 rounded-2xl ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} font-medium transition-all duration-200 active:scale-95 text-sm`}>Batal</button>
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({ ...confirmDialog, isOpen: false }); }} className={`flex-1 py-3.5 rounded-2xl font-medium transition-all duration-200 active:scale-95 text-sm ${confirmDialog.isDestructive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#0A84FF] hover:bg-[#007AFF] text-white'}`}>
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsNewFolderModalOpen(false)}></div>
          <div className={`${isDark ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-3xl w-full max-w-sm p-6 relative z-10 shadow-2xl animate-in zoom-in-95 fade-in duration-200 ease-out`}>
            <h3 className="font-semibold text-lg mb-4">Nama Folder Baru</h3>
            <input 
              autoFocus 
              value={newFolderName} 
              onChange={(e) => setNewFolderName(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolderSubmit(); }}
              className={`w-full ${isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl px-4 py-3 mb-6 outline-none focus:border-[#0A84FF] transition-colors`} 
              placeholder="Ketik nama folder..." 
            />
            <div className="flex space-x-3">
              <button onClick={() => setIsNewFolderModalOpen(false)} className={`flex-1 py-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/80' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} font-medium transition-all active:scale-95`}>Batal</button>
              <button onClick={handleCreateFolderSubmit} className="flex-1 py-3 rounded-xl bg-[#0A84FF] hover:bg-[#007AFF] text-white font-medium transition-all active:scale-95">Buat Folder</button>
            </div>
          </div>
        </div>
      )}

      {/* Action Menu Pop-up */}
      {isActionMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200" onClick={() => setIsActionMenuOpen(false)}></div>
          <div className={`fixed bottom-0 inset-x-0 rounded-t-[2rem] sm:inset-y-0 sm:right-0 sm:left-auto sm:w-80 sm:rounded-none ${isDark ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} sm:border-l border-t z-[101] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-200 ease-out`}>
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold">Aksi Lanjutan</h2>
              <button onClick={() => setIsActionMenuOpen(false)} className={`p-2 -mr-2 ${isDark ? 'text-white/50 hover:text-white bg-white/5' : 'text-gray-400 hover:text-gray-900 bg-gray-100'} rounded-full transition-all active:scale-95`}><X size={18}/></button>
            </div>
            
            <div className="space-y-2 overflow-y-auto max-h-[70vh] custom-scrollbar pr-2">
              
              {!isFolderSelected && (
                <>
                  <button onClick={handleShareSelected} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/90' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'} transition-all active:scale-[0.98] text-sm`}>
                    <Share2 size={18} className="text-[#32D74B]" /> <span>Bagikan Tautan</span>
                  </button>
                  <button onClick={duplicateSelected} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/90' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'} transition-all active:scale-[0.98] text-sm`}>
                    <Copy size={18} className="text-[#0A84FF]" /> <span>Duplikat</span>
                  </button>
                  <button onClick={() => { setIsActionMenuOpen(false); setIsMoveMenuOpen(true); }} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/90' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'} transition-all active:scale-[0.98] text-sm mb-4`}>
                    <MoveRight size={18} className="text-[#BF5AF2]" /> <span>Pindahkan ke...</span>
                  </button>
                </>
              )}

              {isFolderSelected && (
                <div className={`text-center py-4 text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                  Pilihan mengandung Folder. Aksi duplikat atau pindah hanya bisa dilakukan untuk Naskah.
                </div>
              )}

              {selectedItems.length === 1 && !isFolderSelected && (
                <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} space-y-2 mt-4`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 px-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Menu Eksport</p>
                  <button onClick={() => { const s = scriptsList.find(x => x.id === selectedItems[0]); if(s) exportPDF(); }} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/90' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'} transition-all active:scale-[0.98] text-sm`}>
                    <Download size={18} className="text-[#FF453A]" /> <span>Eksport PDF</span>
                  </button>
                  <button onClick={() => { const s = scriptsList.find(x => x.id === selectedItems[0]); if(s) exportFDX(); }} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/90' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'} transition-all active:scale-[0.98] text-sm`}>
                    <FileText size={18} className="text-[#0A84FF]" /> <span>Eksport Final Draft (.fdx)</span>
                  </button>
                  <button onClick={() => { const s = scriptsList.find(x => x.id === selectedItems[0]); if(s) exportTXT(); }} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/90' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'} transition-all active:scale-[0.98] text-sm`}>
                    <LayoutTemplate size={18} className={isDark ? 'text-white/70' : 'text-gray-500'} /> <span>Eksport Plain Text (.txt)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Move Menu Modal */}
      {isMoveMenuOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsMoveMenuOpen(false)}></div>
          <div className={`${isDark ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-3xl w-full max-w-sm p-6 relative z-10 shadow-2xl animate-in zoom-in-95 fade-in duration-200 ease-out`}>
            <h3 className="font-semibold text-lg mb-4">Pindahkan ke Folder</h3>
            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-2">
               <button onClick={() => moveItemsToFolder(selectedItems, null).then(() => { setIsMoveMenuOpen(false); setSelectedItems([]); setSelectionMode(false); })} className={`w-full text-left px-4 py-3.5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/80' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'} text-sm flex items-center space-x-3 transition-all active:scale-95`}>
                 <Folder size={18} className={isDark ? 'text-white/30' : 'text-gray-400'} /> <span>Tanpa Folder (Semua Proyek)</span>
               </button>
               {folderItems.map(f => (
                 <button key={f.id} onClick={() => moveItemsToFolder(selectedItems, f.id).then(() => { setIsMoveMenuOpen(false); setSelectedItems([]); setSelectionMode(false); })} className={`w-full text-left px-4 py-3.5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/90' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'} text-sm flex items-center space-x-3 transition-all active:scale-95`}>
                   <div className="w-5 text-center flex justify-center text-[#0A84FF]">
                     {f.icon && f.icon !== "" ? <span className="text-lg leading-none"><SafeIcon iconStr={f.icon} /></span> : <Folder size={18} className="text-[#0A84FF]" />}
                   </div>
                   <span>{f.name}</span>
                 </button>
               ))}
            </div>
            <button onClick={() => setIsMoveMenuOpen(false)} className={`mt-4 w-full py-3 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-xl text-sm font-medium transition-all active:scale-95`}>Batal</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        html, body { 
          overflow: hidden; 
          height: 100vh;
          width: 100vw;
        }

        .pureref-bg.dark {
          background-color: #0A0A0A;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px);
          background-size: 24px 24px;
        }

        .pureref-bg.light {
          background-color: #F9FAFB;
          background-image: radial-gradient(rgba(0, 0, 0, 0.04) 1.5px, transparent 1.5px);
          background-size: 24px 24px;
        }

        /* Scrollbar untuk Dark Mode (Dikembalikan seperti v.02) */
        .dark ::-webkit-scrollbar { width: 8px; height: 8px; background-color: #121212; }
        .dark ::-webkit-scrollbar-track { background-color: #121212; }
        .dark ::-webkit-scrollbar-thumb { background-color: rgba(120, 120, 120, 0.3); border-radius: 10px; }
        .dark ::-webkit-scrollbar-thumb:hover { background-color: rgba(120, 120, 120, 0.5); }
        .dark * { scrollbar-width: thin; scrollbar-color: rgba(120, 120, 120, 0.3) #121212; }

        /* Scrollbar untuk Light Mode */
        .light ::-webkit-scrollbar { width: 8px; height: 8px; background-color: transparent; }
        .light ::-webkit-scrollbar-track { background-color: transparent; }
        .light ::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
        .light ::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 0, 0, 0.3); }
        .light * { scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.15) transparent; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; background-color: transparent; }
        .dark .custom-scrollbar::-webkit-scrollbar-track { background-color: transparent; }
        .light .custom-scrollbar::-webkit-scrollbar-track { background-color: transparent; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); }
        .light .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.2); }

        @font-face {
          font-family: 'Agnes-Regular';
          src: url('/Agnes-Regular.otf') format('opentype');
        }
        .script-title-text { font-family: 'Agnes-Regular', monospace; }

        @import url('https://fonts.googleapis.com/css2?family=Fanwood+Text:ital@0;1&display=swap');

        .font-fanwood {
          font-family: 'Fanwood Text', serif;
        }

        .mymind-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
        @media (min-width: 640px) { .mymind-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); } }

        .folder-card {
          transition: all 0.2s ease-out;
          transform-origin: center center;
          will-change: transform, box-shadow;
        }
        
        /* HOVER EFFECT DIPERHALUS (V.03) */
        .mymind-grid:has(.folder-card:hover) .folder-card:not(:hover) {
          transform: scale(0.98);
          opacity: 0.7;
        }

        .folder-card:hover {
          transform: scale(1.02) translateY(-2px);
          z-index: 20;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .page-break-lines-dark {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 1054px,
            rgba(255, 255, 255, 0.15) 1054px,
            rgba(255, 255, 255, 0.15) 1056px
          );
        }

        .page-break-lines-light {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 1054px,
            rgba(0, 0, 0, 0.15) 1054px,
            rgba(0, 0, 0, 0.15) 1056px
          );
        }

        /* --- ANIMASI MAC OS POP-UP --- */
        @keyframes macPopUp {
          0% { opacity: 0; transform: scale(0.9) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-mac-popup {
          animation: macPopUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards;
          will-change: transform, opacity;
        }
        .origin-top-right { transform-origin: top right; }
        .origin-top { transform-origin: top center; }

        /* --- ANIMASI SLIDE NAVIGASI ALA iOS --- */
        @keyframes slideForward {
          0% { opacity: 0; transform: translateX(40px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideBackward {
          0% { opacity: 0; transform: translateX(-40px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-forward {
          animation: slideForward 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          will-change: transform, opacity;
        }
        .animate-slide-backward {
          animation: slideBackward 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          will-change: transform, opacity;
        }
      `}} />
    </div>
  );
}