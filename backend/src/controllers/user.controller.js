import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check that all details have been entered
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please enter all the required details"
            });
        }

        // Find out whether this email is already registered
        const userExists = await User.findOne({
            email: email.toLowerCase()
        });

        if (userExists) {
            return res.status(400).json({
                message: "An account with this email already exists"
            });
        }

        // Save the new user
        const newUser = await User.create({
            username,
            email: email.toLowerCase(),
            password
        });

        res.status(201).json({
            message: "Registration completed successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while registering",
            error: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check whether email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Search for the user using the email
        const foundUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (!foundUser) {
            return res.status(404).json({
                message: "No user found with this email"
            });
        }

        // Check the entered password with the saved password
        const passwordCorrect = await foundUser.comparePassword(password);

        if (!passwordCorrect) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong during login",
            error: error.message
        });
    }
};


const logoutuser = async (req, res) => {
    try {
        const { email } = req.body;

        // Check whether the user is registered
        const loggedInUser = await User.findOne({
            email: email
        });

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to logout",
            error: error.message
        });
    }
};


export {
    registerUser,
    loginUser,
    logoutuser
};
