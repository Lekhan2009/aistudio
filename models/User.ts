import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  githubUrl: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
  }],
}, {
  timestamps: true,
});

// This avoids the "undefined models" error
const User = models?.User || model('User', UserSchema);

export default User;
