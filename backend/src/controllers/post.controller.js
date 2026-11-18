import { Post } from "../models/post.model.js";

// Create a new post
const createPost = async (req, res) => {
    try {
        const { name, description, age } = req.body;

        // Make sure all the fields are present
        if (!name || !description || age === undefined || age === null || age === "") {
            return res.status(400).json({
                message: "Please provide name, description and age"
            });
        }

        const newPost = await Post.create({
            name,
            description,
            age
        });

        res.status(201).json({
            message: "New post has been created",
            post: newPost
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not create the post",
            error: error.message
        });
    }
};


// Get all posts from the database
const getPosts = async (req, res) => {
    try {
        const allPosts = await Post.find();

        res.status(200).json({
            totalPosts: allPosts.length,
            posts: allPosts
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not fetch posts",
            error: error.message
        });
    }
};


// Update an existing post
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedDetails = req.body;

        // Do not continue if the request body is empty
        if (Object.keys(updatedDetails).length === 0) {
            return res.status(400).json({
                message: "Enter at least one detail to update"
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            updatedDetails,
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                message: "No post found with this ID"
            });
        }

        res.status(200).json({
            message: "Post details updated",
            post: updatedPost
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not update the post",
            error: error.message
        });
    }
};


// Delete a post using its ID
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const removedPost = await Post.findByIdAndDelete(postId);

        if (!removedPost) {
            return res.status(404).json({
                message: "No post found with this ID"
            });
        }

        res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not delete the post",
            error: error.message
        });
    }
};


export {
    createPost,
    getPosts,
    updatePost,
    deletePost
};
