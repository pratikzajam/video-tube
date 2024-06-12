import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { owner, content } = req.body;

  if (!owner || !content) {
    throw new ApiError(400, "Something went wrong");
  }

  const userExists = await User.findById(owner);

  if (!userExists) {
    throw new ApiError(400, "User Does not exists");
  }

  const tweet = await Tweet.create({
    owner: owner,
    content: content,
  });

  if (!tweet) {
    throw new ApiError(400, "something went wrong while saving the tweet");
  }

  return res.status(201).json(new ApiResponse(200, "tweet creted sucessfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if(!userId) {
    throw new ApiError(400, "Something went wrong");
  }

  const tweetDetails=await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },   
      {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: {
          $first: "$owner",
        },
      },
    },

  ])

  return res.status(201).json(new ApiResponse(200,tweetDetails,"tweets fetched sucessfully"));
  
});



const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || !content) {
    throw new ApiError(400, "Something went wrong");
  }

  const tweetExists = await Tweet.findById(tweetId);

  if (!tweetExists) {
    throw new ApiError(400, "Tweet does not exists");
  }

  const updatetweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  if (!updatetweet) {
    throw new ApiError(400, "Something went wrong while updating the tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "tweet updated sucessfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweetExists = await Tweet.findById(tweetId);

  if (!tweetExists) {
    throw new ApiError(400, "Tweet does not exists");
  }

  const deleteTweet = await Tweet.deleteOne({ _id: tweetId });

  if (!deleteTweet) {
    throw new ApiError(400, "Something went wrong while deleting the tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "tweet deleted sucessfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
