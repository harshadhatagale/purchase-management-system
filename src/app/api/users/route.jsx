import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function GET(req) {
    await dbConnect();
    try {
        const users = await User.find({})
        return NextResponse.json(users, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 })
    }
}
export async function DELETE(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
    }
}

export async function PUT(req) {
    await dbConnect();
    const { id, ...data } = await req.json()

    if (!id) {
        return NextResponse.json({ message: "User id required" }, { status: 400 })
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        if (!updatedUser) {
            return NextResponse.json({ message: "User not found." }, { status: 404 })
        }
        return NextResponse.json(updatedUser, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Failed to update users" }, { status: 500 })
    }
}