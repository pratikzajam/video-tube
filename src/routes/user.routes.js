import {Router} from "express";
import {loginUser,logoutUser,registerUser,refreshAccessToken,getCurrentUser,updateUserAccountDetails,changeCurrentPassword, updateUserAvatar,getUserChannelProfile} from '../controllers/user.controller.js';
import {uploadVideo,videoDetails,deleteVideo,getVideoById,togglePublishStatus,updateVideo} from '../controllers/video.controller.js';
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


router.route("/uploadVideo").post(
    upload.fields([{name:"video",
        Maxcount:1,
    },{name:"thumbnail",
    Maxcount:1
    }
]),
uploadVideo,)


router.route("/login").post(loginUser);
router.route('/video/:videoId').delete(deleteVideo);
router.route('/getVideo/:videoId').get(getVideoById);
router.route('/changeStatus/:videoId').get(togglePublishStatus);
router.route("/videoDetails").post(videoDetails)

router.route("/updatevideoDetails/:videoId").patch(verifyJWT,upload.fields([{name:"thumbnail",
Maxcount:1
}
]),updateVideo);

 router.route("/logout").post(verifyJWT,logoutUser)

 router.route("/refresh-token").post(refreshAccessToken)
 router.route("/getCurrentUser").post(verifyJWT,getCurrentUser)
 router.route("/update-account").patch(verifyJWT,updateUserAccountDetails)
 router.route("/change-password").post(changeCurrentPassword)

 router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);
 router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),)

 router.route("/c/:uername").get(verifyJWT,getUserChannelProfile);



export default router