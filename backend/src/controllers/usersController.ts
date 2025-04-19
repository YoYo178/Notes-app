import { User } from "@src/models/User";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { isObjectIdOrHexString, ObjectId } from "mongoose";

/**
 * @route GET /users/me
 * @description A query route for the client to know if they're logged in or not
 * @returns HTTP 200
 */
const getLoggedInUser = expressAsyncHandler(async (req: Request, res: Response) => {
    // No need to perform any checks
    // Auth validator middleware handles everything already
    res.status(HttpStatusCodes.OK).send({ message: "User is logged in", user: req.user });
})

/**
 * @route PATCH /users
 * @description Updates an existing user.
 * @returns HTTP 200, 400, 404, 409
 */
const updateUser = expressAsyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword, confirmNewPassword, displayName, email } = req.body;

    // only supporting gmail for now, lol
    if (email && !email.endsWith("@gmail.com")) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Email not supported" });
        return;
    }

    const user = await User.findById(req.user.id).exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const duplicateEmailUser = await User.findOne({ email }).exec();
    if (duplicateEmailUser && duplicateEmailUser.id !== req.user.id) {
        res.status(HttpStatusCodes.CONFLICT).send({ message: "Email is already registered" });
        return;
    }

    const isChangingPassword = currentPassword || newPassword || confirmNewPassword
    if (isChangingPassword) {
        const passwordMatches = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatches) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Invalid password" })
            return;
        }

        if (!newPassword || !confirmNewPassword) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Both new password fields are required" })
            return;
        }

        if (newPassword != confirmNewPassword) {
            res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "New passwords do not match" })
            return;
        }

        user.password = await bcrypt.hash(newPassword, 10);
    }

    user.displayName = displayName || user.displayName;
    user.email = email || user.email;

    await user.save();

    res.status(HttpStatusCodes.OK).send({ message: "User updated successfully" })
})

/**
 * @route DELETE /users
 * @description Deletes a user.
 * @returns HTTP 200, 404
 */
const deleteUser = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    await user.deleteOne();

    res.status(HttpStatusCodes.OK).send({ message: "User deleted successfully" });
})

export default {
    getLoggedInUser,
    updateUser,
    deleteUser
}