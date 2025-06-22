import { connectMongoose } from "./mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { ProjectForm } from "@/common.types";

const isProduction = process.env.NODE_ENV === "production";
const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_API_URL || "https://aistudio-eta.vercel.app"
  : "http://localhost:3000";

// CREATE PROJECT
export const createProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  try {
    await connectMongoose();

    if (!creatorId) throw new Error("creatorId is required");

    const user = await User.findById(creatorId);
    if (!user) throw new Error("User not found");

    const newProject = await Project.create({
      ...form,
      createdBy: creatorId,
    });

    user.projects.push(newProject._id);
    await user.save();

    return {
      project: {
        ...newProject.toObject(),
        id: newProject._id.toString(),
        createdBy: {
          ...user.toObject(),
          id: user._id.toString(),
        },
      },
    };
  } catch (error: any) {
    console.error("Error creating project:", error.message || error);
    throw new Error(error.message || "Failed to create project");
  }
};

// FETCH ALL PROJECTS
export const fetchAllProjects = async (
  category?: string | null,
  endCursor?: string | null
) => {
  try {
    await connectMongoose();

    const query: any = {};
    if (category && category !== "All") query.category = category;

    const projects = await Project.find(query)
      .populate("createdBy", "name email avatarUrl")
      .sort({ createdAt: -1 })
      .limit(8);

    const edges = projects.map((project) => ({
      node: {
        ...project.toObject(),
        id: project._id.toString(),
        createdBy: {
          ...project.createdBy.toObject(),
          id: project.createdBy._id.toString(),
        },
      },
    }));

    return {
      projectSearch: {
        edges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "",
          endCursor: "",
        },
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { projectSearch: { edges: [], pageInfo: {} } };
  }
};

// GET PROJECT DETAILS
export const getProjectDetails = async (id: string) => {
  try {
    await connectMongoose();

    const project = await Project.findById(id).populate(
      "createdBy",
      "name email avatarUrl"
    );
    if (!project) return { project: null };

    return {
      project: {
        ...project.toObject(),
        id: project._id.toString(),
        createdBy: {
          ...project.createdBy.toObject(),
          id: project.createdBy._id.toString(),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching project details:", error);
    return { project: null };
  }
};

// GET USER PROJECTS
export const getUserProjects = async (id: string, last: number = 4) => {
  try {
    await connectMongoose();

    const user = await User.findById(id).populate({
      path: "projects",
      options: { sort: { createdAt: -1 }, limit: last },
    });

    if (!user) return { user: null };

    return {
      user: {
        ...user.toObject(),
        id: user._id.toString(),
        projects: {
          edges: user.projects.map((project: any) => ({
            node: {
              ...project.toObject(),
              id: project._id.toString(),
            },
          })),
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "",
            endCursor: "",
          },
        },
      },
    };
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return { user: null };
  }
};

// DELETE PROJECT
export const deleteProject = async (id: string, token: string) => {
  try {
    await connectMongoose();

    const project = await Project.findById(id);
    if (!project) throw new Error("Project not found");

    await User.findByIdAndUpdate(project.createdBy, {
      $pull: { projects: id },
    });

    await Project.findByIdAndDelete(id);

    return { deletedId: id };
  } catch (error: any) {
    console.error("Error deleting project:", error.message || error);
    throw new Error(error.message || "Failed to delete project");
  }
};

// UPDATE PROJECT
export const updateProject = async (
  form: ProjectForm,
  projectId: string,
  token: string
) => {
  try {
    await connectMongoose();

    const project = await Project.findByIdAndUpdate(projectId, form, {
      new: true,
    }).populate("createdBy", "name email avatarUrl");

    if (!project) throw new Error("Project not found");

    return {
      project: {
        ...project.toObject(),
        id: project._id.toString(),
        createdBy: {
          ...project.createdBy.toObject(),
          id: project.createdBy._id.toString(),
        },
      },
    };
  } catch (error: any) {
    console.error("Error updating project:", error.message || error);
    throw new Error(error.message || "Failed to update project");
  }
};

// GET USER BY EMAIL
export const getUser = async (email: string) => {
  try {
    await connectMongoose();

    const user = await User.findOne({ email });
    if (!user) return { user: null };

    return {
      user: {
        ...user.toObject(),
        id: user._id.toString(),
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { user: null };
  }
};

// CREATE USER
export const createUser = async (
  name: string,
  email: string,
  avatarUrl: string
) => {
  try {
    await connectMongoose();

    const user = await User.create({ name, email, avatarUrl });

    return {
      user: {
        ...user.toObject(),
        id: user._id.toString(),
      },
    };
  } catch (error: any) {
    console.error("Error creating user:", error.message || error);
    throw new Error(error.message || "Failed to create user");
  }
};

// FETCH TOKEN
export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    if (!response.ok) throw new Error("Failed to fetch token");

    return response.json();
  } catch (error: any) {
    console.error("Error fetching token:", error.message || error);
    throw error;
  }
};

// UPLOAD IMAGE
export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: imagePath }),
    });

    if (!response.ok) throw new Error("Image upload failed");

    return response.json();
  } catch (error: any) {
    console.error("Error uploading image:", error.message || error);
    throw error;
  }
};

// Export alias
export const createNewProject = createProject;
