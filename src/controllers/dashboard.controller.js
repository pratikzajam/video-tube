import mongoose from "mongoose";
import { video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Sothing went wrong");
  }

 const userExists = await User.findById(userId);

  if (!userExists) {
    throw new ApiError(400, "user does not exists");
  }

  const tweetDetails=await Like.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },   
    //   {
    //   $lookup: {
    //     from: "users",
    //     localField: "owner",
    //     foreignField: "_id",
    //     as: "owner",
    //     pipeline: [
    //       {
    //         $project: {
    //           _id: 1,
    //           username: 1,
    //           fullname: 1,
    //           avatar: 1,
    //         },
    //       },
    //     ],
    //   },
    // },
    // {
    //   $addFields: {
    //     owner: {
    //       $first: "$owner",
    //     },
    //   },
    // },

  ])

  console.log(tweetDetails);
  process.exit(0);



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
    .json(
      new ApiResponse(200, VideoDetails, "Video Details fetched sucessfully")
    );
});

export { getChannelStats, getChannelVideos };
