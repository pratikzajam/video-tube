import {Router} from "express";
import {loginUser,logoutUser,registerUser,refreshAccessToken,getCurrentUser,updateUserAccountDetails} from '../controllers/user.controller.js';
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(
    upload.fields([{name:"avatar",
        Maxcount:1,
    },{name:"coverImage",
    Maxcount:1
    }
]),





    registerUser,)

    router.route("/login").post(loginUser)

 router.route("/logout").post(verifyJWT,logoutUser)

 router.route("/refresh-token").post(refreshAccessToken)
 router.route("/getCurrentUser").post(verifyJWT,getCurrentUser)
 router.route("/updateuser").post(updateUserAccountDetails)

export default router