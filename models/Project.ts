import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    image: string;
    liveSiteUrl: string;
    githubUrl: string;
    category: string;
    createdBy: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        liveSiteUrl: { type: String, required: true },
        githubUrl: { type: String, required: true },
        category: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Project = models?.Project || model<IProject>('Project', ProjectSchema);

export default Project;
