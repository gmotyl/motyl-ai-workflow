import { NavLink } from "react-router-dom";
import { Cpu, FolderOpen, GitBranch, Star } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useAgents } from "../hooks/useAgents";
import { useFavorites } from "../hooks/useFavorites";
import AgentCard from "./AgentCard";
import GitSummary from "./GitSummary";

function SectionHeader({ icon: Icon, label }: { icon: typeof Cpu; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <Icon size={12} style={{ color: "var(--text-tertiary)" }} />
      <h2 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </h2>
    </div>
  );
}

export default function LeftSidebar() {
  const projects = useProjects();
  const agents = useAgents();
  const { toggle, isFavorite, sortWithFavorites } = useFavorites();

  const sorted = sortWithFavorites(projects);

  return (
    <div className="p-3 overflow-auto h-full flex flex-col gap-5 pt-10">
      <section>
        <SectionHeader icon={Cpu} label="Agents" />
        {agents.length === 0 ? (
          <p className="text-xs px-1" style={{ color: "var(--text-muted)" }}>No active agents</p>
        ) : (
          <div className="space-y-1">
            {agents.map((a) => <AgentCard key={a.pid} agent={a} />)}
          </div>
        )}
      </section>

      <section>
        <SectionHeader icon={FolderOpen} label="Projects" />
        <ul className="space-y-0.5">
          {sorted.map((project) => {
            const fav = isFavorite(project.name);
            return (
              <li key={project.name} className="flex items-center group">
                <button
                  onClick={(e) => { e.preventDefault(); toggle(project.name); }}
                  className="p-1 rounded transition-colors shrink-0"
                  title={fav ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    size={12}
                    fill={fav ? "var(--accent)" : "none"}
                    style={{ color: fav ? "var(--accent)" : "var(--text-muted)", opacity: fav ? 1 : 0, transition: "all 150ms" }}
                    className="group-hover:!opacity-100"
                  />
                </button>
                <NavLink
                  to={`/project/${project.name}`}
                  className={({ isActive }) =>
                    `block flex-1 text-[13px] px-1 py-1 rounded-md transition-all duration-150 ${isActive ? "font-medium" : ""}`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    background: isActive ? "var(--bg-active)" : "transparent",
                  })}
                >
                  {project.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-auto">
        <SectionHeader icon={GitBranch} label="Git" />
        <GitSummary />
      </section>
    </div>
  );
}
