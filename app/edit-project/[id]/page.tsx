import { redirect, notFound } from "next/navigation";

import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getCurrentUser } from "@/lib/session";
import { getProjectDetails } from "@/lib/actions";
import { ProjectInterface } from "@/common.types";

interface EditProjectProps {
  params: { id: string };
}

const EditProject = async ({ params: { id } }: EditProjectProps) => {
  try {
    const session = await getCurrentUser();

    if (!session?.user) {
      redirect("/");
    }

    const result = await getProjectDetails(id) as { project?: ProjectInterface };

    if (!result?.project) {
      // Option 1: Show message
      return <p className="no-result-text">Failed to fetch project info</p>;

      // Option 2: Redirect to 404
      // notFound();
    }

    return (
      <Modal>
        <h3 className="modal-head-text">Edit Project</h3>
        <ProjectForm type="edit" session={session} project={result.project} />
      </Modal>
    );
  } catch (error) {
    console.error("Error loading edit project page:", error);
    return <p className="no-result-text">Something went wrong. Please try again later.</p>;
  }
};

export default EditProject;
