//Update user information logic
import { NextResponse } from "next/server";
import User from "@/models/users";
import connectionToDatabase from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(requests: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name } = await requests.json();

        await connectionToDatabase();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { name },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Profile updated", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update Profile Error: ", error);
        return NextResponse.json(
            { message: "Something went wrogn" },
            { status: 500 }
        );
    }
}
