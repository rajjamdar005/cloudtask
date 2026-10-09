import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FolderGit2,
  Heart,
  Kanban,
  ListTodo,
  LogOut,
  MessageSquare,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react";

// Default seed tasks for modern personal & engineering productivity
const INITIAL_TASKS = [
  {
    id: "task-1",
    title: "AWS Cloud Infrastructure & Auto-Scaling",
    subLabel: "DevOps • Cloud Resilience",
    category: "Urgent",
    priority: "high",
    time: "09:15 AM",
    date: "2026-10-09",
    completed: false,
    codeTag: "INF-842-AWS",
    durationMin: 25,
    notes:
      "Review auto-scaling policies on ECS clusters and verify CloudWatch latency metrics before the afternoon release.",
    tags: ["AWS", "Terraform", "Production"],
    subtasks: [
      { id: "st-1", text: "Verify CloudWatch alarm thresholds", done: true },
      { id: "st-2", text: "Check IAM least privilege roles", done: false },
      { id: "st-3", text: "Execute latency benchmarks", done: false },
    ],
  },
  {
    id: "task-2",
    title: "Design System & Figma Tokens Audit",
    subLabel: "UI/UX • Design Tokens",
    category: "Design",
    priority: "medium",
    time: "10:30 AM",
    date: "2026-10-09",
    completed: true,
    codeTag: "DS-412-FGM",
    durationMin: 45,
    notes:
      "Audit typography contrast, smooth micro-interactions, and ensure WCAG AA compliance across desktop and mobile.",
    tags: ["Figma", "Design System", "Tokens"],
    subtasks: [
      { id: "st-4", text: "Test responsive mobile breakpoints", done: true },
      { id: "st-5", text: "Verify dark/light theme contrast ratio", done: true },
    ],
  },
  {
    id: "task-3",
    title: "Backend Microservices Decoupling",
    subLabel: "Architecture • API Gateway",
    category: "Work",
    priority: "high",
    time: "01:15 PM",
    date: "2026-10-09",
    completed: false,
    codeTag: "ARC-901-API",
    durationMin: 60,
    notes:
      "Decouple monolithic backend endpoints into modular Lambda functions with zero-downtime cutover and offline sync.",
    tags: ["Node.js", "Docker", "Microservices"],
    subtasks: [
      { id: "st-6", text: "Review event-driven architecture diagram", done: true },
      { id: "st-7", text: "Prepare PR and test coverage suite", done: false },
    ],
  },
  {
    id: "task-4",
    title: "Security Hardening & IAM Key Rotation",
    subLabel: "Security • DevSecOps",
    category: "Work",
    priority: "low",
    time: "03:45 PM",
    date: "2026-10-09",
    completed: false,
    codeTag: "SEC-302-KMS",
    durationMin: 30,
    notes:
      "Rotate production credentials, update encryption keys in KMS, and review CloudTrail access logs.",
    tags: ["SecOps", "IAM", "Compliance"],
    subtasks: [
      { id: "st-8", text: "Revoke old secret access keys", done: false },
      { id: "st-9", text: "Enable automated key rotation policy", done: false },
    ],
  },
  {
    id: "task-5",
    title: "Sprint Retrospective & Roadmap Planning",
    subLabel: "Product Strategy • Backlog Grooming",
    category: "Personal",
    priority: "medium",
    time: "05:00 PM",
    date: "2026-10-09",
    completed: false,
    codeTag: "SPR-108-PLN",
    durationMin: 40,
    notes:
      "Review sprint velocity, unblock team dependencies, and prioritize upcoming Q4 core deliverables.",
    tags: ["Roadmap", "Sprint", "Agile"],
    subtasks: [
      { id: "st-10", text: "Review completed feature tickets", done: true },
      { id: "st-11", text: "Draft Q4 milestone timeline", done: false },
    ],
  },
];

// Initial timeline events
const INITIAL_TIMELINE = [
  {
    id: "ev-1",
    time: "08:00",
    title: "Morning Engineering Standup",
    desc: "Main Team Room • Daily Sync",
    theme: "event-pink",
    day: 15,
  },
  {
    id: "ev-2",
    time: "10:30",
    title: "UI/UX Design Review",
    desc: "Figma Workspace • Board Audit",
    theme: "event-blue",
    day: 15,
  },
  {
    id: "ev-3",
    time: "01:30",
    title: "Architecture & Code Review",
    desc: "PR Walkthrough • Remote",
    theme: "event-yellow",
    day: 15,
  },
  {
    id: "ev-4",
    time: "04:00",
    title: "Production Deployment",
    desc: "DevOps Channel • Staging -> Prod",
    theme: "event-purple",
    day: 15,
  },
];

