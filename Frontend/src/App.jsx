import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";

/* ─────────────────────────────────────────────
   GLOBAL STYLES  — Cream · Teal · Champagne
───────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@200;300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:      #FAF7F2;
      --cream2:     #F3EEE5;
      --cream3:     #EDE5D8;
      --parchment:  #E8DFD0;
      --teal:       #1B6B6B;
      --teal-light: #2A8C8C;
      --teal-dark:  #0F4444;
      --teal-pale:  #E8F4F4;
      --champagne:  #C8A96A;
      --champ-lt:   #E2C88A;
      --champ-dk:   #9E7A3E;
      --ink:        #1A1A2E;
      --ink2:       #2D2D40;
      --slate:      #5A5A72;
      --mist:       #9898A8;
      --white:      #FFFFFF;
      --shadow-sm:  0 4px 24px rgba(27,107,107,0.10);
      --shadow-md:  0 12px 48px rgba(27,107,107,0.16);
      --shadow-lg:  0 30px 80px rgba(27,107,107,0.22);
      --font-d:     'Playfair Display', Georgia, serif;
      --font-b:     'DM Sans', system-ui, sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--cream);
      color: var(--ink);
      font-family: var(--font-b);
      font-weight: 300;
      overflow-x: hidden;
      cursor: none;
    }

    /* ── Custom cursor ── */
    #cursor-dot {
      width: 8px; height: 8px;
      background: var(--teal);
      border-radius: 50%;
      position: fixed;
      top: 0; left: 0;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%,-50%);
      transition: background 0.3s, transform 0.15s;
      mix-blend-mode: multiply;
    }
    #cursor-ring {
      width: 36px; height: 36px;
      border: 1.5px solid var(--teal);
      border-radius: 50%;
      position: fixed;
      top: 0; left: 0;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%,-50%);
      transition: width 0.4s, height 0.4s, border-color 0.3s, opacity 0.3s;
      opacity: 0.6;
    }
    body:has(a:hover) #cursor-ring,
    body:has(button:hover) #cursor-ring {
      width: 56px; height: 56px;
      border-color: var(--champagne);
      opacity: 1;
    }
    body:has(a:hover) #cursor-dot,
    body:has(button:hover) #cursor-dot {
      background: var(--champagne);
      transform: translate(-50%,-50%) scale(1.5);
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--cream2); }
    ::-webkit-scrollbar-thumb { background: linear-gradient(var(--teal), var(--champagne)); border-radius: 3px; }

    /* ── Typography ── */
    .display-xl {
      font-family: var(--font-d);
      font-size: clamp(56px, 8vw, 120px);
      font-weight: 400;
      line-height: 0.92;
      letter-spacing: -1px;
      color: var(--ink);
    }
    .display-xl em { font-style: italic; color: var(--teal); }

    .display-lg {
      font-family: var(--font-d);
      font-size: clamp(38px, 5vw, 72px);
      font-weight: 400;
      line-height: 1.08;
      color: var(--ink);
    }
    .display-lg em { font-style: italic; color: var(--teal); }

    .eyebrow {
      font-family: var(--font-b);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: var(--champagne);
    }

    .body-lg { font-size: 16px; font-weight: 300; color: var(--slate); line-height: 1.85; }
    .body-sm { font-size: 13px; font-weight: 300; color: var(--mist); line-height: 1.75; }

    /* ── Buttons ── */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      background: var(--teal);
      color: var(--white);
      font-family: var(--font-b);
      font-size: 11px; font-weight: 600;
      letter-spacing: 2.5px; text-transform: uppercase;
      padding: 16px 36px; border: none; cursor: none;
      position: relative; overflow: hidden;
      transition: all 0.5s cubic-bezier(0.23,1,0.32,1);
      text-decoration: none;
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--teal-light);
      transform: translateX(-100%);
      transition: transform 0.5s cubic-bezier(0.23,1,0.32,1);
    }
    .btn-primary:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
    .btn-primary:hover::before { transform: translateX(0); }
    .btn-primary span { position: relative; z-index: 1; }

    .btn-champ {
      display: inline-flex; align-items: center; gap: 10px;
      background: linear-gradient(135deg, var(--champagne), var(--champ-dk));
      color: var(--white);
      font-family: var(--font-b);
      font-size: 11px; font-weight: 600;
      letter-spacing: 2.5px; text-transform: uppercase;
      padding: 16px 36px; border: none; cursor: none;
      position: relative; overflow: hidden;
      transition: all 0.5s cubic-bezier(0.23,1,0.32,1);
      text-decoration: none;
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    }
    .btn-champ:hover { box-shadow: 0 16px 48px rgba(200,169,106,0.45); transform: translateY(-3px); }
    .btn-champ span { position: relative; z-index: 1; }

    .btn-outline-teal {
      display: inline-flex; align-items: center; gap: 10px;
      background: transparent;
      color: var(--teal);
      font-family: var(--font-b);
      font-size: 11px; font-weight: 600;
      letter-spacing: 2.5px; text-transform: uppercase;
      padding: 15px 35px;
      border: 1.5px solid var(--teal);
      cursor: none;
      transition: all 0.4s;
      text-decoration: none;
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    }
    .btn-outline-teal:hover {
      background: var(--teal);
      color: var(--white);
      box-shadow: var(--shadow-sm);
    }

    /* ── Divider ── */
    .champ-line {
      width: 48px; height: 2px;
      background: linear-gradient(90deg, var(--champagne), var(--champ-lt));
      display: block; margin: 16px 0;
    }
    .champ-line.center { margin: 16px auto; }

    /* ── Cards ── */
    .glass-card {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(200,169,106,0.2);
      box-shadow: var(--shadow-sm);
      transition: all 0.6s cubic-bezier(0.23,1,0.32,1);
    }
    .glass-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-10px);
      border-color: rgba(200,169,106,0.45);
    }

    /* ── Nav ── */
    .nav-link {
      font-family: var(--font-b);
      font-size: 11px; font-weight: 500;
      letter-spacing: 2px; text-transform: uppercase;
      color: var(--ink2);
      text-decoration: none;
      position: relative;
      padding-bottom: 4px;
      transition: color 0.3s;
      cursor: none;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 0; height: 1.5px;
      background: var(--champagne);
      transition: width 0.35s cubic-bezier(0.23,1,0.32,1);
    }
    .nav-link:hover { color: var(--teal); }
    .nav-link:hover::after { width: 100%; }

    /* ── Form ── */
    .f-label {
      display: block;
      font-size: 10px; font-weight: 600;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: var(--teal); margin-bottom: 8px;
    }
    .f-input, .f-select {
      width: 100%;
      background: rgba(255,255,255,0.9);
      border: 1.5px solid var(--parchment);
      color: var(--ink);
      font-family: var(--font-b);
      font-size: 14px; font-weight: 300;
      padding: 14px 18px;
      transition: all 0.3s;
      outline: none;
      -webkit-appearance: none;
    }
    .f-input:focus, .f-select:focus {
      border-color: var(--teal);
      background: var(--white);
      box-shadow: 0 0 0 4px rgba(27,107,107,0.08);
    }
    .f-input::placeholder { color: var(--mist); }
    .f-select option { background: var(--white); color: var(--ink); }

    /* ── Floating particles ── */
    @keyframes floatA {
      0%,100% { transform: translateY(0px) rotate(0deg); opacity:0.4; }
      33% { transform: translateY(-28px) rotate(8deg); opacity:0.7; }
      66% { transform: translateY(-14px) rotate(-4deg); opacity:0.5; }
    }
    @keyframes floatB {
      0%,100% { transform: translateY(0px) rotate(0deg); opacity:0.3; }
      50% { transform: translateY(-40px) rotate(-10deg); opacity:0.6; }
    }
    @keyframes floatC {
      0%,100% { transform: translateY(0) translateX(0); opacity:0.25; }
      25% { transform: translateY(-20px) translateX(10px); opacity:0.5; }
      75% { transform: translateY(-35px) translateX(-8px); opacity:0.4; }
    }
    @keyframes driftRight {
      0% { transform: translateX(-60px) rotate(-5deg); opacity:0; }
      10% { opacity:1; }
      90% { opacity:1; }
      100% { transform: translateX(60px) rotate(5deg); opacity:0; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulseRing {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes shimmerSweep {
      0% { background-position: -400% center; }
      100% { background-position: 400% center; }
    }
    .shimmer {
      background: linear-gradient(90deg, var(--champagne) 0%, var(--champ-lt) 40%, var(--champagne) 60%, var(--champ-dk) 100%);
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmerSweep 4s linear infinite;
    }

    /* ── Diagonal section ── */
    .diagonal-top {
      clip-path: polygon(0 6%, 100% 0, 100% 100%, 0 100%);
      margin-top: -4%;
      padding-top: 8%;
    }
    .diagonal-both {
      clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
      margin: -3% 0;
      padding: 10% 0;
    }

    /* ── Loading dots ── */
    .ldot { display:inline-block; width:6px; height:6px; border-radius:50%; background:currentColor; margin:0 3px; animation:ldBounce 1.2s infinite; }
    .ldot:nth-child(2){animation-delay:.2s} .ldot:nth-child(3){animation-delay:.4s}
    @keyframes ldBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }

    /* ── Room price tag ── */
    .price-tag {
      display: inline-flex; flex-direction:column; align-items:flex-end;
      background: var(--teal);
      color: var(--white);
      padding: 10px 16px;
      clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
    }

    /* ── Marquee ── */
    @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
    .marquee-inner { display:flex; animation: marquee 22s linear infinite; white-space:nowrap; }
    .marquee-inner:hover { animation-play-state:paused; }

    /* ── Modal ── */
    .modal-wrap {
      position:fixed; inset:0;
      background: rgba(250,247,242,0.65);
      backdrop-filter: blur(16px);
      z-index: 800;
      display:flex; align-items:center; justify-content:center;
      padding: 20px;
      overflow-y: auto;
    }

    /* ── Success ── */
    @keyframes successIn { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
    .success-bounce { animation: successIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
  `}</style>
);

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let rx = 0,
      ry = 0;
    const onMove = (e) => {
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
      rx += (e.clientX - rx) * 0.18;
      ry += (e.clientY - ry) * 0.18;
      if (ring.current) {
        ring.current.style.left = rx + "px";
        ring.current.style.top = ry + "px";
      }
    };
    let raf;
    const tick = () => {
      if (ring.current) {
        ring.current.style.left = rx + "px";
        ring.current.style.top = ry + "px";
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", (e) => {
      rx = e.clientX;
      ry = e.clientY;
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top = e.clientY + "px";
      }
    });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div id="cursor-dot" ref={dot} />
      <div id="cursor-ring" ref={ring} />
    </>
  );
};

/* ─────────────────────────────────────────────
   FLOATING PARTICLES BACKGROUND
───────────────────────────────────────────── */
const Particles = ({ count = 18, color = "var(--teal)", style = {} }) => {
  const shapes = ["circle", "diamond", "line"];
  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    shape: shapes[i % 3],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 14,
    delay: Math.random() * 8,
    dur: 6 + Math.random() * 8,
    anim: ["floatA", "floatB", "floatC"][i % 3],
  }));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {items.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.shape === "line" ? `${p.size * 4}px` : `${p.size}px`,
            height: p.shape === "line" ? "1.5px" : `${p.size}px`,
            borderRadius:
              p.shape === "circle"
                ? "50%"
                : p.shape === "diamond"
                  ? "2px"
                  : "0",
            background: color,
            opacity: 0.18,
            transform: p.shape === "diamond" ? "rotate(45deg)" : "none",
            animation: `${p.anim} ${p.dur}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const HOTEL = {
  name: "Hotel Frontier",
  tagline: "Where Heritage Meets Modern Luxury",
  city: "Kota, Rajasthan",
  phone: "+91 98765 43210",
  email: "reservations@hotelfrontier.com",
  address: "Station Road, Near Railway Station, Kota, Rajasthan 324001",
  heroImages: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=90",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=90",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=90",
  ],
  stats: [
    { num: "120+", label: "Luxury Rooms" },
    { num: "15", label: "Years of Excellence" },
    { num: "50K+", label: "Happy Guests" },
    { num: "4.9★", label: "Avg. Rating" },
  ],
  rooms: [
    {
      id: "deluxe",
      name: "Deluxe Room",
      price: "₹3,499",
      per: "night",
      img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      tags: ["King Bed", "City View", "Wi-Fi", "Mini Bar"],
      desc: "Elegantly appointed with plush furnishings and breathtaking city panoramas.",
    },
    {
      id: "suite",
      name: "Premium Suite",
      price: "₹6,999",
      per: "night",
      img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      tags: ["King Bed", "Living Area", "Jacuzzi", "Butler"],
      desc: "Spacious luxury with a separate living area and an in-suite marble Jacuzzi.",
    },
    {
      id: "royal",
      name: "Royal Suite",
      price: "₹12,999",
      per: "night",
      img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      tags: ["Presidential Bed", "Private Lounge", "Spa Bath", "24/7 Butler"],
      desc: "The pinnacle of opulence — a regal sanctuary crafted for discerning guests.",
    },
  ],
  facilities: [
    {
      id: "dining",
      icon: "🍽",
      title: "Fine Dining",
      img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      desc: "Multi-cuisine restaurant with Indian, Continental & Rajasthani specialties by award-winning chefs.",
    },
    {
      id: "banquet",
      icon: "🎊",
      title: "Grand Banquet",
      img: "https://res.cloudinary.com/dhscwstkl/image/upload/f_auto,q_auto/v1771128509/tivoli-hotels/migrated/tivolilotuscourt/banner-images-Lotus-court/Lotus-Court.jpg",
      desc: "Magnificent event spaces for weddings & corporate galas — up to 500 guests.",
    },
    {
      id: "spa",
      icon: "💆",
      title: "Luxury Spa",
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      desc: "Ayurvedic therapies & modern wellness rituals in a sanctuary of calm.",
    },
    {
      id: "pool",
      icon: "🏊",
      title: "Rooftop Pool",
      img: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80",
      desc: "Infinity pool with sweeping skyline views — the jewel of our rooftop.",
    },
  ],
  amenities: [
    { icon: "📶", name: "High-Speed Wi-Fi" },
    { icon: "🚗", name: "Valet Parking" },
    { icon: "❄️", name: "Climate Control" },
    { icon: "🛎", name: "24×7 Room Service" },
    { icon: "🔒", name: "CCTV Security" },
    { icon: "🏋️", name: "Fitness Center" },
    { icon: "🚁", name: "Airport Transfer" },
    { icon: "🧖", name: "Spa & Wellness" },
    { icon: "📺", name: "Smart TV" },
    { icon: "🍳", name: "In-Room Dining" },
    { icon: "🌐", name: "Multilingual Staff" },
    { icon: "💊", name: "Doctor on Call" },
  ],
  attractions: [
    {
      name: "Seven Wonders Park",
      dist: "2.1 km",
      img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
      desc: "Full-scale replicas of the Seven Wonders — a landmark of Kota.",
    },
    {
      name: "Chambal Garden",
      dist: "3.5 km",
      img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      desc: "Serene riverside garden along the tranquil Chambal River.",
    },
    {
      name: "Garadia Mahadev",
      dist: "18 km",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      desc: "Clifftop temple with dramatic views over the Chambal gorge.",
    },
  ],
  testimonials: [
    {
      name: "Priya Sharma",
      role: "Honeymooner",
      text: "Absolutely magical — the Royal Suite exceeded every dream. We'll celebrate every anniversary here.",
      stars: 5,
      avatar: "PS",
    },
    {
      name: "Rahul Mehta",
      role: "Business Traveler",
      text: "The perfect blend of luxury and efficiency. Conference facilities are world-class, staff impeccable.",
      stars: 5,
      avatar: "RM",
    },
    {
      name: "Sunita Agarwal",
      role: "Family Vacation",
      text: "Kids adored the pool; we fell in love with the fine dining. Best family trip in years.",
      stars: 5,
      avatar: "SA",
    },
  ],
  marqueeItems: [
    "Luxury Rooms",
    "Fine Dining",
    "Rooftop Pool",
    "Grand Banquet",
    "Ayurvedic Spa",
    "Airport Transfer",
    "24×7 Service",
    "Kota's Finest Hotel",
  ],
};

/* ─────────────────────────────────────────────
   MOTION HELPERS
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
  },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] },
  },
};
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] },
  },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
  },
};

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = ({ openBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 70);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        padding: scrolled ? "14px 56px" : "26px 56px",
        background: scrolled ? "rgba(250,247,242,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,169,106,0.2)" : "none",
        boxShadow: scrolled ? "0 4px 32px rgba(27,107,107,0.08)" : "none",
        transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "22px",
            fontWeight: 500,
            color: scrolled ? "var(--ink)" : "var(--white)",
            letterSpacing: "0.5px",
            lineHeight: 1,
          }}
        >
          Hotel{" "}
          <em style={{ fontStyle: "italic", color: "var(--champagne)" }}>
            Frontier
          </em>
        </span>
        <span
          style={{
            fontSize: "8px",
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: "var(--champagne)",
            fontFamily: "var(--font-b)",
            fontWeight: 600,
          }}
        >
          Kota · Rajasthan
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        {[
          ["home", "Home"],
          ["rooms", "Rooms"],
          ["facilities", "Facilities"],
          ["amenities", "Amenities"],
          ["attractions", "Explore"],
          ["contact", "Contact"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="nav-link"
            style={{
              color: scrolled ? "var(--ink2)" : "rgba(255,255,255,0.88)",
            }}
          >
            {label}
          </a>
        ))}
        <button className="btn-champ" onClick={openBooking}>
          <span>Book Now</span>
          <span style={{ fontSize: "14px" }}>→</span>
        </button>
      </div>
    </motion.nav>
  );
};

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
const Hero = ({ openBooking }) => {
  const [cur, setCur] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const t = setInterval(
      () => setCur((c) => (c + 1) % HOTEL.heroImages.length),
      5500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="home"
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {/* Parallax BG images */}
      <motion.div style={{ y, position: "absolute", inset: "-20%", top: 0 }}>
        {HOTEL.heroImages.map((img, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === cur ? 1 : 0,
              transition: "opacity 1.8s ease",
              transform: i === cur ? "scale(1.06)" : "scale(1)",
              transitionProperty: "opacity,transform",
              transitionDuration: "7s,7s",
            }}
          />
        ))}
      </motion.div>

      {/* Gradient overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,30,30,0.55) 0%, rgba(10,30,30,0.25) 50%, rgba(10,30,30,0.7) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Decorative corners */}
      {[
        ["top:80px", "left:56px", "borderTop", "borderLeft"],
        ["top:80px", "right:56px", "borderTop", "borderRight"],
        ["bottom:80px", "left:56px", "borderBottom", "borderLeft"],
        ["bottom:80px", "right:56px", "borderBottom", "borderRight"],
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...Object.fromEntries(c.slice(0, 2).map((s) => s.split(":"))),
            width: "52px",
            height: "52px",
            [c[2]]: "1px solid rgba(200,169,106,0.55)",
            [c[3]]: "1px solid rgba(200,169,106,0.55)",
          }}
        />
      ))}

      {/* Floating particles on hero */}
      <Particles count={14} color="rgba(200,169,106,0.6)" />

      {/* Content */}
      <motion.div
        style={{
          opacity,
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div
            className="eyebrow"
            style={{
              color: "var(--champ-lt)",
              marginBottom: "24px",
              display: "block",
            }}
            initial={{ opacity: 0, letterSpacing: "12px" }}
            animate={{ opacity: 1, letterSpacing: "4px" }}
            transition={{ duration: 1.5, delay: 0.4 }}
          >
            ✦ Est. 2009 · Kota, Rajasthan ✦
          </motion.div>

          <h1
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(64px, 10vw, 140px)",
              fontWeight: 400,
              color: "var(--white)",
              lineHeight: 0.9,
              letterSpacing: "-2px",
              marginBottom: "0",
            }}
          >
            Hotel
          </h1>
          <h1
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(64px, 10vw, 140px)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 0.9,
              letterSpacing: "-2px",
              marginBottom: "28px",
            }}
            className="shimmer"
          >
            Frontier
          </h1>

          <div
            style={{
              width: "60px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, var(--champagne), transparent)",
              margin: "0 auto 24px",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-b)",
              fontSize: "clamp(13px, 1.4vw, 16px)",
              fontWeight: 300,
              letterSpacing: "3px",
              color: "rgba(255,255,255,0.78)",
              textTransform: "uppercase",
              marginBottom: "48px",
              maxWidth: "600px",
            }}
          >
            {HOTEL.tagline}
          </p>

          <motion.div
            style={{
              display: "flex",
              gap: "18px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <button className="btn-champ" onClick={openBooking}>
              <span>Reserve Your Stay</span>
              <span>→</span>
            </button>
            <a
              href="#rooms"
              className="btn-outline-teal"
              style={{
                borderColor: "rgba(255,255,255,0.5)",
                color: "var(--white)",
              }}
            >
              Explore Rooms
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Slide dots */}
      <div
        style={{
          position: "absolute",
          bottom: "48px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 20,
        }}
      >
        {HOTEL.heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            style={{
              width: i === cur ? "36px" : "8px",
              height: "2px",
              background:
                i === cur ? "var(--champagne)" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "none",
              transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        style={{
          position: "absolute",
          bottom: "48px",
          right: "56px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontSize: "8px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "52px",
            background:
              "linear-gradient(to bottom, rgba(200,169,106,0.8), transparent)",
          }}
        />
      </motion.div>

      {/* Wave bottom */}
      <div
        style={{
          position: "absolute",
          bottom: -2,
          left: 0,
          right: 0,
          height: "80px",
        }}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%" }}
        >
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="var(--cream)"
          />
        </svg>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   MARQUEE STRIP
───────────────────────────────────────────── */
const Marquee = () => {
  const items = [...HOTEL.marqueeItems, ...HOTEL.marqueeItems];
  return (
    <div
      style={{
        background: "var(--teal)",
        overflow: "hidden",
        padding: "18px 0",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="marquee-inner">
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "28px",
              padding: "0 28px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.9)",
              whiteSpace: "nowrap",
            }}
          >
            {item}
            <span style={{ color: "var(--champagne)", fontSize: "14px" }}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
const Stats = () => (
  <section
    style={{
      background: "var(--white)",
      borderBottom: "1px solid var(--parchment)",
    }}
  >
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
      }}
    >
      {HOTEL.stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.7 }}
          viewport={{ once: true }}
          style={{
            padding: "52px 32px",
            textAlign: "center",
            borderRight: i < 3 ? "1px solid var(--parchment)" : "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Particles count={4} color="var(--teal)" style={{ opacity: 0.5 }} />
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(38px, 4vw, 58px)",
              fontWeight: 500,
              color: "var(--teal)",
              lineHeight: 1,
              position: "relative",
            }}
          >
            {s.num}
          </div>
          <span className="champ-line center" />
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--mist)",
              fontWeight: 600,
            }}
          >
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
const About = () => (
  <section
    id="about"
    style={{
      padding: "130px 56px",
      background: "var(--cream)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <Particles count={10} color="var(--champagne)" />
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "100px",
        alignItems: "center",
      }}
    >
      {/* Image collage */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeLeft}
        style={{ position: "relative" }}
      >
        <div style={{ position: "relative" }}>
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=80"
            alt="Hotel lobby"
            style={{
              width: "100%",
              height: "540px",
              objectFit: "cover",
              display: "block",
              boxShadow: "var(--shadow-lg)",
            }}
          />
          {/* Accent frame */}
          <div
            style={{
              position: "absolute",
              top: "-18px",
              left: "-18px",
              right: "18px",
              bottom: "18px",
              border: "2px solid var(--teal-pale)",
              zIndex: -1,
            }}
          />
          {/* Floating card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: "-28px",
              right: "-28px",
              background: "var(--white)",
              boxShadow: "var(--shadow-md)",
              padding: "24px 28px",
              textAlign: "center",
              borderTop: "3px solid var(--champagne)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-d)",
                fontSize: "44px",
                fontWeight: 500,
                color: "var(--teal)",
                lineHeight: 1,
              }}
            >
              15+
            </div>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "var(--mist)",
                marginTop: "6px",
                fontWeight: 600,
              }}
            >
              Years of Excellence
            </div>
          </motion.div>
          {/* Small accent image */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 1,
            }}
            style={{
              position: "absolute",
              top: "-32px",
              right: "-32px",
              width: "140px",
              height: "140px",
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              border: "3px solid var(--white)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeRight}
      >
        <div className="eyebrow" style={{ marginBottom: "16px" }}>
          Our Story
        </div>
        <h2 className="display-lg" style={{ marginBottom: "6px" }}>
          A Legacy of
        </h2>
        <h2 className="display-lg" style={{ marginBottom: "24px" }}>
          <em>Finest Hospitality</em>
        </h2>
        <span className="champ-line" />
        <p
          className="body-lg"
          style={{ marginBottom: "20px", marginTop: "8px" }}
        >
          Nestled in the heart of Kota, Hotel Frontier has been the city's most
          distinguished address since 2009. We blend the warmth of Rajasthani
          heritage with contemporary luxury.
        </p>
        <p className="body-lg" style={{ marginBottom: "40px" }}>
          Every detail — from hand-selected linens to curated dining experiences
          — reflects our unwavering commitment to creating memories that endure
          long after departure.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <a href="#rooms" className="btn-primary">
            <span>Explore Rooms</span>
          </a>
          <a href="#facilities" className="btn-outline-teal">
            Our Facilities
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   ROOMS
───────────────────────────────────────────── */
const Rooms = ({ openBooking }) => (
  <section
    id="rooms"
    style={{
      padding: "130px 56px",
      background: "var(--cream2)",
      overflow: "hidden",
      position: "relative",
    }}
    className="diagonal-top"
  >
    <Particles count={8} color="var(--teal)" />
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        style={{ textAlign: "center", marginBottom: "80px" }}
      >
        <div className="eyebrow" style={{ marginBottom: "14px" }}>
          Accommodations
        </div>
        <h2 className="display-lg">
          Choose Your <em>Sanctuary</em>
        </h2>
        <span className="champ-line center" style={{ margin: "18px auto" }} />
        <p className="body-lg" style={{ maxWidth: "520px", margin: "0 auto" }}>
          Three distinct experiences — each a world unto itself.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "28px",
        }}
      >
        {HOTEL.rooms.map((room, idx) => (
          <motion.div
            key={room.id}
            variants={scaleIn}
            className="glass-card"
            style={{
              overflow: "hidden",
              position: "relative",
              background: "var(--white)",
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                height: "260px",
              }}
            >
              <img
                src={room.img}
                alt={room.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.9s cubic-bezier(0.23,1,0.32,1)",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(27,107,107,0.2), transparent)",
                }}
              />
              {/* Price */}
              <div
                className="price-tag"
                style={{ position: "absolute", top: "20px", right: "20px" }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontFamily: "var(--font-d)",
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {room.price}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    opacity: 0.8,
                  }}
                >
                  /{room.per}
                </span>
              </div>
              {/* Number badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "20px",
                  fontFamily: "var(--font-d)",
                  fontSize: "64px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.15)",
                  lineHeight: 1,
                }}
              >
                0{idx + 1}
              </div>
            </div>
            {/* Body */}
            <div style={{ padding: "28px 30px 34px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "26px",
                  fontWeight: 400,
                  color: "var(--ink)",
                  marginBottom: "10px",
                }}
              >
                {room.name}
              </h3>
              <p className="body-sm" style={{ marginBottom: "18px" }}>
                {room.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "24px",
                }}
              >
                {room.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "10px",
                      letterSpacing: "1px",
                      padding: "5px 11px",
                      background: "var(--teal-pale)",
                      color: "var(--teal)",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <button
                className="btn-primary"
                onClick={() => openBooking(room.id)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <span>Book This Room</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   FACILITIES  (Fixed Uniform Grid)
───────────────────────────────────────────── */
const Facilities = () => (
  <section
    id="facilities"
    style={{
      padding: "130px 56px",
      background: "var(--cream)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <Particles count={10} color="var(--teal)" />
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        style={{ textAlign: "center", marginBottom: "80px" }}
      >
        <div className="eyebrow" style={{ marginBottom: "14px" }}>
          World-Class
        </div>
        <h2 className="display-lg">
          Hotel <em>Facilities</em>
        </h2>
        <span className="champ-line center" style={{ margin: "18px auto" }} />
      </motion.div>

      {/* 2×2 uniform grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "3px",
        }}
      >
        {HOTEL.facilities.map((f, i) => (
          <motion.div
            key={f.id}
            variants={fadeUp}
            style={{
              position: "relative",
              overflow: "hidden",
              height: "400px",
              cursor: "default",
            }}
            whileHover="hovered"
          >
            <motion.img
              src={f.img}
              alt={f.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              variants={{ hovered: { scale: 1.08 } }}
              transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            />
            {/* Default overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(15,68,68,0.88) 0%, rgba(15,68,68,0.15) 55%, transparent 100%)",
              }}
            />
            {/* Hover tint */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(200,169,106,0.12)",
                opacity: 0,
              }}
              variants={{ hovered: { opacity: 1 } }}
              transition={{ duration: 0.4 }}
            />
            {/* Content */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "36px",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "30px",
                  fontWeight: 400,
                  color: "var(--white)",
                  marginBottom: "10px",
                }}
              >
                {f.title}
              </h3>
              <motion.p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.7,
                  maxWidth: "380px",
                  overflow: "hidden",
                }}
                initial={{ height: 0, opacity: 0 }}
                variants={{ hovered: { height: "auto", opacity: 1 } }}
                transition={{ duration: 0.4 }}
              >
                {f.desc}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   AMENITIES  (teal band)
───────────────────────────────────────────── */
const Amenities = () => (
  <section
    id="amenities"
    style={{ position: "relative", overflow: "hidden" }}
    className="diagonal-both"
  >
    {/* Teal background with texture */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(135deg, var(--teal-dark) 0%, var(--teal) 50%, var(--teal-light) 100%)",
      }}
    />
    {/* Decorative circles */}
    {[
      { s: 500, op: 0.04, x: "80%", y: "-20%" },
      { s: 300, op: 0.06, x: "-10%", y: "60%" },
      { s: 200, op: 0.08, x: "50%", y: "80%" },
    ].map((c, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: c.s,
          height: c.s,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          left: c.x,
          top: c.y,
          opacity: c.op,
          transform: "translate(-50%,-50%)",
        }}
      />
    ))}
    <Particles count={16} color="rgba(200,169,106,0.5)" />

    <div
      style={{
        position: "relative",
        zIndex: 10,
        padding: "130px 56px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        style={{ textAlign: "center", marginBottom: "80px" }}
      >
        <div
          className="eyebrow"
          style={{ color: "var(--champ-lt)", marginBottom: "14px" }}
        >
          Everything Included
        </div>
        <h2 className="display-lg" style={{ color: "var(--white)" }}>
          Premium <em style={{ color: "var(--champ-lt)" }}>Amenities</em>
        </h2>
        <span className="champ-line center" style={{ margin: "18px auto" }} />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: "1px",
          background: "rgba(255,255,255,0.08)",
        }}
      >
        {HOTEL.amenities.map((a, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            style={{
              padding: "36px 16px",
              textAlign: "center",
              background: "rgba(10,50,50,0.4)",
              backdropFilter: "blur(10px)",
              transition: "all 0.4s",
            }}
            whileHover={{ background: "rgba(200,169,106,0.18)", y: -6 }}
          >
            <div style={{ fontSize: "28px", marginBottom: "14px" }}>
              {a.icon}
            </div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {a.name}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   ATTRACTIONS
───────────────────────────────────────────── */
const Attractions = () => (
  <section
    id="attractions"
    style={{
      padding: "130px 56px",
      background: "var(--cream2)",
      overflow: "hidden",
      position: "relative",
    }}
    className="diagonal-top"
  >
    <Particles count={8} color="var(--champagne)" />
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        style={{ textAlign: "center", marginBottom: "80px" }}
      >
        <div className="eyebrow" style={{ marginBottom: "14px" }}>
          Explore Kota
        </div>
        <h2 className="display-lg">
          Nearby <em>Attractions</em>
        </h2>
        <span className="champ-line center" style={{ margin: "18px auto" }} />
        <p className="body-lg" style={{ maxWidth: "500px", margin: "0 auto" }}>
          Step outside and discover the rich cultural tapestry of Kota.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "24px",
        }}
      >
        {HOTEL.attractions.map((a, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            className="glass-card"
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                overflow: "hidden",
                height: "240px",
                position: "relative",
              }}
            >
              <img
                src={a.img}
                alt={a.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.9s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "var(--teal)",
                  color: "var(--white)",
                  padding: "5px 12px",
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                📍 {a.dist}
              </div>
            </div>
            <div
              style={{ padding: "24px 28px 30px", background: "var(--white)" }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "22px",
                  fontWeight: 400,
                  color: "var(--ink)",
                  marginBottom: "10px",
                }}
              >
                {a.name}
              </h3>
              <p className="body-sm">{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
const Testimonials = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % HOTEL.testimonials.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);
  const t = HOTEL.testimonials[active];

  return (
    <section
      style={{
        padding: "130px 56px",
        background: "var(--white)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Big decorative quote */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-d)",
          fontSize: "280px",
          fontWeight: 700,
          color: "var(--teal-pale)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        "
      </div>
      <Particles count={10} color="var(--teal)" />

      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          position: "relative",
          zIndex: 5,
          textAlign: "center",
        }}
      >
        <div className="eyebrow" style={{ marginBottom: "14px" }}>
          Guest Voices
        </div>
        <h2 className="display-lg" style={{ marginBottom: "60px" }}>
          What They <em>Say</em>
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--teal), var(--teal-light))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "20px",
                fontFamily: "var(--font-d)",
                fontWeight: 600,
                color: "var(--white)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {t.avatar}
            </div>
            <div
              style={{
                color: "var(--champagne)",
                fontSize: "20px",
                letterSpacing: "4px",
                marginBottom: "20px",
              }}
            >
              {"★".repeat(t.stars)}
            </div>
            <p
              style={{
                fontFamily: "var(--font-d)",
                fontSize: "clamp(18px, 2.2vw, 26px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--ink2)",
                lineHeight: 1.65,
                marginBottom: "32px",
              }}
            >
              "{t.text}"
            </p>
            <div
              style={{
                fontWeight: 600,
                color: "var(--ink)",
                fontSize: "15px",
                letterSpacing: "0.5px",
              }}
            >
              {t.name}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--mist)",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                marginTop: "5px",
              }}
            >
              {t.role}
            </div>
          </motion.div>
        </AnimatePresence>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "48px",
          }}
        >
          {HOTEL.testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "36px" : "8px",
                height: "3px",
                background: i === active ? "var(--teal)" : "var(--parchment)",
                border: "none",
                cursor: "none",
                borderRadius: "2px",
                transition: "all 0.4s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   CTA BANNER
───────────────────────────────────────────── */
const CTA = ({ openBooking }) => (
  <section style={{ position: "relative", overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10,40,40,0.82)",
      }}
    />
    <Particles count={20} color="rgba(200,169,106,0.6)" />

    <div
      style={{
        position: "relative",
        zIndex: 10,
        padding: "120px 56px",
        textAlign: "center",
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div
          className="eyebrow"
          style={{ color: "var(--champ-lt)", marginBottom: "18px" }}
        >
          Limited Availability
        </div>
        <h2
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(42px, 6vw, 86px)",
            fontWeight: 400,
            color: "var(--white)",
            lineHeight: 1,
            marginBottom: "24px",
          }}
        >
          Begin Your
          <br />
          <em style={{ color: "var(--champ-lt)", fontStyle: "italic" }}>
            Extraordinary Stay
          </em>
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.7)",
            maxWidth: "520px",
            margin: "0 auto 48px",
            lineHeight: 1.8,
          }}
        >
          Book directly for the best rates, complimentary breakfast, and
          personalized concierge service.
        </p>
        <div
          style={{
            display: "flex",
            gap: "18px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-champ"
            onClick={openBooking}
            style={{ padding: "18px 48px" }}
          >
            <span>Reserve Now</span>
            <span>→</span>
          </button>
          <a
            href={`tel:${HOTEL.phone}`}
            className="btn-outline-teal"
            style={{
              borderColor: "rgba(255,255,255,0.4)",
              color: "var(--white)",
            }}
          >
            Call Us Directly
          </a>
        </div>
        {/* Pulse rings */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: -1,
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                border: "1px solid rgba(200,169,106,0.3)",
                transform: "translate(-50%,-50%)",
                animation: `pulseRing ${2.5 + n * 0.7}s ${n * 0.5}s ease-out infinite`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = ({ openBooking }) => (
  <footer
    id="contact"
    style={{
      background: "var(--ink)",
      color: "var(--white)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Particles count={12} color="rgba(200,169,106,0.3)" />
    {/* Top wave */}
    <div style={{ height: "60px", overflow: "hidden", marginBottom: "-4px" }}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z"
          fill="var(--cream2)"
        />
      </svg>
    </div>

    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 56px 48px",
        position: "relative",
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "56px",
          marginBottom: "60px",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "30px",
              fontWeight: 400,
              color: "var(--white)",
              marginBottom: "4px",
            }}
          >
            Hotel{" "}
            <em style={{ fontStyle: "italic", color: "var(--champagne)" }}>
              Frontier
            </em>
          </div>
          <div
            style={{
              fontSize: "8px",
              letterSpacing: "5px",
              textTransform: "uppercase",
              color: "var(--champagne)",
              marginBottom: "24px",
              fontWeight: 600,
            }}
          >
            KOTA · RAJASTHAN
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.9,
              maxWidth: "280px",
              marginBottom: "32px",
            }}
          >
            Premium hospitality, modern luxury and timeless elegance in the
            cultural heart of Rajasthan.
          </p>
          <button className="btn-champ" onClick={openBooking}>
            <span>Book Your Stay</span>
          </button>
        </div>

        {/* Links */}
        <div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--champagne)",
              marginBottom: "24px",
              fontWeight: 600,
            }}
          >
            Navigate
          </div>
          {["Home", "Rooms", "Facilities", "Amenities", "Attractions"].map(
            (l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  marginBottom: "13px",
                  transition: "color 0.3s",
                  cursor: "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "var(--champagne)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.5)")
                }
              >
                {l}
              </a>
            ),
          )}
        </div>

        {/* Contact */}
        <div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--champagne)",
              marginBottom: "24px",
              fontWeight: 600,
            }}
          >
            Contact
          </div>
          {[
            [`📞 ${HOTEL.phone}`],
            [`✉️ ${HOTEL.email}`],
            [`📍 ${HOTEL.address}`],
          ].map(([line], i) => (
            <p
              key={i}
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "13px",
                lineHeight: 1.6,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Social */}
        <div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--champagne)",
              marginBottom: "24px",
              fontWeight: 600,
            }}
          >
            Social
          </div>
          {[
            ["Facebook", "🔵"],
            ["Instagram", "🟣"],
            ["Twitter", "🐦"],
            ["YouTube", "🔴"],
          ].map(([name, icon]) => (
            <a
              key={name}
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                marginBottom: "13px",
                transition: "color 0.3s",
                cursor: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--champagne)")}
              onMouseLeave={(e) =>
                (e.target.style.color = "rgba(255,255,255,0.5)")
              }
            >
              {icon} {name}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "28px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} Hotel Frontier. All rights reserved.
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
          Crafted with ♥ in Kota, Rajasthan
        </p>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────
   HELPER CONSTANTS
───────────────────────────────────────────── */
const ROOM_PRICES = { deluxe: 3499, suite: 6999, royal: 12999 };

const calculateTotal = (roomType, checkIn, checkOut, rooms) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  return (ROOM_PRICES[roomType] || 3499) * rooms * nights;
};

/* ─────────────────────────────────────────────
   BOOKING MODAL
───────────────────────────────────────────── */
const BookingModal = ({ onClose, initialRoomType }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [bookingId, setBookingId] = useState("");
  const otpRefs = useRef([]);

  // Notice we use initialRoomType here for the roomType property
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    mobile: "",
    address: "",
    checkIn: "",
    checkOut: "",
    adults: "1",
    children: "0",
    rooms: "1",
    roomType: initialRoomType || "",
    specialRequests: "",
  });

  const set = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const today = new Date().toISOString().split("T")[0];

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!form.roomType) {
      return alert("Please select a Room Type before proceeding.");
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/booking/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const d = await res.json();
      if (d.success) setStep(2);
      else alert(d.message || "Failed to send OTP");
    } catch {
      alert("Server error. Is the backend running?");
    }
    setLoading(false);
  };

  const handleOtp = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp];
    n[i] = val;
    setOtp(n);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus();
  };

  const confirm = async () => {
    if (otp.join("").length < 6) return alert("Enter the complete 6-digit OTP");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp: otp.join("") }),
      });
      const d = await res.json();
      if (d.success) {
        setBookingId(d.bookingId);
        setStep(3);
      } else alert(d.message || "Invalid OTP");
    } catch {
      alert("Server error.");
    }
    setLoading(false);
  };

  return (
    <div
      className="modal-wrap"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        style={{
          background: "var(--white)",
          boxShadow: "var(--shadow-lg)",
          width: "100%",
          maxWidth: step === 3 ? "500px" : "760px",
          maxHeight: "92vh",
          overflowY: "auto",
          position: "relative",
          borderTop: "3px solid var(--champagne)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "32px 44px 28px",
            borderBottom: "1px solid var(--parchment)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--cream)",
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: "6px" }}>
              {step === 1
                ? "Reservation"
                : step === 2
                  ? "Verification"
                  : "Booking Confirmed"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-d)",
                fontSize: "30px",
                fontWeight: 400,
                color: "var(--ink)",
              }}
            >
              {step === 1 ? (
                "Book Your Stay"
              ) : step === 2 ? (
                "Verify Your Email"
              ) : (
                <>
                  <em>Welcome,</em> {form.guestName}!
                </>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "40px",
              height: "40px",
              border: "1.5px solid var(--parchment)",
              background: "none",
              cursor: "none",
              fontSize: "18px",
              color: "var(--slate)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--teal)";
              e.target.style.color = "var(--teal)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "var(--parchment)";
              e.target.style.color = "var(--slate)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={sendOtp} style={{ padding: "36px 44px 44px" }}>
            {/* Progress */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "36px" }}>
              {["Guest Info", "Stay Details", "Preferences"].map((l, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div
                    style={{
                      height: "2px",
                      background:
                        i === 0
                          ? "linear-gradient(90deg,var(--teal),var(--champagne))"
                          : "var(--parchment)",
                      marginBottom: "7px",
                      transition: "background 0.3s",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: i === 0 ? "var(--teal)" : "var(--mist)",
                      fontWeight: 600,
                    }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label className="f-label">Full Name *</label>
                <input
                  className="f-input"
                  name="guestName"
                  value={form.guestName}
                  onChange={set}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="f-label">Email Address *</label>
                <input
                  className="f-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={set}
                  required
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="f-label">Mobile Number *</label>
                <input
                  className="f-input"
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={set}
                  required
                  placeholder="+91 98765 43210"
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="f-label">Home Address</label>
                <input
                  className="f-input"
                  name="address"
                  value={form.address}
                  onChange={set}
                  placeholder="Your address"
                />
              </div>
              <div>
                <label className="f-label">Check-in Date *</label>
                <input
                  className="f-input"
                  type="date"
                  name="checkIn"
                  value={form.checkIn}
                  onChange={set}
                  required
                  min={today}
                />
              </div>
              <div>
                <label className="f-label">Check-out Date *</label>
                <input
                  className="f-input"
                  type="date"
                  name="checkOut"
                  value={form.checkOut}
                  onChange={set}
                  required
                  min={form.checkIn || today}
                />
              </div>
              <div>
                <label className="f-label">Room Type *</label>
                <select
                  className="f-select"
                  name="roomType"
                  value={form.roomType}
                  onChange={set}
                  required
                >
                  <option value="" disabled>
                    — Select a Room —
                  </option>
                  <option value="deluxe">Deluxe Room — ₹3,499/night</option>
                  <option value="suite">Premium Suite — ₹6,999/night</option>
                  <option value="royal">Royal Suite — ₹12,999/night</option>
                </select>
              </div>
              <div>
                <label className="f-label">Number of Rooms</label>
                <select
                  className="f-select"
                  name="rooms"
                  value={form.rooms}
                  onChange={set}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Room" : "Rooms"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="f-label">Adults</label>
                <select
                  className="f-select"
                  name="adults"
                  value={form.adults}
                  onChange={set}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Adult" : "Adults"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="f-label">Children (under 12)</label>
                <select
                  className="f-select"
                  name="children"
                  value={form.children}
                  onChange={set}
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Child" : "Children"}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="f-label">Special Requests</label>
                <textarea
                  className="f-input"
                  name="specialRequests"
                  value={form.specialRequests}
                  onChange={set}
                  rows={3}
                  placeholder="Dietary requirements, room preferences, special occasions…"
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
            {/* Dynamic Estimated Price Display */}
            {form.roomType && form.checkIn && form.checkOut ? (
              <div
                style={{
                  background: "rgba(200,169,106,0.1)",
                  border: "1px solid rgba(200,169,106,0.4)",
                  padding: "18px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "var(--champ-dk)",
                      fontWeight: 700,
                    }}
                  >
                    Estimated Total
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--slate)",
                      marginTop: "4px",
                    }}
                  >
                    {form.rooms} Room(s) ×{" "}
                    {Math.max(
                      1,
                      Math.ceil(
                        (new Date(form.checkOut) - new Date(form.checkIn)) /
                          (1000 * 60 * 60 * 24),
                      ),
                    )}{" "}
                    Night(s)
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-d)",
                    fontSize: "32px",
                    fontWeight: 600,
                    color: "var(--teal)",
                  }}
                >
                  ₹
                  {calculateTotal(
                    form.roomType,
                    form.checkIn,
                    form.checkOut,
                    form.rooms,
                  ).toLocaleString()}
                </div>
              </div>
            ) : null}

            <div
              style={{
                marginTop: "20px",
                padding: "14px 18px",
                background: "var(--teal-pale)",
                borderLeft: "3px solid var(--teal)",
                marginBottom: "28px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--teal)",
                  lineHeight: 1.7,
                }}
              >
                🔒 A 6-digit OTP will be sent to your email to verify and
                confirm your booking securely.
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "17px",
              }}
              disabled={loading}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {loading ? (
                  <>
                    <span className="ldot" />
                    <span className="ldot" />
                    <span className="ldot" />
                  </>
                ) : (
                  "Send Verification OTP →"
                )}
              </span>
            </button>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <div style={{ padding: "52px 44px", textAlign: "center" }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontSize: "52px",
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              📧
            </motion.div>
            <p className="body-lg" style={{ marginBottom: "8px" }}>
              We've sent a 6-digit code to
            </p>
            <p
              style={{
                color: "var(--teal)",
                fontWeight: 600,
                fontSize: "16px",
                marginBottom: "44px",
              }}
            >
              {form.email}
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                marginBottom: "36px",
              }}
            >
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtp(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  style={{
                    width: "52px",
                    height: "64px",
                    textAlign: "center",
                    fontSize: "26px",
                    fontFamily: "var(--font-d)",
                    fontWeight: 600,
                    background: d ? "var(--teal-pale)" : "var(--cream)",
                    border: d
                      ? "2px solid var(--teal)"
                      : "1.5px solid var(--parchment)",
                    color: "var(--ink)",
                    outline: "none",
                    transition: "all 0.25s",
                    boxShadow: d ? "0 4px 16px rgba(27,107,107,0.15)" : "none",
                  }}
                />
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={confirm}
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "17px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {loading ? (
                  <>
                    <span className="ldot" />
                    <span className="ldot" />
                    <span className="ldot" />
                  </>
                ) : (
                  "Confirm Booking →"
                )}
              </span>
            </button>
            <button
              onClick={() => setStep(1)}
              style={{
                background: "none",
                border: "none",
                color: "var(--mist)",
                fontSize: "13px",
                cursor: "none",
                textDecoration: "underline",
              }}
            >
              ← Edit my details
            </button>
          </div>
        )}

        {/* Step 3 — Success */}
        {step === 3 && (
          <div style={{ padding: "56px 44px", textAlign: "center" }}>
            <div
              className="success-bounce"
              style={{
                fontSize: "64px",
                display: "inline-block",
                marginBottom: "20px",
              }}
            >
              🎉
            </div>
            <h3
              style={{
                fontFamily: "var(--font-d)",
                fontSize: "38px",
                fontWeight: 400,
                color: "var(--ink)",
                marginBottom: "8px",
              }}
            >
              Booking <em style={{ color: "var(--teal)" }}>Confirmed!</em>
            </h3>
            <span
              className="champ-line center"
              style={{ margin: "16px auto 24px" }}
            />

            <div
              style={{
                background: "var(--teal-pale)",
                border: "1.5px solid var(--teal)",
                padding: "22px 32px",
                marginBottom: "28px",
                display: "inline-block",
                minWidth: "280px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "var(--teal)",
                  marginBottom: "10px",
                  fontWeight: 600,
                }}
              >
                Your Booking ID
              </div>
              <div
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "var(--teal)",
                  letterSpacing: "3px",
                }}
              >
                {bookingId}
              </div>
            </div>

            <p className="body-lg" style={{ marginBottom: "8px" }}>
              Confirmation sent to{" "}
              <strong style={{ color: "var(--ink)" }}>{form.email}</strong>
            </p>
            <p className="body-sm" style={{ marginBottom: "36px" }}>
              Check-in:{" "}
              <span style={{ color: "var(--teal)", fontWeight: 500 }}>
                {form.checkIn}
              </span>{" "}
              &nbsp;·&nbsp; Check-out:{" "}
              <span style={{ color: "var(--teal)", fontWeight: 500 }}>
                {form.checkOut}
              </span>
            </p>
            <button
              className="btn-primary"
              onClick={onClose}
              style={{ padding: "16px 56px" }}
            >
              <span>Done</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ADMIN PANEL
