import { connectMongoose } from "./mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { ProjectForm } from "@/common.types";

// ✅ Ensure serverUrl is defined for both environments
const isProduction = process.env.NODE_ENV === 'production';
const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_API_URL || 'https://aistudio-eta.vercel.app'
  : 'http://localhost:3000';

export const createProject = async (form: ProjectForm, creatorId: string, token: string) => {
  try {
    await connectMongoose();

    const user = await User.findById(creatorId);
    if (!user) {
      throw new Error("User not found");
    }

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
        }
      }
    };
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const fetchAllProjects = async (category?: string | null, endCursor?: string | null) => {
  try {
    await connectMongoose();

    let query = {};
    if (category && category !== "All") {
      query = { category };
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .limit(8);

    const projectsWithIds = projects.map(project => ({
      ...project.toObject(),
      id: project._id.toString(),
      createdBy: {
        ...project.createdBy,
        id: project.createdBy._id.toString(),
      }
    }));

    return {
      projectSearch: {
        edges: projectsWithIds.map(project => ({ node: project })),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "",
          endCursor: "",
        }
      }
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { projectSearch: { edges: [], pageInfo: {} } };
  }
};

export const getProjectDetails = async (id: string) => {
  try {
    await connectMongoose();

    const project = await Project.findById(id).populate('createdBy', 'name email avatarUrl');

    if (!project) {
      return { project: null };
    }

    return {
      project: {
        ...project.toObject(),
        id: project._id.toString(),
        createdBy: {
          ...project.createdBy,
          id: project.createdBy._id.toString(),
        }
      }
    };
  } catch (error) {
    console.error("Error fetching project details:", error);
    return { project: null };
  }
};

export const getUserProjects = async (id: string, last?: number) => {
  try {
    await connectMongoose();

    const user = await User.findById(id).populate({
      path: 'projects',
      options: { sort: { createdAt: -1 }, limit: last || 4 }
    });

    if (!user) {
      return { user: null };
    }

    const userWithIds = {
      ...user.toObject(),
      id: user._id.toString(),
      projects: {
        edges: user.projects.map((project: any) => ({
          node: {
            ...project,
            id: project._id.toString(),
          }
        })),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "",
          endCursor: "",
        }
      }
    };

    return { user: userWithIds };
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return { user: null };
  }
};

export const deleteProject = async (id: string, token: string) => {
  try {
    await connectMongoose();

    const project = await Project.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }

    await User.findByIdAndUpdate(
      project.createdBy,
      { $pull: { projects: id } }
    );

    await Project.findByIdAndDelete(id);

    return { deletedId: id };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
  try {
    await connectMongoose();

    const project = await Project.findByIdAndUpdate(
      projectId,
      form,
      { new: true }
    ).populate('createdBy', 'name email avatarUrl');

    if (!project) {
      throw new Error("Project not found");
    }

    return {
      project: {
        ...project.toObject(),
        id: project._id.toString(),
        createdBy: {
          ...project.createdBy,
          id: project.createdBy._id.toString(),
        }
      }
    };
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const getUser = async (email: string) => {
  try {
    await connectMongoose();

    const user = await User.findOne({ email });

    if (!user) {
      return { user: null };
    }

    return {
      user: {
        ...user.toObject(),
        id: user._id.toString(),
      }
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { user: null };
  }
};

export const createUser = async (name: string, email: string, avatarUrl: string) => {
  try {
    await connectMongoose();

    const user = await User.create({
      name,
      email,
      avatarUrl,
    });

    return {
      user: {
        ...user.toObject(),
        id: user._id.toString(),
      }
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// ✅ Improved error logging and validation
export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Fetch failed: ${response.status} - ${text}`);
    }
    return response.json();
  } catch (err) {
    console.error("Error in fetchToken:", err);
    throw err;
  }
};

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: imagePath }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Image upload failed: ${response.status} - ${text}`);
    }
    return response.json();
  } catch (err) {
    console.error("Error in uploadImage:", err);
    throw err;
  }
};

export const createNewProject = createProject;
