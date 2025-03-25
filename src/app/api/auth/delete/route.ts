//Implementing the delete account logic
import { NextResponse } from "next/server";
import User from "@/models/users";
import connectionToDatabase from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);
        //Check if the user has session
        if (!session || !session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        await connectionToDatabase();

        //Find and delete the user
        const deletedUser = await User.findOneAndDelete({
            email: session?.user?.email,
        });

        if (!deletedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Account deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete Account Error:", error);
        return NextResponse.json(
            { message: "Something went worong" },
            { status: 500 }
        );
    }
}
