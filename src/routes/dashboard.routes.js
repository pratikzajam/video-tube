import {Router} from "express";
import {getChannelVideos} from '../controllers/dashboard.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router()


router.route("/getchannelvideos").post(verifyJWT,getChannelVideos);



export default router
