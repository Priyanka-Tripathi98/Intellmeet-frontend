import React, { useState, useEffect } from "react";
import { Briefcase, Folder, ExternalLink, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

export function WorkspaceView() {
  // 💾 Load from localStorage or set defaults with custom statuses
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("workspace_kanban_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, text: "Update API endpoints for IntelMeet", status: "todo" },
      { id: 2, text: "Review UI/UX with design team", status: "inprogress" },
      { id: 3, text: "Setup local development environment", status: "done" },
    ];
  });
  
  const [newTask, setNewTask] = useState("");

  const [projects] = useState([
    { id: 1, name: "IntellMeet Core Dev", role: "Owner", platform: "GitHub" },
    { id: 2, name: "Marketing Landing Page", role: "Collaborator", platform: "GitLab" },
  ]);

  // 💾 Sync tasks to localStorage when changes occur
  useEffect(() => {
    localStorage.setItem("workspace_kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, status: "todo" }]);
    setNewTask("");
  };

  // 🚀 Moves a task sequentially through columns
  const moveTask = (id, direction) => {
    const statuses = ["todo", "inprogress", "done"];
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const currentIndex = statuses.indexOf(task.status);
        const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < statuses.length) {
          return { ...task, status: statuses[nextIndex] };
        }
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Helper component for columns to keep code organized
  const KanbanColumn = ({ title, statusKey, bgColor }) => {
    const filteredTasks = tasks.filter(t => t.status === statusKey);
    return (
      <div style={{ background: "#1e1e2e", padding: "16px", borderRadius: "12px", border: "1px solid #2d2d3f", display: "flex", flexDirection: "column", gap: "12px", minHeight: "350px" }}>
        <h3 style={{ margin: "0 0 10px 0", paddingBottom: "8px", borderBottom: `2px solid ${bgColor}`, fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {title} ({filteredTasks.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 }}>
          {filteredTasks.map(task => (
            <div key={task.id} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", background: "#11111b", borderRadius: "8px", borderLeft: `4px solid ${bgColor}` }}>
              <span style={{ color: task.status === "done" ? "#64748b" : "#fff", textDecoration: task.status === "done" ? "line-through" : "none", fontSize: "14px", wordBreak: "break-word" }}>
                {task.text}
              </span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {statusKey !== "todo" && (
                    <button onClick={() => moveTask(task.id, "prev")} style={{ background: "#2d2d3f", border: "none", color: "#fff", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <ArrowLeft size={14} />
                    </button>
                  )}
                  {statusKey !== "done" && (
                    <button onClick={() => moveTask(task.id, "next")} style={{ background: "#2d2d3f", border: "none", color: "#fff", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
                <button onClick={() => deleteTask(task.id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && <p style={{ color: "#475569", fontSize: "13px", textAlign: "center", margin: "auto 0" }}>No tasks</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="workspace-container" style={{ padding: "clamp(12px, 4vw, 24px)", color: "#fff", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Dynamic Mobile Styling Injection */}
      <style>{`
        .responsive-grid-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .responsive-grid-kanban {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .responsive-grid-kanban {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .responsive-grid-top {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .task-form-container {
            flex-direction: column;
          }
          .task-form-btn {
            width: 100%;
            padding: 12px !important;
          }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <Briefcase size={24} color="#a855f7" />
        <h2 style={{ margin: 0, fontSize: "clamp(20px, 5vw, 28px)" }}>Team Workspace</h2>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Row 1: Add Task Form & Projects */}
        <div className="responsive-grid-top">
          
          {/* Create Task Box */}
          <div style={{ background: "#1e1e2e", padding: "20px", borderRadius: "12px", border: "1px solid #2d2d3f" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "16px" }}>➕ Add New Task</h3>
            <form onSubmit={handleAddTask} className="task-form-container" style={{ display: "flex", gap: "10px" }}>
              <input 
                type="text" 
                placeholder="Type a task and hit enter..." 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", border: "1px solid #2d2d3f", background: "#11111b", color: "#fff", fontSize: "14px" }}
              />
              <button className="task-form-btn" type="submit" style={{ background: "#a855f7", border: "none", color: "#fff", padding: "0 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" }}>
                Add Task
              </button>
            </form>
          </div>

          {/* Projects Summary (Uncommented and structured to be safe when active) */}
          <div style={{ background: "#1e1e2e", padding: "20px", borderRadius: "12px", border: "1px solid #2d2d3f" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}><Folder size={18} /> Active Repos</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#11111b", borderRadius: "8px" }}>
                  <div style={{ minWidth: 0, flex: 1, marginRight: "8px" }}>
                    <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proj.name}</h4>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{proj.platform}</span>
                  </div>
                  <button style={{ background: "transparent", border: "none", color: "#6366f1", cursor: "pointer", padding: "4px" }}><ExternalLink size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Kanban Boards */}
        <div className="responsive-grid-kanban">
          <KanbanColumn title="To Do" statusKey="todo" bgColor="#ef4444" />
          <KanbanColumn title="In Progress" statusKey="inprogress" bgColor="#f59e0b" />
          <KanbanColumn title="Done" statusKey="done" bgColor="#22c55e" />
        </div>

      </div>
    </div>
  );
}

export default WorkspaceView;