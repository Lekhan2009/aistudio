import { connectMongoose } from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { fetchAllProjects } from "@/lib/actions";

export const getProjects = async (category?: string | null, endCursor?: string | null) => {
  return await fetchAllProjects(category, endCursor);
};

export const getProjectById = async (id: string) => {
  try {
    await connectMongoose();
    const project = await Project.findById(id).populate('createdBy');

    if (!project) return null;

    return {
      ...project.toObject(),
      id: project._id.toString(),
      createdBy: {
        ...project.createdBy.toObject(),
        id: project.createdBy._id.toString()
      }
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const getProjectsOfUser = async (id: string, last?: number) => {
  try {
    await connectMongoose();
    const projects = await Project.find({ createdBy: id })
      .populate('createdBy')
      .sort({ createdAt: -1 })
      .limit(last || 4);

    return {
      projects: projects.map(project => ({
        ...project.toObject(),
        id: project._id.toString(),
        createdBy: {
          ...project.createdBy.toObject(),
          id: project.createdBy._id.toString()
        }
      }))
    };
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return { projects: [] };
  }
};

export const getUserById = async (id: string) => {
  try {
    await connectMongoose();
    const user = await User.findById(id).populate('projects');

    if (!user) return null;

    return {
      ...user.toObject(),
      id: user._id.toString()
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};