───────────────────────────────────────────── */
const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const d = await res.json();
      if (d.success) {
        localStorage.setItem("adminToken", d.token);
        setLoggedIn(true);
        fetchBookings(d.token);
      } else setError(d.message || "Invalid credentials");
    } catch {
      setError("Server error");
    }
    setLoading(false);
  };

  const fetchBookings = async (token) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("adminToken")}`,
        },
      });
      const d = await res.json();
      if (d.success) setBookings(d.bookings);
    } catch {}
    setLoading(false);
  };

  const cancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        `⚠️ Are you sure you want to cancel booking ${bookingId}?\nThis will delete it from the database and email an apology to the guest.`,
      )
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );
      const d = await res.json();

      if (d.success) {
        // Remove the booking from the table instantly without reloading the page
        setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
        setSelected(null); // Close the modal
        alert("✅ Booking cancelled and email sent!");
      } else {
        alert(d.message || "Failed to cancel booking");
      }
    } catch (err) {
      alert("Server error while cancelling.");
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (t) {
      setLoggedIn(true);
      fetchBookings(t);
    }
  }, []);
  const filtered = bookings.filter((b) =>
    [b.bookingId, b.guestName, b.email].some((s) =>
      s?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  if (!loggedIn)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Particles count={16} color="var(--teal)" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: "100%",
            maxWidth: "440px",
            background: "var(--white)",
            boxShadow: "var(--shadow-lg)",
            padding: "52px",
            position: "relative",
            zIndex: 5,
            borderTop: "3px solid var(--champagne)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                fontFamily: "var(--font-d)",
                fontSize: "30px",
                fontWeight: 400,
                color: "var(--ink)",
                marginBottom: "4px",
              }}
            >
              Hotel{" "}
              <em style={{ fontStyle: "italic", color: "var(--teal)" }}>
                Frontier
              </em>
            </div>
            <div className="eyebrow" style={{ marginTop: "8px" }}>
              Admin Portal
            </div>
          </div>
          {error && (
            <div
              style={{
                background: "rgba(220,50,50,0.07)",
                border: "1px solid rgba(220,50,50,0.25)",
                color: "#c43a3a",
                padding: "12px 16px",
                marginBottom: "20px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={login}>
            <div style={{ marginBottom: "18px" }}>
              <label className="f-label">Username</label>
              <input
                className="f-input"
                value={creds.username}
                onChange={(e) =>
                  setCreds((c) => ({ ...c, username: e.target.value }))
                }
                required
                placeholder="admin"
              />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label className="f-label">Password</label>
              <input
                className="f-input"
                type="password"
                value={creds.password}
                onChange={(e) =>
                  setCreds((c) => ({ ...c, password: e.target.value }))
                }
                required
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "16px",
              }}
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign In →"}</span>
            </button>
          </form>
        </motion.div>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream2)" }}>
      {/* Admin Navbar */}
      <div
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--parchment)",
          padding: "16px 44px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "22px",
            color: "var(--ink)",
          }}
        >
          Hotel{" "}
          <em style={{ fontStyle: "italic", color: "var(--teal)" }}>
            Frontier
          </em>
          <span
            style={{
              fontFamily: "var(--font-b)",
              fontSize: "13px",
              color: "var(--mist)",
              marginLeft: "10px",
            }}
          >
            / Admin Dashboard
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => fetchBookings()}
            className="btn-outline-teal"
            style={{ padding: "9px 20px" }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              setLoggedIn(false);
            }}
            style={{
              background: "none",
              border: "1.5px solid var(--parchment)",
              color: "var(--slate)",
              padding: "9px 20px",
              cursor: "none",
              fontSize: "11px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              fontWeight: 600,
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--teal)";
              e.target.style.color = "var(--teal)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "var(--parchment)";
              e.target.style.color = "var(--slate)";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "40px 44px" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          {[
            {
              label: "Total Bookings",
              val: bookings.length,
              icon: "📋",
              color: "var(--teal)",
            },
            {
              label: "Today's Bookings",
              val: bookings.filter((b) =>
                b.createdAt?.startsWith(new Date().toISOString().split("T")[0]),
              ).length,
              icon: "📅",
              color: "var(--champagne)",
            },
            {
              label: "Confirmed",
              val: bookings.filter((b) => b.status === "confirmed").length,
              icon: "✅",
              color: "#2a9d4e",
            },
            {
              label: "Pending",
              val: bookings.filter((b) => b.status === "pending").length,
              icon: "⏳",
              color: "#d97706",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: "var(--white)",
                boxShadow: "var(--shadow-sm)",
                padding: "28px 32px",
                borderTop: `3px solid ${s.color}`,
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "10px" }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "42px",
                  fontWeight: 500,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--mist)",
                  marginTop: "8px",
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: "18px" }}>
          <input
            className="f-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking ID, guest name or email…"
            style={{ maxWidth: "480px", background: "var(--white)" }}
          />
        </div>

        {/* Table */}
        <div
          style={{
            background: "var(--white)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--cream)",
                  borderBottom: "2px solid var(--parchment)",
                }}
              >
                {[
                  "Booking ID",
                  "Guest",
                  "Email",
                  "Room",
                  "Check-in",
                  "Check-out",
                  "Rooms",
                  "Guests",
                  "Amount",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontSize: "9px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "var(--teal)",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: "60px",
                      textAlign: "center",
                      color: "var(--mist)",
                    }}
                  >
                    Loading bookings…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: "60px",
                      textAlign: "center",
                      color: "var(--mist)",
                    }}
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b._id}
                    style={{
                      borderBottom: "1px solid var(--cream2)",
                      transition: "background 0.2s",
                      cursor: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--teal-pale)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--white)")
                    }
                    onClick={() => setSelected(b)}
                  >
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "12px",
                        color: "var(--teal)",
                        fontFamily: "monospace",
                        fontWeight: 700,
                      }}
                    >
                      {b.bookingId}
                    </td>
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "14px",
                        color: "var(--ink)",
                        fontWeight: 500,
                      }}
                    >
                      {b.guestName}
                    </td>
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "13px",
                        color: "var(--slate)",
                      }}
                    >
                      {b.email}
                    </td>
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "12px",
                        color: "var(--ink2)",
                        textTransform: "capitalize",
                      }}
                    >
                      {b.roomType}
                    </td>
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "13px",
                        color: "var(--ink2)",
                      }}
                    >
                      {b.checkIn}
                    </td>
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "13px",
                        color: "var(--ink2)",
                      }}
                    >
                      {b.checkOut}
                    </td>
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "13px",
                        textAlign: "center",
                      }}
                    >
                      {b.rooms}
                    </td>
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "13px",
                        color: "var(--slate)",
                      }}
                    >
                      {b.adults}A/{b.children}C
                    </td>
                    {/* NEW AMOUNT COLUMN */}
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "13px",
                        color: "var(--ink)",
                        fontWeight: 600,
                      }}
                    >
                      ₹
                      {calculateTotal(
                        b.roomType,
                        b.checkIn,
                        b.checkOut,
                        b.rooms,
                      ).toLocaleString()}
                    </td>
                    <td style={{ padding: "15px 20px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          fontWeight: 600,
                          background:
                            b.status === "confirmed"
                              ? "rgba(42,157,78,0.12)"
                              : "rgba(217,119,6,0.12)",
                          color:
                            b.status === "confirmed" ? "#2a9d4e" : "#d97706",
                          border: `1px solid ${b.status === "confirmed" ? "rgba(42,157,78,0.3)" : "rgba(217,119,6,0.3)"}`,
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "15px 20px",
                        fontSize: "12px",
                        color: "var(--teal)",
                        fontWeight: 600,
                      }}
                    >
                      View →
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <div className="modal-wrap" onClick={() => setSelected(null)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                background: "var(--white)",
                boxShadow: "var(--shadow-lg)",
                maxWidth: "560px",
                width: "100%",
                padding: "44px",
                borderTop: "3px solid var(--champagne)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "28px",
                }}
              >
                <div>
                  <div className="eyebrow" style={{ marginBottom: "6px" }}>
                    Booking Details
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-d)",
                      fontSize: "24px",
                      color: "var(--teal)",
                      fontWeight: 500,
                    }}
                  >
                    {selected.bookingId}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "none",
                    border: "1.5px solid var(--parchment)",
                    width: "36px",
                    height: "36px",
                    cursor: "none",
                    fontSize: "16px",
                    color: "var(--slate)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {[
                  ["Guest", selected.guestName],
                  ["Email", selected.email],
                  ["Mobile", selected.mobile],
                  ["Room Type", selected.roomType],
                  ["Check-in", selected.checkIn],
                  ["Check-out", selected.checkOut],
                  ["Rooms", selected.rooms],
                  ["Adults", selected.adults],
                  ["Children", selected.children],
                  ["Status", selected.status],
                  [
                    "Booked On",
                    new Date(selected.createdAt).toLocaleDateString(),
                  ],
                  [
                    "Total Amount",
                    `₹${calculateTotal(selected.roomType, selected.checkIn, selected.checkOut, selected.rooms).toLocaleString()}`,
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      padding: "14px 16px",
                      background: "var(--cream)",
                      borderLeft: "2px solid var(--teal-pale)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "var(--champagne)",
                        marginBottom: "5px",
                        fontWeight: 700,
                      }}
                    >
                      {k}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "var(--ink)",
                        fontWeight: 400,
                        textTransform:
                          k === "Room Type" ? "capitalize" : "none",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
                {selected.address && (
                  <div
                    style={{
                      gridColumn: "span 2",
                      padding: "14px 16px",
                      background: "var(--cream)",
                      borderLeft: "2px solid var(--teal-pale)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "var(--champagne)",
                        marginBottom: "5px",
                        fontWeight: 700,
                      }}
                    >
                      Address
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--ink)" }}>
                      {selected.address}
                    </div>
                  </div>
                )}
                {selected.specialRequests && (
                  <div
                    style={{
                      gridColumn: "span 2",
                      padding: "14px 16px",
                      background: "var(--teal-pale)",
                      borderLeft: "2px solid var(--teal)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "var(--teal)",
                        marginBottom: "5px",
                        fontWeight: 700,
                      }}
                    >
                      Special Requests
                    </div>
                    <div
                      style={{ fontSize: "14px", color: "var(--teal-dark)" }}
                    >
                      {selected.specialRequests}
                    </div>
                  </div>
                )}
                {/* Cancel Booking Button */}
                <div
                  style={{
                    gridColumn: "span 2",
                    borderTop: "1px solid var(--parchment)",
                    paddingTop: "24px",
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => cancelBooking(selected.bookingId)}
                    style={{
                      background: "#d93838",
                      color: "var(--white)",
                      border: "none",
                      padding: "14px 28px",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      cursor: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#b92b2b")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "#d93838")
                    }
                  >
                    ⚠️ Cancel & Delete Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
const HomePage = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [preSelectedRoom, setPreSelectedRoom] = useState("deluxe");

  const open = (roomId) => {
    // If a specific room ID is passed, use it. Otherwise, default to an empty string.
    setPreSelectedRoom(typeof roomId === "string" ? roomId : "");
    setShowBooking(true);
  };

  const close = () => setShowBooking(false);

  return (
    <>
      <Navbar openBooking={open} />
      <Hero openBooking={open} />
      <Marquee />
      <Stats />
      <About />
      <Rooms openBooking={open} />
      <Facilities />
      <Amenities />
      <Attractions />
      <Testimonials />
      <CTA openBooking={open} />
      <Footer openBooking={open} />
      <AnimatePresence>
        {showBooking && (
          <BookingModal onClose={close} initialRoomType={preSelectedRoom} />
        )}
      </AnimatePresence>
    </>
  );
};

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <G />
      <Cursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
