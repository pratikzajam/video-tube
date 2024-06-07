import {Router} from "express";
import {addComment,deleteComment,updateComment} from '../controllers/comment.controller.js';
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()


router.route("/addComment").post(addComment);
router.route("/deleteComment").post(deleteComment);
router.route("/updateComment").patch(updateComment);


export default router




  