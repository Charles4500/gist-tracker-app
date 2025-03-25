import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/users";
import connectionToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
    const { email, password, confirmPassword } = await request.json();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    if (!email || !password || !confirmPassword) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }
    if (!isValidEmail(email)) {
        return NextResponse.json(
            { message: "Invalid email format" },
            { status: 400 }
        );
    }
    if (confirmPassword !== password) {
        return NextResponse.json(
            { message: "Passwords do not match" },
            { status: 400 }
        );
    }
    if (password.length < 6) {
        return NextResponse.json(
            {
                message: "Password must be at least 6 character long",
            },
            { status: 400 }
        );
    }
    try {
        await connectionToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                {
                    message: "User already exists",
                },
                { status: 400 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        //Extracting the name of the user from email
        const name = email.split("@")[0]?.replace(/[^a-zA-Z]/g, "");

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
        });
        await newUser.save();
        return NextResponse.json(
            { message: "Registered Successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}
