export function EmptyState({ children }: { children: string }) {
  return <div className="empty-state">{children}</div>;
}

export function LoadingCards({ label }: { label: string }) {
  return (
    <div className="empty-state" aria-busy="true">
      {label}
    </div>
  );
}
