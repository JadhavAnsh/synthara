import { CreateProjectForm } from "@/components/projects/create-project-form";

export default function NewProjectPage() {
  return (
    <div>
      <p className="text-sm font-medium text-primary">New project</p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-ink">
        Start a research project
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-body">
        Choose your topic and citation style before collecting sources. IEEE and
        Harvard are supported in this foundation release.
      </p>

      <div className="mt-10">
        <CreateProjectForm />
      </div>
    </div>
  );
}
