type WorkflowStepCardProps = { title: string; description: string; index: number };
export function WorkflowStepCard({ title, description, index }: WorkflowStepCardProps) {
  return <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-hairline py-7">
    <span className="pt-1 text-sm tabular-nums text-primary">{index + 1}</span>
    <div><h3 className="text-2xl text-ink">{title}</h3><p className="mt-3 text-base leading-7 text-body">{description}</p></div>
  </div>;
}
