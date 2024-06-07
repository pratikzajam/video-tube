import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const {videoId} = req.params
  const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
  const { content, video_id, owner_id } = req.body;

  if (!content || !video_id || !owner_id) {
    throw new ApiError(400, "All fields required");
  }

  const videoExists = await video.findById(video_id);

  if (!videoExists) {
    throw new ApiError(400, "Video does not exists");
  }

  const owner_exists = await User.findById(owner_id);

  if (!owner_exists) {
    throw new ApiError(400, "owner does not exists");
  }

  const comment = await Comment.create({
    content: content,
    video: video_id,
    owner: owner_id,
  });

  if (!comment) {
    throw new ApiError(400, "something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "comment added sucessfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { comment_id } = req.body;

  const comment_exists = await User.findById(comment_id);

  if (comment_exists) {
    throw new ApiError(400, "comment does not exists");
  }

  const deleteComment = await Comment.findByIdAndDelete(comment_id);

  if (!deleteComment) {
    throw new ApiError(400, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "comment deleted sucessfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { comment_id, content } = req.body;

 const comment_exists = await User.findById(comment_id);

  if (comment_exists) {
    throw new ApiError(400, "comment does not exists");
  }

  if (!content) {
    throw new ApiError(400, "comment is required");
  }

  const updatecontent = await Comment.findByIdAndUpdate(
    comment_id,
    {
      $set: {
        content:content,
      },
    },
    { new: true }
  );

  if (!updatecontent) {
    throw new ApiError(400, "went something wrong while updating the comment");
  }

  console.log(updatecontent);

  return res
    .status(201)
    .json(new ApiResponse(200,"comment updated sucessfully"));
});

export { addComment,deleteComment,updateComment};
