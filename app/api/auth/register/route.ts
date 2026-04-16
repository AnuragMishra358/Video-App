import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {
        console.log("inside the register api");
        const {email,password}=await request.json();

        if(!email || !password){
            return NextResponse.json(
                {error:"Email and password are required"},
                {status:400}
            )
        }
        console.log("connecting to db");
        await connectToDatabase();
        console.log("connected to db");

        const existingUser=await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
            {error:"User already registered"},
            {status:400}
            );
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json(
            {message:"User registered successfully"},
            {status:200}
        );

    } catch (error) {
        console.error("Registration error",error);
        return NextResponse.json(
            {error:"Failed to register user"},
            {status:400}
        )
    }
}