import {Router} from "express";
import {toggleVideoLike,toggleCommentLike,toggleTweetLike,getLikedVideos} from '../controllers/like.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router()


router.route("/likevideo/:videoId").post(verifyJWT,toggleVideoLike);
router.route("/likecomment/:commentId").post(verifyJWT,toggleCommentLike);
router.route("/liketweet/:tweetId").post(verifyJWT,toggleTweetLike);
router.route("/getlikedvideos").post(verifyJWT,getLikedVideos);


export default router




  