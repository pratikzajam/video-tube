import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  console.log(req.user);

  if (!userId) {
    throw new ApiError(400, "Something went wrong");
  }

  const checkIfVideoLiked = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (checkIfVideoLiked) {
    const deleteRecord = await Like.deleteOne({
      video: videoId,
      likedBy: userId,
    });

    var message = "Video disliked sucessfully";
  } else {
    const createRecord = await Like.create({
      video: videoId,
      likedBy: userId,
    });
    var message = "Video liked sucessfully";
  }

  return res.status(201).json(new ApiResponse(200, message));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Something went wrong");
  }

  const checkIfVideoLiked = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (checkIfVideoLiked) {
    const deleteRecord = await Like.deleteOne({
      comment: commentId,
      likedBy: userId,
    });

    var message = "Comment unliked sucessfully";
  } else {
    const createRecord = await Like.create({
      comment: commentId,
      likedBy: userId,
    });
    var message = "Comment liked sucessfully";
  }

  return res.status(201).json(new ApiResponse(200, message));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Something went wrong");
  }

  const checkIfVideoLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });

  if (checkIfVideoLiked) {
    const deleteRecord = await Like.deleteOne({
      tweet: tweetId,
      likedBy: userId,
    });

    var message = "tweet unliked sucessfully";
  } else {
    const createRecord = await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
    var message = "tweet liked sucessfully";
  }

  return res.status(201).json(new ApiResponse(200, message));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  let userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Something went wrong");
  }

  const ownerDetails = await Like.findOne({
    likedBy: userId,
    video: { $ne: null },
  }).select("video");

 const  likedVideoId = ownerDetails.video;

 
 const videoDetails = await Like.aggregate([
  {
      $match: {
          video: likedVideoId,
      },
  },
  {
      $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoDetails",
          pipeline: [
              {
                  $project: {
                      videoFile: 1,
                      thumbnail: 1,
                  },
              },
          ],
      },
  },
  {
      $project: {
          video: 1,
          _id: 0  // Optional: Exclude the _id field if you don't want it in the output
      },
  },
]);

console.log(videoDetails);


 

 

  return res
    .status(201)
    .json(new ApiResponse(200, videoDetails, "Tweets fetched sucessfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
