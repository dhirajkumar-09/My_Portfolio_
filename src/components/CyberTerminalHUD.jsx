import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Cpu,
  Radio,
  Wifi,
  Activity,
  Layers,
  Sparkles,
  Send,
  CornerDownLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sliders,
  Power,
  Zap,
  Server,
  Cloud,
  ChevronRight
} from 'lucide-react';

export default function CyberTerminalHUD({ profile }) {
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'cli' | 'architecture'
  
  // Real-time simulated telemetry states
  const [uptimeSeconds, setUptimeSeconds] = useState(14820);
  const [cpu0, setCpu0] = useState(24);
  const [cpu1, setCpu1] = useState(58);
  const [temp, setTemp] = useState(26.6);
  const [humidity, setHumidity] = useState(61.8);
  const [distance, setDistance] = useState(48.2);
  const [relayActive, setRelayActive] = useState(true);
  const [packetsSent, setPacketsSent] = useState(1284);
  
  // MQTT log entries
  const [mqttLogs, setMqttLogs] = useState([
    { id: 1, time: '12:04:18', topic: 'node09/dht22', val: '{"temp": 26.6, "hum": 61.8}', status: 'PUB' },
    { id: 2, time: '12:04:20', topic: 'node09/radar', val: '{"dist_cm": 48.2, "state": "CLEAR"}', status: 'PUB' },
    { id: 3, time: '12:04:22', topic: 'cloud/cmd/actuator', val: '{"relay1": "ON", "mode": "AUTO"}', status: 'SUB' },
    { id: 4, time: '12:04:24', topic: 'gateway/heartbeat', val: '{"rssi": -56, "heap": 348210}', status: 'ACK' },
  ]);

  // Terminal CLI state
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: 'ESP32-S3 Xtensa FreeRTOS Terminal [v2.4.1]\nType "help" or click quick commands below to explore.'
    }
  ]);
  const [commandIndex, setCommandIndex] = useState(-1);
  const [enteredCommands, setEnteredCommands] = useState([]);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Profile fallbacks
  const name = profile?.name || 'Dhiraj Kumar';
  const college = profile?.college || 'BCE Bhagalpur';
  const role = profile?.roles?.[0] || 'CSE & IoT Engineer';
  const email = profile?.email || 'dhirajku00021@gmail.com';
  const phone = profile?.phone || '+91 7667825597';
  const github = profile?.github || 'https://github.com/dhirajkumar-09';
  const linkedin = profile?.linkedin || 'https://linkedin.com';

  // Live telemetry ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
      
      // Jitter telemetry values naturally
      setCpu0((prev) => Math.min(85, Math.max(12, Math.round(prev + (Math.random() * 8 - 4)))));
      setCpu1((prev) => Math.min(95, Math.max(30, Math.round(prev + (Math.random() * 10 - 5)))));
      setTemp((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setHumidity((prev) => +(prev + (Math.random() * 0.6 - 0.3)).toFixed(1));
      setDistance((prev) => +(Math.max(15, prev + (Math.random() * 2 - 1))).toFixed(1));
      setPacketsSent((p) => p + 1);

      // Periodically append a new MQTT packet
      if (Math.random() > 0.4) {
        const topics = [
          { topic: 'node09/telemetry', val: `{"t": ${(26 + Math.random()).toFixed(1)}, "h": ${(61 + Math.random()).toFixed(1)}}`, status: 'PUB' },
          { topic: 'node09/ultrasonic', val: `{"cm": ${(40 + Math.random() * 15).toFixed(1)}, "echo": "OK"}`, status: 'PUB' },
          { topic: 'mesh/sync/gateway', val: '{"sync": "100%", "latency": "14ms"}', status: 'ACK' },
          { topic: 'node09/pwr/bus', val: '{"v": "3.31V", "i": "82mA"}', status: 'SYS' }
        ];
        const next = topics[Math.floor(Math.random() * topics.length)];
        const d = new Date();
        const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
        setMqttLogs((prevLogs) => [
          ...prevLogs.slice(-5),
          { id: Date.now(), time: timeStr, ...next }
        ]);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Format uptime
  const formatUptime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Scroll terminal to bottom when new entries arrive
  useEffect(() => {
    if (activeTab === 'cli' && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, activeTab]);

  // Execute terminal CLI commands
  const handleCommand = (rawCmd) => {
    const cmd = (rawCmd || inputVal).trim().toLowerCase();
    if (!cmd) return;

    // Track command history
    setEnteredCommands((prev) => [...prev, cmd]);
    setCommandIndex(-1);
    setInputVal('');

    const newEntries = [{ type: 'user', text: `dhiraj@portfolio:~$ ${cmd}` }];

    switch (cmd) {
      case 'help':
        newEntries.push({
          type: 'output',
          text: `AVAILABLE COMMANDS:\n  • whoami     - Display engineer profile & background\n  • skills     - Print core tech stack (IoT, Hardware, Full-Stack)\n  • projects   - View highlighted projects with links\n  • iot-specs  - Inspect connected ESP32-S3 node hardware specs\n  • contact    - Display direct contact channels\n  • neofetch   - Display cyber system banner & specs\n  • clear      - Clear terminal screen\n  • ping       - Test round-trip latency to IoT gateway`
        });
        break;

      case 'whoami':
        newEntries.push({
          type: 'output',
          text: `ENGINEER PROFILE:\n  Name:       ${name}\n  Education:  B.Tech in CSE @ ${college}\n  Specialty:  IoT Architecture & Full-Stack Development\n  Focus:      Embedded Firmware (ESP32/FreeRTOS) + React Web Cloud Systems\n  Location:   Patna, Bihar, India`
        });
        break;

      case 'skills':
        newEntries.push({
          type: 'output',
          text: `TECH STACK MATRIX:\n  ⚡ IoT & Embedded:    ESP32, Arduino, FreeRTOS, MQTT, C/C++, Sensors (DHT, Ultrasonic, Relays)\n  🌐 Web Development:  React.js, Tailwind CSS, JavaScript (ES6+), HTML5/CSS3\n  ☁️ Cloud & Backend:   Firebase Firestore, Node.js, REST APIs, WebSockets\n  🛠️ Tools & Protocols: Git/GitHub, PlatformIO, VS Code, Postman, Linux`
        });
        break;

      case 'projects':
        newEntries.push({
          type: 'output',
          text: `FEATURED PROJECTS:\n  1. Smart Irrigation & Field Telemetry System (ESP32 + MQTT + React)\n  2. Autonomous Obstacle Avoidance Robot (Arduino + Ultrasonic Sensing)\n  3. Developer Portfolio & Admin Engine (React 19 + Firebase + Tailwind)\n  4. Campus Event & Academic Notice Hub\n\n  👉 Scroll down to the Projects section to test live demos and code!`
        });
        break;

      case 'iot-specs':
        newEntries.push({
          type: 'output',
          text: `ESP32-S3 HARWARE TELEMETRY:\n  Core:        Xtensa® 32-bit LX7 Dual-Core @ 240MHz\n  SRAM:        512 KB Internal + 8MB Octal PSRAM\n  Wireless:    2.4 GHz Wi-Fi (802.11 b/g/n) + Bluetooth 5 (LE)\n  Sensors:     DHT22 (Temp/Hum), HC-SR04 (Sonar), 5V Relay Channel\n  Protocol:    MQTT v5.0 over TLS / JSON Payload / QoS 1\n  Firmware:    FreeRTOS v10.4.3-bce-custom`
        });
        break;

      case 'contact':
        newEntries.push({
          type: 'output',
          text: `DIRECT CHANNELS:\n  📧 Email:    ${email}\n  📱 Phone:    ${phone}\n  🐙 GitHub:   ${github}\n  💼 LinkedIn: ${linkedin}`
        });
        break;

      case 'neofetch':
        newEntries.push({
          type: 'output',
          text: `    ___      _     _              OS:        DhirajOS v2.4 (Cyber IoT Edition)\n   /   \\___ | |__ | |__  _   _   Host:      ${college} IoT Cluster\n  / /\\ / _ \\| '_ \\| '_ \\| | | |  Kernel:    ESP32-S3 FreeRTOS Kernel 10.4\n / /_// (_) | | | | | | | |_| |  Uptime:    ${formatUptime(uptimeSeconds)}\n/___,' \\___/|_| |_|_| |_|\\__, |  Shell:     zsh 5.9 / cyber-hud\n                         |___/   Terminal:  CyberTerminalHUD-v1.0\n                                 CPU:       Xtensa Dual-Core @ 240MHz\n                                 Memory:    348KB / 512KB (Free: 68%)`
        });
        break;

      case 'ping':
        newEntries.push({
          type: 'output',
          text: `PING gateway.bce-iot.internal (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=14.2 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=13.8 ms\n--- gateway.bce-iot.internal ping statistics ---\n2 packets transmitted, 2 received, 0.0% packet loss, avg = 14.0 ms`
        });
        break;

      case 'clear':
        setHistory([]);
        return;

      default:
        newEntries.push({
          type: 'error',
          text: `Command not found: "${cmd}". Type "help" or click one of the quick pills below.`
        });
        break;
    }

    setHistory((prev) => [...prev, ...newEntries]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (enteredCommands.length > 0) {
        const nextIndex = commandIndex + 1 < enteredCommands.length ? commandIndex + 1 : commandIndex;
        setCommandIndex(nextIndex);
        setInputVal(enteredCommands[enteredCommands.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandIndex > 0) {
        const nextIndex = commandIndex - 1;
        setCommandIndex(nextIndex);
        setInputVal(enteredCommands[enteredCommands.length - 1 - nextIndex]);
      } else if (commandIndex === 0) {
        setCommandIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-[#070d14] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] font-mono select-none">
      
      {/* 1. Terminal Window Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/90 border-b border-cyan-500/20 backdrop-blur-md">
        
        {/* Mac OS Window Dots */}
        <div className="flex items-center gap-1.5">
          <button 
            title="Reset Terminal" 
            onClick={() => { setHistory([]); }}
            className="w-3 h-3 rounded-full bg-rose-500/90 hover:brightness-125 transition-all shadow-[0_0_6px_rgba(244,63,94,0.6)] cursor-pointer"
          />
          <button 
            title="Toggle Relay" 
            onClick={() => setRelayActive(!relayActive)}
            className="w-3 h-3 rounded-full bg-amber-500/90 hover:brightness-125 transition-all shadow-[0_0_6px_rgba(245,158,11,0.6)] cursor-pointer"
          />
          <button 
            title="Refresh Telemetry" 
            onClick={() => {
              setCpu0(38);
              setCpu1(64);
              setPacketsSent((p) => p + 10);
            }}
            className="w-3 h-3 rounded-full bg-emerald-500/90 hover:brightness-125 transition-all shadow-[0_0_6px_rgba(16,185,129,0.6)] cursor-pointer"
          />
          <span className="ml-2 text-[11px] font-mono font-medium text-slate-400 hidden sm:inline flex items-center gap-1">
            <span className="text-cyan-400">esp32-node</span>
            <span className="text-slate-600">@</span>
            <span className="text-slate-300">dhiraj-iot</span>
          </span>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase">ONLINE</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">{formatUptime(uptimeSeconds)}</span>
          </div>
        </div>

        {/* HUD Tab Controls */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px]">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'cli'
                ? 'bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>CLI</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-sky-500/25 text-sky-300 font-bold border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Arch</span>
          </button>
        </div>
      </div>

      {/* 2. Main Terminal Body Views */}
      <div className="flex-1 overflow-hidden relative flex flex-col">

        {/* ============================================================== */}
        {/* VIEW 1: LIVE IOT NODE TELEMETRY HUD                             */}
        {/* ============================================================== */}
        {activeTab === 'telemetry' && (
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-cyan-500/20 text-xs">
            
            {/* Top Node Specs Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/70 p-2.5 rounded-xl border border-cyan-500/20">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target MCU</span>
                <span className="text-cyan-300 font-semibold text-[11px] flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" /> ESP32-S3
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Wi-Fi Mesh</span>
                <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-400" /> -56 dBm
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FreeRTOS</span>
                <span className="text-sky-300 font-semibold text-[11px]">v10.4 Tick</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MQTT Packets</span>
                <span className="text-amber-400 font-semibold text-[11px]">{packetsSent} pkts</span>
              </div>
            </div>

            {/* Dual CPU Load Bars */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Core 0 (System Loop)</span>
                </span>
                <span className="text-amber-400 font-semibold">{cpu0}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full"
                  animate={{ width: `${cpu0}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Core 1 (FreeRTOS Tasks)</span>
                </span>
                <span className="text-cyan-400 font-semibold">{cpu1}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full"
                  animate={{ width: `${cpu1}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* 4 Real-time Sensor Gauge Tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Tile 1: DHT22 Temperature */}
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-950/20 to-slate-900/80 border border-rose-500/25">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>DHT22 Temp</span>
                  <span className="text-rose-400">● LIVE</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white tracking-tight">{temp}</span>
                  <span className="text-rose-400 font-semibold text-xs">°C</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Ambient</span>
                  <span className="text-emerald-400">Optimal Range</span>
                </div>
              </div>

              {/* Tile 2: DHT22 Humidity */}
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-950/20 to-slate-900/80 border border-cyan-500/25">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Relative Hum</span>
                  <span className="text-cyan-400">● LIVE</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white tracking-tight">{humidity}</span>
                  <span className="text-cyan-400 font-semibold text-xs">% RH</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Dew: 18.2°C</span>
                  <span className="text-cyan-300">Stable</span>
                </div>
              </div>

              {/* Tile 3: HC-SR04 Ultrasonic Sonar */}
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-950/20 to-slate-900/80 border border-emerald-500/25">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>HC-SR04 Radar</span>
                  <span className="text-emerald-400">● ECHO</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white tracking-tight">{distance}</span>
                  <span className="text-emerald-400 font-semibold text-xs">cm</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Beam: 15°</span>
                  <span className="text-emerald-400">Path Clear</span>
                </div>
              </div>

              {/* Tile 4: Smart Relay Actuator */}
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-950/20 to-slate-900/80 border border-amber-500/25 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Relay Channel #1</span>
                  <button 
                    onClick={() => setRelayActive(!relayActive)}
                    className="text-[9px] text-amber-300 hover:underline cursor-pointer"
                  >
                    Toggle
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Power className={`w-4 h-4 ${relayActive ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
                    <span className={`text-sm font-bold ${relayActive ? 'text-amber-300' : 'text-slate-500'}`}>
                      {relayActive ? 'ACTIVE (ON)' : 'STANDBY'}
                    </span>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span>GPIO 18</span>
                  <span className="text-amber-400">240V / 10A Safe</span>
                </div>
              </div>

            </div>

            {/* Live Streaming MQTT Message Log */}
            <div className="rounded-xl bg-black/60 border border-cyan-500/20 p-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  MQTT Live Packet Stream
                </span>
                <span className="text-slate-500 font-mono">QoS 1 • TLS 1.3</span>
              </div>
              <div className="mt-2 space-y-1.5 font-mono text-[10px]">
                {mqttLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-1.5 text-slate-300">
                    <span className="text-slate-600">[{log.time}]</span>
                    <span className={`px-1 rounded text-[9px] font-bold ${
                      log.status === 'PUB' ? 'bg-cyan-500/20 text-cyan-400' :
                      log.status === 'SUB' ? 'bg-amber-500/20 text-amber-400' :
                      log.status === 'ACK' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-slate-400 truncate max-w-[100px] sm:max-w-[130px]">{log.topic}</span>
                    <span className="text-emerald-400 truncate flex-1">{log.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Waveform Oscilloscope Graphic */}
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                Bus Signal Pulse
              </span>
              <svg className="w-40 h-5" viewBox="0 0 160 20">
                <path
                  d="M0,10 L30,10 L35,3 L42,17 L48,5 L54,14 L60,10 L100,10 L105,2 L112,18 L118,6 L124,12 L130,10 L160,10"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              </svg>
              <span className="text-[10px] font-mono text-emerald-400">18ms latency</span>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: INTERACTIVE DEVELOPER CLI TERMINAL                      */}
        {/* ============================================================== */}
        {activeTab === 'cli' && (
          <div className="flex-1 flex flex-col p-3 sm:p-4 text-xs font-mono overflow-hidden">
            
            {/* Quick Command Action Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2.5 border-b border-slate-800 text-[10px]">
              <span className="text-slate-500">Quick run:</span>
              {[
                'help',
                'whoami',
                'skills',
                'projects',
                'iot-specs',
                'contact',
                'clear'
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/50 text-slate-300 border border-slate-800 transition-all cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal History Output */}
            <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
              {history.map((item, idx) => (
                <div key={idx} className="leading-relaxed">
                  {item.type === 'user' && (
                    <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                      <span>{item.text}</span>
                    </div>
                  )}

                  {item.type === 'system' && (
                    <div className="text-slate-400 whitespace-pre-wrap bg-slate-900/40 p-2 rounded-lg border border-slate-800/80">
                      {item.text}
                    </div>
                  )}

                  {item.type === 'output' && (
                    <div className="text-slate-200 whitespace-pre-wrap pl-3 border-l-2 border-emerald-500/50 text-[11px]">
                      {item.text}
                    </div>
                  )}

                  {item.type === 'error' && (
                    <div className="text-rose-400 pl-3 border-l-2 border-rose-500/50 flex items-center gap-1.5 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Prompt Bar */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <span className="text-cyan-400 font-semibold flex-shrink-0 text-[11px] sm:text-xs">
                dhiraj@cli:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type 'help', 'skills', 'projects'..."
                className="flex-1 bg-transparent border-none outline-none text-emerald-400 placeholder:text-slate-600 text-xs font-mono selection:bg-cyan-500/30"
                autoFocus
              />
              <button
                onClick={() => handleCommand()}
                disabled={!inputVal.trim()}
                className="p-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-20 cursor-pointer"
                title="Send command"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: LIVE ARCHITECTURE & DATA PIPELINE                       */}
        {/* ============================================================== */}
        {activeTab === 'architecture' && (
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs font-mono">
            <div className="text-[11px] text-slate-300 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Layers className="w-3.5 h-3.5" />
                End-to-End System Pipeline
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync
              </span>
            </div>

            {/* Pipeline Stage 1: Hardware Edge */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">1. Edge Hardware Node</h4>
                    <p className="text-[10px] text-slate-400">ESP32-S3 + DHT22 + HC-SR04 + Relay</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  GPIO / ADC / I2C
                </span>
              </div>
            </div>

            {/* Connecting Animated Bus Arrow 1 */}
            <div className="flex justify-center -my-1">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-500 tracking-wider">MQTT (TLS 8883)</span>
                <span className="text-cyan-400 font-bold animate-bounce text-xs">▼</span>
              </div>
            </div>

            {/* Pipeline Stage 2: Cloud Gateway & Broker */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-sky-500/30 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">2. Cloud MQTT & Firebase Engine</h4>
                    <p className="text-[10px] text-slate-400">EMQX Broker / Firestore Realtime Sync</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  WebSockets
                </span>
              </div>
            </div>

            {/* Connecting Animated Bus Arrow 2 */}
            <div className="flex justify-center -my-1">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-500 tracking-wider">JSON Stream (18ms)</span>
                <span className="text-sky-400 font-bold animate-bounce text-xs">▼</span>
              </div>
            </div>

            {/* Pipeline Stage 3: Client Dashboard */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">3. React 19 Client Web App</h4>
                    <p className="text-[10px] text-slate-400">Tailwind CSS + Dynamic Admin Console</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Client UI
                </span>
              </div>
            </div>

            {/* Pipeline Summary Bar */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[10px] grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-slate-500 block">Packet Loss</span>
                <span className="text-emerald-400 font-semibold">0.00%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Round-Trip</span>
                <span className="text-cyan-400 font-semibold">14.2 ms</span>
              </div>
              <div>
                <span className="text-slate-500 block">System State</span>
                <span className="text-emerald-400 font-semibold">100% OPERATIONAL</span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 3. Subtle Cyber Footer Bar */}
      <div className="px-3.5 py-1.5 bg-slate-950/90 border-t border-cyan-500/10 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Interactive Cyber Console</span>
        </span>
        <span className="text-slate-400 font-mono">
          BCE-IOT // CLUSTER 09
        </span>
      </div>

    </div>
  );
}
