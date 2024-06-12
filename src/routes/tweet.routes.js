import {Router} from "express";
import {createTweet,deleteTweet,updateTweet,getUserTweets} from '../controllers/tweet.controller.js';
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()


router.route("/createtweet").post(createTweet);
router.route("/deletetweet/:tweetId").delete(deleteTweet);
router.route("/updatetweet/:tweetId").patch(updateTweet);
router.route("/getusertweets/:userId").get(getUserTweets);

export default router




  