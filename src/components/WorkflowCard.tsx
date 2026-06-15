import type { Workflow } from "../lib/api";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <article className="workflow-card" id={workflow.slug}>
      <p className="meta">{workflow.difficulty} · {workflow.estimatedMinutes} min</p>
      <h3>{workflow.title}</h3>
      <p>{workflow.summary}</p>
      <div className="tool-meta">
        {workflow.toolsUsed.slice(0, 4).map((tool) => <span className="tag" key={tool}>{tool}</span>)}
      </div>
      <a href={`/workflows/#${workflow.slug}`}>查看模板</a>
    </article>
  );
}
