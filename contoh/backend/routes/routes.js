const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersControl");
const postController = require("../controllers/postsControl");
const voteController = require("../controllers/votesConrtol");
const commentController = require("../controllers/commentControl")
const authJWT = require("../middleware/auth");
// Routes User
router.get("/users", userController.getAllUsers); 
router.get("/users/:id", userController.getUserById); 
router.post("/users/register", userController.registerUser); 
router.post("/users/login", userController.login); 
router.put("/profile/:id", userController.uploadAvatar.single("avatar"), userController.updateUserProfile);
// Routes Post
router.get("/posts", postController.getAllPosts); 
router.get("/posts/:id", postController.getPostById); 
router.get("/post/:userId", postController.getPostsByUserId);
router.post("/posts", authJWT, postController.upload.single('media'), postController.createPost);
router.put("/posts/:id", authJWT, postController.upload.single('media'), postController.updatePost);
router.delete("/posts/:id", authJWT, postController.deletePost); // delete post harus login

// Routes Vote
router.post("/votes/:postId", authJWT, voteController.votePost); // tambah atau update vote harus login
router.delete("/votes/:postId", authJWT, voteController.removeVote); // hapus vote harus login
router.get("/votes/:postId", voteController.getVotes); // ambil vote post bisa public

// Routes Comment
router.get("/comments/:postId", commentController.getComments);
router.post("/comments/:postId", authJWT, commentController.createComment);
router.delete("/comments/:commentId", authJWT, commentController.deleteComment);
module.exports = router;