import {Router} from "express";
import {getChannelVideos,getChannelStats} from '../controllers/dashboard.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router()


router.route("/getchannelvideos").post(verifyJWT,getChannelVideos);
router.route("/getChannelstats").post(verifyJWT,getChannelStats);



export default router
