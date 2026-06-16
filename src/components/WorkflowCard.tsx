import { useState } from "react";
import type { Workflow } from "../lib/api";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="workflow-card" id={workflow.slug}>
      <p className="meta">{workflow.difficulty} · {workflow.estimatedMinutes} min</p>
      <h3>{workflow.title}</h3>
      <p>{workflow.summary}</p>
      <div className="tool-meta">
        {workflow.toolsUsed.slice(0, 4).map((tool) => <span className="tag" key={tool}>{tool}</span>)}
      </div>
      {expanded ? <p className="workflow-detail" id={`${workflow.slug}-detail`}>{workflow.content}</p> : null}
      <button
        className="workflow-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={`${workflow.slug}-detail`}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "收起模板" : "查看模板"}
      </button>
    </article>
  );
}
