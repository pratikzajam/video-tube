import {Router} from "express";
import {createPlaylist,addVideoToPlaylist,deletePlaylist,removeVideoFromPlaylist,getUserPlaylists,getPlaylistById,updatePlaylist} from '../controllers/playlist.controller.js';
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()


router.route("/createplaylist").post(createPlaylist);

router.route("/getuserplaylists/:userId").post(getUserPlaylists);
router.route("/getplaylistbyid/:playlistId").post(getPlaylistById);
router.route("/updateplaylist/:playlistId").patch(updatePlaylist);
router.route("/deletePlaylist/:playlistId").delete(deletePlaylist);
router.route("/addvideo/:playlistId/:videoId").post(addVideoToPlaylist);
router.route("/removevideo/:playlistId/:videoId").post(removeVideoFromPlaylist);


export default router




  