import mongoose from "mongoose";
import { video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { user } = req.user;

  const userId = req.user._id;

//   console.log(userId);
 const userExists = await User.findById(userId);

 if (!userExists) {
    throw new ApiError(400, "user does not exists");
  }

  const VideoDetails = await video.findOne({ owner: userId });

  if (!VideoDetails) {
    throw new ApiError(400, "No videos found");
  }

  return res
  .status(201)
  .json(new ApiResponse(200, VideoDetails, "Video Details fetched sucessfully"));
});

export { getChannelStats, getChannelVideos };