export default function App() {
  // Navigation View: 'dashboard' | 'schedule' | 'tasks' | 'analytics' | 'focus' | 'notes' | 'settings'
  const [activeNav, setActiveNav] = useState("dashboard");

  // User Profile Name
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("aura_user_name") || "Siddhiraj";
  });

  // Offline-first tasks storage (v2 clean key)
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("aura_tasks_data_v2");
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Offline-first timeline storage (v2 clean key)
  const [timeline, setTimeline] = useState(() => {
    try {
      const saved = localStorage.getItem("aura_timeline_data_v2");
      return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
    } catch {
      return INITIAL_TIMELINE;
    }
  });

  // Scratchpad Notes storage
  const [notesText, setNotesText] = useState(() => {
    return (
      localStorage.getItem("aura_scratchpad_notes") ||
      `# Project Notes & Ideas\n\n- System architecture is now 100% offline-first.\n- All state transitions happen instantly with zero latency.\n- Keep focus sessions between 25m - 50m for sustained productivity.\n- Review completed tickets before Friday deployment.`
    );
  });

  // Theme mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("aura_theme_mode") || "light";
  });

  // Active selected day in Calendar
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth, setSelectedMonth] = useState("May 2024");

  // Selected task in Inspector
  const [selectedTaskId, setSelectedTaskId] = useState(
    tasks[0]?.id || "task-1"
  );

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");

  // Fast inline task form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Work");
  const [newPriority, setNewPriority] = useState("high");

  // Modal State for Adding Event
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("10:00");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventColor, setNewEventColor] = useState("event-pink");

  // Notifications Popover
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to AURA Workspace", time: "Just now" },
    { id: 2, text: "100% Offline Task Manager Active", time: "2m ago" },
    { id: 3, text: "Focus room ready to start", time: "5m ago" },
  ]);

  // Focus Timer state
  const [focusPreset, setFocusPreset] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("aura_tasks_data_v2", JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem("aura_timeline_data_v2", JSON.stringify(timeline));
    } catch (e) {
      console.error(e);
    }
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem("aura_scratchpad_notes", notesText);
  }, [notesText]);

  useEffect(() => {
    localStorage.setItem("aura_user_name", userName);
  }, [userName]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("aura_theme_mode", theme);
  }, [theme]);

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setNotifications((n) => [
              { id: Date.now(), text: "Focus Session Finished! Great work.", time: "Just now" },
              ...n,
            ]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSelectPreset = (mins) => {
    setFocusPreset(mins);
    setTimerSeconds(mins * 60);
    setIsTimerRunning(false);
  };

  // Time-of-day greeting
  const greetingPeriod = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Selected task
  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === selectedTaskId) || tasks[0] || null;
  }, [tasks, selectedTaskId]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        activeCategory === "All" ||
        t.category.toLowerCase() === activeCategory.toLowerCase();

      const matchStatus =
        activeStatusFilter === "all" ||
        (activeStatusFilter === "active" && !t.completed) ||
        (activeStatusFilter === "completed" && t.completed);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [tasks, searchQuery, activeCategory, activeStatusFilter]);

  // Stats
  const completedCount = tasks.filter((t) => t.completed).length;
  const inProgressCount = tasks.length - completedCount;
  const highPriorityCount = tasks.filter((t) => t.priority === "high").length;
  const medPriorityCount = tasks.filter((t) => t.priority === "medium").length;
  const lowPriorityCount = tasks.filter((t) => t.priority === "low").length;

  // Add Task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      subLabel: `${newCategory} • Active Task`,
      category: newCategory,
      priority: newPriority,
      time: currentTime,
      date: new Date().toISOString().split("T")[0],
      completed: false,
      codeTag: `AU-${Math.floor(1000 + Math.random() * 9000)}`,
      durationMin: 30,
      notes: "Quick capture. Add detailed action steps here.",
      tags: [newCategory, newPriority.toUpperCase()],
      subtasks: [
        { id: `st-${Date.now()}`, text: "Initial kickoff", done: false },
      ],
    };

    setTasks([newTask, ...tasks]);
    setSelectedTaskId(newTask.id);
    setNewTitle("");
    setNotifications((prev) => [
      { id: Date.now(), text: `Created task: "${newTask.title}"`, time: "Just now" },
      ...prev,
    ]);
  };

  // Toggle Task Completion
  const handleToggleTask = (id, e) => {
    e?.stopPropagation();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete Task
  const handleDeleteTask = (id, e) => {
    e?.stopPropagation();
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    if (selectedTaskId === id && updated.length > 0) {
      setSelectedTaskId(updated[0].id);
    }
  };

  // Update Notes on Selected Task
  const handleNotesChange = (newNotes) => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id ? { ...t, notes: newNotes } : t
      )
    );
  };

  // Toggle Subtask
  const handleToggleSubtask = (subtaskId) => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== selectedTask.id) return t;
        const updatedSubtasks = (t.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, done: !st.done } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
  };

  // Add Event to Timeline
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv = {
      id: `ev-${Date.now()}`,
      time: newEventTime,
      title: newEventTitle.trim(),
      desc: newEventDesc.trim() || "Scheduled session",
      theme: newEventColor,
      day: selectedDay,
    };

    setTimeline([...timeline, newEv]);
    setShowEventModal(false);
    setNewEventTitle("");
    setNewEventDesc("");
    setNotifications((prev) => [
      { id: Date.now(), text: `Scheduled: "${newEv.title}" for May ${selectedDay}`, time: "Just now" },
      ...prev,
    ]);
  };

  // Delete Event from Timeline
  const handleDeleteEvent = (id) => {
    setTimeline((prev) => prev.filter((ev) => ev.id !== id));
  };

  // Export Data JSON
  const handleExportData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({ tasks, timeline, notesText, userName }, null, 2)
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "aura_tasks_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset to Seed Data
  const handleResetData = () => {
    if (confirm("Reset workspace to initial clean tasks data?")) {
      setTasks(INITIAL_TASKS);
      setTimeline(INITIAL_TIMELINE);
      setSelectedTaskId(INITIAL_TASKS[0].id);
      localStorage.setItem("aura_tasks_data_v2", JSON.stringify(INITIAL_TASKS));
      localStorage.setItem("aura_timeline_data_v2", JSON.stringify(INITIAL_TIMELINE));
    }
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="app-frame">
      {/* ========================================================
          LEFT SIDEBAR (Dark Luxury Pillar)
          ======================================================== */}
      <aside className="sidebar">
        <div>
          <div className="brand-section">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveNav("dashboard");
              }}
              className="brand-logo"
            >
              AURA <span className="brand-dot" />
            </a>
            <span className="brand-badge">PRO</span>
          </div>

          <div className="nav-group-title">Workspaces</div>
          <ul className="nav-list">
            <li>
              <button
                className={`nav-item ${activeNav === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveNav("dashboard")}
              >
                <ListTodo size={17} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeNav === "schedule" ? "active" : ""}`}
                onClick={() => setActiveNav("schedule")}
              >
                <Calendar size={17} />
                <span>Schedule & Agenda</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeNav === "tasks" ? "active" : ""}`}
                onClick={() => setActiveNav("tasks")}
              >
                <Kanban size={17} />
                <span>All Tasks</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeNav === "analytics" ? "active" : ""}`}
                onClick={() => setActiveNav("analytics")}
              >
                <Zap size={17} />
                <span>Productivity Stats</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeNav === "focus" ? "active" : ""}`}
                onClick={() => setActiveNav("focus")}
              >
                <Clock size={17} />
                <span>Focus Timer</span>
              </button>
            </li>
          </ul>

          <div className="nav-group-title">Personal Tools</div>
          <ul className="nav-list">
            <li>
              <button
                className={`nav-item ${activeNav === "notes" ? "active" : ""}`}
                onClick={() => setActiveNav("notes")}
              >
                <MessageSquare size={17} />
                <span>Scratchpad & Notes</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeNav === "settings" ? "active" : ""}`}
                onClick={() => setActiveNav("settings")}
              >
                <Settings size={17} />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="sidebar-bottom">
          <div className="offline-pill">
            <span className="pulse-dot" />
            <span>100% Offline Mode</span>
          </div>

          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            title="Toggle Light / Dark mode"
          >
            <span>{theme === "light" ? "Dark Mode" : "Pastel Luxury"}</span>
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA
          ======================================================== */}
      <div className="main-wrapper">
        <main className="center-content">
          {/* Top Bar with Search & User Actions */}
          <header className="topbar">
            <div className="search-box-pill">
              <span className="search-icon-circle">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search tasks, tags, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="search-filter-pills">
                <span>In:</span>
                {["All", "Work", "Urgent", "Design", "Personal"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`search-pill-btn ${
                      activeCategory === cat ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="topbar-actions">
              <button
                className="action-circle-btn"
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={17} />
                <span className="badge-dot" />
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="popover-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: "800" }}>
                      Activity Feed
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{ color: "var(--text-muted)" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className="popover-item">
                      <Sparkles size={14} color="#f43f5e" />
                      <div style={{ flex: 1 }}>
                        <div>{n.text}</div>
                        <small style={{ opacity: 0.6 }}>{n.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="user-profile-badge"
                onClick={() => setActiveNav("settings")}
                title="Profile & Settings"
              >
                <div className="user-avatar-img">
                  {userName.substring(0, 2).toUpperCase()}
                </div>
                <span className="user-profile-name">{userName}</span>
              </div>
            </div>
          </header>

          {/* VIEW: DASHBOARD (Flagship 1:1 view) */}
          {activeNav === "dashboard" && (
            <>
              {/* Greeting Section */}
              <section className="greeting-section">
                <h1 className="greeting-title">
                  {greetingPeriod}, {userName}
                </h1>
                <p className="greeting-subtitle">
                  Aura wishes you a focused and productive day. {inProgressCount}{" "}
                  tasks waiting for your attention today. You also have{" "}
                  {timeline.length} scheduled items in your agenda.
                </p>
              </section>

              {/* ========================================================
                  BENTO GRID (4 Pastel Cards)
                  ======================================================== */}
              <section className="bento-grid">
                {/* 1. Yellow Card: Tasks Overview */}
                <div className="bento-card bento-yellow">
                  <div className="bento-card-header">
                    <span className="bento-card-title">Tasks Overview:</span>
                    <span
                      className="bento-card-action"
                      onClick={() => setActiveNav("tasks")}
                    >
                      Show all
                    </span>
                  </div>
                  <div className="bento-stats-row">
                    <div className="bento-stat-item">
                      <span className="bento-stat-num">{completedCount} tasks</span>
                      <span className="bento-stat-label">Done</span>
                    </div>
                    <div className="bento-stat-item">
                      <span className="bento-stat-num">{inProgressCount} tasks</span>
                      <span className="bento-stat-label">In Flow</span>
                    </div>
                    <div className="bento-stat-item">
                      <span className="bento-stat-num">{tasks.length} total</span>
                      <span className="bento-stat-label">Queue</span>
                    </div>
                  </div>

                  {/* Decorative Geometric Cross */}
                  <svg
                    className="card-sticker"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path d="M12 2v20M2 12h20" />
                  </svg>

                  {/* Mini Bar Chart */}
                  <div className="mini-bar-chart">
                    {[45, 80, 60, 95, 70, 90].map((h, idx) => (
                      <div key={idx} className="bar-col">
                        <div className="bar-fill" style={{ height: `${h}%` }} />
                        <span className="bar-label">
                          {["M", "T", "W", "T", "F", "S"][idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Pink Card: Flow Velocity & Sparkline */}
                <div className="bento-card bento-pink">
                  <div className="bento-card-header">
                    <span className="bento-card-title">Flow Velocity:</span>
                    <span
                      className="bento-card-action"
                      onClick={() => setActiveNav("analytics")}
                    >
                      Detailed
                    </span>
                  </div>
                  <div className="bento-stats-row">
                    <div className="bento-stat-item">
                      <span className="bento-stat-num">24 min</span>
                      <span className="bento-stat-label">Average</span>
                    </div>
                    <div className="bento-stat-item">
                      <span className="bento-stat-num">15 min</span>
                      <span className="bento-stat-label">Quick Task</span>
                    </div>
                    <div className="bento-stat-item">
                      <span className="bento-stat-num">01:30 h</span>
                      <span className="bento-stat-label">Deep Work</span>
                    </div>
                  </div>

                  {/* Decorative Floating Heart Motif */}
                  <Heart
                    className="card-sticker"
                    size={46}
                    fill="currentColor"
                    stroke="none"
                  />

                  {/* Smooth Sparkline SVG */}
                  <svg className="sparkline-svg" viewBox="0 0 300 70">
                    <path
                      d="M 10,48 Q 40,25 70,42 T 130,35 T 190,18 T 240,45 T 290,30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="190" cy="18" r="5" fill="currentColor" />
                    <line
                      x1="190"
                      y1="18"
                      x2="190"
                      y2="65"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <text
                      x="180"
                      y="68"
                      fontSize="9"
                      fontWeight="700"
                      fill="currentColor"
                    >
                      12:00
                    </text>
                  </svg>
                </div>

                {/* 3. Green Card: Priority Distribution */}
                <div className="bento-card bento-green">
                  <div className="bento-card-header">
                    <span className="bento-card-title">By Priority:</span>
                  </div>
                  <div className="bento-stats-row">
                    <div
                      className="bento-stat-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveStatusFilter("all")}
                    >
                      <span className="bento-stat-num">{lowPriorityCount} tasks</span>
                      <span className="bento-stat-label">Low</span>
                    </div>
                    <div
                      className="bento-stat-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveStatusFilter("all")}
                    >
                      <span className="bento-stat-num">{medPriorityCount} tasks</span>
                      <span className="bento-stat-label">Medium</span>
                    </div>
                    <div
                      className="bento-stat-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => setActiveCategory("Urgent")}
                    >
                      <span className="bento-stat-num">{highPriorityCount} tasks</span>
                      <span className="bento-stat-label">Urgent</span>
                    </div>
                  </div>
                  <div className="triangle-motif" />
                </div>

                {/* 4. Blue Card: Sessions with Live Focus Timer */}
                <div className="bento-card bento-blue">
                  <div className="bento-card-header">
                    <span className="bento-card-title">Focus Sessions:</span>
                    <span
                      className="bento-card-action"
                      onClick={() => setActiveNav("focus")}
                    >
                      {isTimerRunning ? "Live Focusing" : "Open Room"}
                    </span>
                  </div>
                  <div className="focus-timer-box">
                    <div>
                      <div className="focus-time-display">
                        {formatTimer(timerSeconds)}
                      </div>
                      <div className="bento-stat-label">
                        Active Focus Session
                      </div>
                    </div>
                    <div className="focus-controls">
                      <button
                        className="timer-pill-btn"
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause size={13} /> Pause
                          </>
                        ) : (
                          <>
                            <Play size={13} /> Start
                          </>
                        )}
                      </button>
                      <button
                        className="timer-reset-btn"
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(focusPreset * 60);
                        }}
                        title="Reset Timer"
                      >
                        <RotateCcw size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Decorative 8-point starburst motif */}
                  <Sparkles className="card-sticker" size={42} strokeWidth={2.5} />
                </div>
              </section>

              {/* ========================================================
                  BOTTOM SECTION: TASK LIST + TASK DETAILS INSPECTOR
                  ======================================================== */}
              <section className="tasks-details-grid">
                {/* Left: Today's Tasks */}
                <div className="tasks-column">
                  <div className="section-head-row">
                    <h2 className="section-heading">Today's Tasks</h2>
                    <div className="section-filter-pills">
                      {["all", "active", "completed"].map((st) => (
                        <button
                          key={st}
                          type="button"
                          className={`search-pill-btn ${
                            activeStatusFilter === st ? "active" : ""
                          }`}
                          onClick={() => setActiveStatusFilter(st)}
                        >
                          {st.charAt(0).toUpperCase() + st.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fast Inline Add Task Input */}
                  <form className="add-task-bar" onSubmit={handleAddTask}>
                    <Plus size={16} color="#f43f5e" />
                    <input
                      className="add-task-input"
                      placeholder="Add a new task or action item..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <select
                      className="add-task-select"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="Work">Work</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Design">Design</option>
                      <option value="Personal">Personal</option>
                    </select>
                    <select
                      className="add-task-select"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                    >
                      <option value="high">High</option>
                      <option value="medium">Med</option>
                      <option value="low">Low</option>
                    </select>
                    <button
                      type="submit"
                      className="add-task-submit-btn"
                      disabled={!newTitle.trim()}
                    >
                      Add
                    </button>
                  </form>

                  {/* List of Tasks */}
                  <div className="task-items-list">
                    {filteredTasks.length === 0 ? (
                      <div
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "var(--text-muted)",
                          fontSize: "13px",
                        }}
                      >
                        No tasks matching this filter.
                      </div>
                    ) : (
                      filteredTasks.map((t, idx) => {
                        const iconTints = [
                          "icon-pink",
                          "icon-blue",
                          "icon-purple",
                          "icon-green",
                        ];
                        const tint = iconTints[idx % iconTints.length];
                        const isSelected = selectedTaskId === t.id;

                        return (
                          <div
                            key={t.id}
                            className={`task-item-card ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() => setSelectedTaskId(t.id)}
                          >
                            <div className="task-item-left">
                              <div className={`task-icon-circle ${tint}`}>
                                <ListTodo size={16} />
                              </div>
                              <div className="task-texts">
                                <span
                                  className={`task-title-text ${
                                    t.completed ? "completed" : ""
                                  }`}
                                >
                                  {t.title}
                                </span>
                                <span className="task-sub-label">{t.subLabel}</span>
                              </div>
                            </div>

                            <div className="task-item-right">
                              <span className="time-pill-badge">{t.time}</span>
                              <button
                                type="button"
                                className={`task-check-circle ${
                                  t.completed ? "checked" : ""
                                }`}
                                onClick={(e) => handleToggleTask(t.id, e)}
                                title={
                                  t.completed
                                    ? "Mark In-Progress"
                                    : "Mark Completed"
                                }
                              >
                                {t.completed && (
                                  <Check size={13} strokeWidth={3} />
                                )}
                              </button>
                              <button
                                type="button"
                                className="task-delete-icon-btn"
                                onClick={(e) => handleDeleteTask(t.id, e)}
                                title="Delete task"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right: Task Objectives & Details Inspector Card */}
                {selectedTask ? (
                  <div className="task-details-card">
                    <div className="details-card-header">
                      <div>
                        <h3 className="details-task-name">
                          {selectedTask.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "11px",
                            opacity: 0.85,
                            marginTop: 2,
                          }}
                        >
                          Priority: {selectedTask.priority.toUpperCase()} •
                          Target Time: {selectedTask.durationMin} min
                        </p>
                      </div>
                      <span className="details-meta-pill">
                        {selectedTask.codeTag}
                      </span>
                    </div>

                    <div className="details-pills-row">
                      {selectedTask.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className={`badge-tag ${
                            i === 0
                              ? "badge-pink-pill"
                              : i === 1
                              ? "badge-purple-pill"
                              : "badge-outline-pill"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="badge-tag badge-outline-pill">
                        {selectedTask.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    <div className="details-field-block">
                      <span className="details-field-label">Scheduled Time</span>
                      <span style={{ fontSize: "12px", fontWeight: "700" }}>
                        Today at {selectedTask.time} ({selectedTask.durationMin}m
                        timebox)
                      </span>
                    </div>

                    {/* Subtasks checklist */}
                    <div className="details-field-block">
                      <span className="details-field-label">Action Checklist</span>
                      <div className="subtasks-list">
                        {(selectedTask.subtasks || []).map((st) => (
                          <div
                            key={st.id}
                            className="subtask-item"
                            onClick={() => handleToggleSubtask(st.id)}
                          >
                            <span
                              className={`subtask-check ${
                                st.done ? "checked" : ""
                              }`}
                            >
                              {st.done && <Check size={11} strokeWidth={3} />}
                            </span>
                            <span
                              style={{
                                textDecoration: st.done
                                  ? "line-through"
                                  : "none",
                                opacity: st.done ? 0.6 : 1,
                              }}
                            >
                              {st.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="details-field-block">
                      <span className="details-field-label">
                        Task Notes & Specs (Auto-saves offline)
                      </span>
                      <textarea
                        className="details-notes-box"
                        rows={3}
                        value={selectedTask.notes || ""}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="Enter task specs, key requirements, notes..."
                      />
                    </div>

                    <div className="details-actions-row">
                      <button
                        className="details-action-btn-primary"
                        onClick={() => handleToggleTask(selectedTask.id)}
                      >
                        <Check size={14} />
                        {selectedTask.completed
                          ? "Mark In-Progress"
                          : "Mark as Done"}
                      </button>
                      <button
                        className="details-action-btn-secondary"
                        onClick={() => handleDeleteTask(selectedTask.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : null}
              </section>
            </>
          )}

          {/* VIEW: SCHEDULE & AGENDA */}
          {activeNav === "schedule" && (
            <div className="view-container">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Schedule & Agenda</h1>
                  <p className="view-subtitle">
                    Organize events and work sessions for May {selectedDay}, 2024
                  </p>
                </div>
                <button
                  className="add-task-submit-btn"
                  onClick={() => setShowEventModal(true)}
                >
                  <Plus size={15} /> Add Event
                </button>
              </div>

              <div className="timeline-slots-list" style={{ maxWidth: "600px" }}>
                {timeline.map((ev) => (
                  <div key={ev.id} className="timeline-slot-row">
                    <span className="slot-time-col">{ev.time}</span>
                    <div className={`slot-event-card ${ev.theme}`}>
                      <span>{ev.title}</span>
                      <small>{ev.desc}</small>
                      <button
                        className="slot-event-delete-btn"
                        onClick={() => handleDeleteEvent(ev.id)}
                        title="Remove event"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: ALL TASKS */}
          {activeNav === "tasks" && (
            <div className="view-container">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Task Repository</h1>
                  <p className="view-subtitle">
                    {tasks.length} total tasks • {completedCount} completed
                  </p>
                </div>
                <button
                  className="add-task-submit-btn"
                  onClick={() => {
                    const promptTitle = prompt("Quick task title:");
                    if (promptTitle?.trim()) {
                      const newTask = {
                        id: `task-${Date.now()}`,
                        title: promptTitle.trim(),
                        subLabel: "Work • General Task",
                        category: "Work",
                        priority: "medium",
                        time: "12:00 PM",
                        date: new Date().toISOString().split("T")[0],
                        completed: false,
                        codeTag: `AU-${Math.floor(1000 + Math.random() * 9000)}`,
                        durationMin: 30,
                        notes: "Added via Task Repository.",
                        tags: ["Work", "Task"],
                        subtasks: [],
                      };
                      setTasks([newTask, ...tasks]);
                      setSelectedTaskId(newTask.id);
                    }
                  }}
                >
                  <Plus size={15} /> New Task
                </button>
              </div>

              <div className="task-items-list">
                {tasks.map((t) => (
                  <div key={t.id} className="task-item-card">
                    <div className="task-item-left">
                      <div className="task-icon-circle icon-pink">
                        <ListTodo size={16} />
                      </div>
                      <div className="task-texts">
                        <span
                          className={`task-title-text ${
                            t.completed ? "completed" : ""
                          }`}
                        >
                          {t.title}
                        </span>
                        <span className="task-sub-label">
                          {t.category} • Priority: {t.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="task-item-right">
                      <span className="time-pill-badge">{t.time}</span>
                      <button
                        className={`task-check-circle ${
                          t.completed ? "checked" : ""
                        }`}
                        onClick={() => handleToggleTask(t.id)}
                      >
                        {t.completed && <Check size={13} strokeWidth={3} />}
                      </button>
                      <button
                        className="task-delete-icon-btn"
                        onClick={() => handleDeleteTask(t.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: STATISTICS & ANALYTICS */}
          {activeNav === "analytics" && (
            <div className="view-container">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Productivity & Velocity</h1>
                  <p className="view-subtitle">
                    Real-time performance metrics and task completion velocity
                  </p>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <span className="details-field-label">Completion Ratio</span>
                  <div className="analytics-num">
                    {tasks.length > 0
                      ? Math.round((completedCount / tasks.length) * 100)
                      : 0}
                    %
                  </div>
                  <span className="analytics-desc">
                    {completedCount} of {tasks.length} tasks completed
                  </span>
                </div>

                <div className="analytics-card">
                  <span className="details-field-label">Average Velocity</span>
                  <div className="analytics-num">24 min</div>
                  <span className="analytics-desc">Average completion speed</span>
                </div>

                <div className="analytics-card">
                  <span className="details-field-label">Urgent Items</span>
                  <div className="analytics-num">{highPriorityCount}</div>
                  <span className="analytics-desc">High priority tasks in queue</span>
                </div>

                <div className="analytics-card">
                  <span className="details-field-label">Scheduled Sessions</span>
                  <div className="analytics-num">{timeline.length}</div>
                  <span className="analytics-desc">Agenda items today</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: FOCUS ROOM */}
          {activeNav === "focus" && (
            <div className="view-container">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Focus Room</h1>
                  <p className="view-subtitle">
                    Deep work session timer with zero distractions
                  </p>
                </div>
              </div>

              <div className="focus-view-card">
                <div className="focus-presets-row">
                  {[
                    { label: "Pomodoro (25m)", val: 25 },
                    { label: "Deep Work (50m)", val: 50 },
                    { label: "Short Break (15m)", val: 15 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      className={`focus-preset-btn ${
                        focusPreset === p.val ? "active" : ""
                      }`}
                      onClick={() => handleSelectPreset(p.val)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="focus-big-clock">
                  {formatTimer(timerSeconds)}
                </div>

                <div className="focus-big-controls">
                  <button
                    className="focus-play-btn"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause size={18} /> Pause Session
                      </>
                    ) : (
                      <>
                        <Play size={18} /> Start Focus
                      </>
                    )}
                  </button>
                  <button
                    className="timer-reset-btn"
                    style={{ width: "42px", height: "42px" }}
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(focusPreset * 60);
                    }}
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: NOTES & SCRATCHPAD */}
          {activeNav === "notes" && (
            <div className="view-container">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Scratchpad & Notes</h1>
                  <p className="view-subtitle">
                    Jot down thoughts, ideas, and agendas (auto-saved)
                  </p>
                </div>
              </div>

              <div className="notes-container">
                <textarea
                  className="scratchpad-textarea"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Type anything here... It saves automatically in offline storage."
                />
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeNav === "settings" && (
            <div className="view-container">
              <div className="view-header">
                <div>
                  <h1 className="view-title">Settings & Preferences</h1>
                  <p className="view-subtitle">
                    Customize your profile and offline workspace
                  </p>
                </div>
              </div>

              <div className="settings-box">
                <div className="settings-field">
                  <label className="settings-label">Your Name</label>
                  <input
                    className="settings-input"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="settings-field">
                  <label className="settings-label">Color Theme Mode</label>
                  <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                    <button
                      className={`search-pill-btn ${
                        theme === "light" ? "active" : ""
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      Pastel Luxury Light
                    </button>
                    <button
                      className={`search-pill-btn ${
                        theme === "dark" ? "active" : ""
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      Obsidian Dark
                    </button>
                  </div>
                </div>

                <div className="settings-field" style={{ paddingTop: "10px" }}>
                  <label className="settings-label">Data Management</label>
                  <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                    <button
                      className="add-task-submit-btn"
                      onClick={handleExportData}
                    >
                      <Download size={14} /> Export Backup JSON
                    </button>
                    <button
                      className="details-action-btn-secondary"
                      onClick={handleResetData}
                    >
                      Reset Clean Tasks Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================
            RIGHT PANEL: CALENDAR & TIMELINE
            ======================================================== */}
        <aside className="right-panel">
          {/* Calendar Widget */}
          <div className="calendar-widget">
            <div className="calendar-header">
              <button
                className="cal-nav-btn"
                aria-label="Previous month"
                onClick={() => setSelectedMonth("April 2024")}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="cal-month-pill">{selectedMonth}</span>
              <button
                className="cal-nav-btn"
                aria-label="Next month"
                onClick={() => setSelectedMonth("June 2024")}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="calendar-weekdays">
              <span>MO</span>
              <span>TU</span>
              <span>WE</span>
              <span>TH</span>
              <span>FR</span>
              <span>SA</span>
              <span>SU</span>
            </div>

            <div className="calendar-days-grid">
              <span className="cal-day-cell" style={{ opacity: 0.3 }}>
                29
              </span>
              <span className="cal-day-cell" style={{ opacity: 0.3 }}>
                30
              </span>
              {daysInMonth.slice(0, 28).map((d) => (
                <span
                  key={d}
                  className={`cal-day-cell ${d === selectedDay ? "active" : ""}`}
                  onClick={() => setSelectedDay(d)}
                >
                  {d}
                </span>
              ))}
            </div>

            <button
              className="cal-add-event-btn"
              onClick={() => setShowEventModal(true)}
            >
              <Plus size={15} /> Add event
            </button>
          </div>

          {/* Today's Timeline Widget */}
          <div className="timeline-widget">
            <div className="timeline-header">
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  May {selectedDay}
                </span>
                <h3 className="timeline-title">Today's agenda</h3>
              </div>
              <span
                className="timeline-filter-btn"
                onClick={() => setActiveNav("schedule")}
                style={{ cursor: "pointer" }}
              >
                All ▾
              </span>
            </div>

            <div className="timeline-slots-list">
              {timeline.map((ev) => (
                <div key={ev.id} className="timeline-slot-row">
                  <span className="slot-time-col">{ev.time}</span>
                  <div className={`slot-event-card ${ev.theme}`}>
                    <span>{ev.title}</span>
                    <small>{ev.desc}</small>
                    <button
                      className="slot-event-delete-btn"
                      onClick={() => handleDeleteEvent(ev.id)}
                      title="Remove event"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ========================================================
          MODAL: ADD SCHEDULE EVENT
          ======================================================== */}
      {showEventModal && (
        <div className="modal-backdrop" onClick={() => setShowEventModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Schedule New Event</h3>
              <button onClick={() => setShowEventModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="settings-field">
                <label className="settings-label">Event Title</label>
                <input
                  className="settings-input"
                  placeholder="e.g. Architecture Sprint, Client Call"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="settings-field">
                <label className="settings-label">Time Slot</label>
                <input
                  className="settings-input"
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                />
              </div>

              <div className="settings-field">
                <label className="settings-label">Location / Channel</label>
                <input
                  className="settings-input"
                  placeholder="e.g. Google Meet, Zoom, Board Room"
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                />
              </div>

              <div className="settings-field">
                <label className="settings-label">Event Color</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { id: "event-pink", color: "#fbcfe8", label: "Pink" },
                    { id: "event-blue", color: "#bfdbfe", label: "Blue" },
                    { id: "event-yellow", color: "#fef08a", label: "Yellow" },
                    { id: "event-purple", color: "#e9d5ff", label: "Purple" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: c.color,
                        border: newEventColor === c.id ? "2.5px solid #18181b" : "1px solid rgba(0,0,0,0.1)",
                        cursor: "pointer",
                      }}
                      onClick={() => setNewEventColor(c.id)}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  className="add-task-submit-btn"
                  style={{ flex: 1, padding: "10px" }}
                  disabled={!newEventTitle.trim()}
                >
                  Create Event
                </button>
                <button
                  type="button"
                  className="details-action-btn-secondary"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}