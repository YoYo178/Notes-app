import { User } from "@src/models/User";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { ObjectId } from "mongoose";

/**
@route POST /users
@description Creates a new user.
*/
const createUser = expressAsyncHandler(async (req: Request, res: Response) => {
    const { username, password, displayName, email } = req.body;

    if (!username || !password || !displayName || !email) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "All fields are required" })
        return;
    }

    // only supporting gmail for now, lol
    if (!email.endsWith("@gmail.com")) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Email not supported" });
        return;
    }

    // Check username, if it's already taken
    const usernameExists = !!await User.findOne({ username }).select('-password').lean().exec()

    if (usernameExists) {
        res.status(HttpStatusCodes.CONFLICT).send({ message: "A user already exists with the provided username" })
        return;
    }

    // Check email, if the user already has an account with this email
    const userEmailExists = !!await User.findOne({ email }).select('-password').lean().exec()

    if (userEmailExists) {
        res.status(HttpStatusCodes.CONFLICT).send({ message: "A user already exists with the provided email" })
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword,
        displayName,
        email
    });

    if (user) {
        res.status(HttpStatusCodes.CREATED).send({ message: `User created successfully`, id: (user._id as ObjectId).toString() })
        return;
    } else {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured while creating a new user." })
    }
})

/**
@route PATCH /users
@description Updates an existing user.
*/
const updateUser = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id, username, password, displayName, email } = req.body;

    // only supporting gmail for now, lol
    if (email && !email.endsWith("@gmail.com")) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Email not supported" });
        return;
    }

    const user = await User.findById(id).exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const duplicateUsername = await User.findOne({ username }).exec()
    if (duplicateUsername && (duplicateUsername._id as ObjectId).toString() !== id) {
        res.status(HttpStatusCodes.CONFLICT).send({ message: "Username already exists" });
        return;
    }

    const duplicateEmail = await User.findOne({ email }).exec();
    if (duplicateEmail && (duplicateEmail._id as ObjectId).toString() !== id) {
        res.status(HttpStatusCodes.CONFLICT).send({ message: "Email is already registered" });
        return;
    }

    user.username = username || user.username;
    user.displayName = displayName || user.displayName;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.email = email || user.email;

    await user.save();

    res.status(HttpStatusCodes.OK).send({ message: "User updated successfully" })
})

/**
@route DELETE /users
@description Deletes a user.
*/
const deleteUser = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!id) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "User ID is required" })
        return;
    }

    const user = await User.findById(id);

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    await user.deleteOne();

    res.status(HttpStatusCodes.OK).send({ message: "User deleted successfully" });
})

export default {
    createUser,
    updateUser,
    deleteUser
}