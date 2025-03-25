import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
    email: string;
    name?: string;
    bio?: string;
    avatar?: string;
    password?: string;
    githubId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        name: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
        bio: {
            type: String,
            trim: true,
            required: false,
            maxlength: 160,
        },
        avatar: {
            type: String,
            required: false,
        },
        githubId: {
            type: String,
            unique: true,
            sparse: true, // Allow multiple nulls (for non-GitHub users)
        },
    },
    {
        timestamps: true, //Auto-add createdAt and updated at
    }
);

//Indexing for faster db queries
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
