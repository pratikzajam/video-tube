import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";

const uploadVideo = asyncHandler(async (req, res) => {


  console.log(req.files);

  const videoFile = req.files?.video[0]["path"];

  const thumbnailFile = req.files?.thumbnail[0]["path"];

  if (!thumbnailFile) {
    throw new ApiError(400, "Thumbnail is required");
  }

  if (!videoFile) {
    throw new ApiError(400, "Video File is required");
  }

  const Video = await uploadOnCloudinary(videoFile);
  const thumbnail = await uploadOnCloudinary(thumbnailFile);

  console.log(Video);

  if (!Video) {
    throw new ApiError(400, "file upload error");
  }

  if (!thumbnail) {
    throw new ApiError(400, "thumbnail upload error");
  }

  const videoDocument = new video({
    videoFile: Video?.url || "",
    thumbnail: thumbnail?.url || "",
    duration: Video?.duration || "",
  });

  // Save the document with validation disabled
  await videoDocument.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, videoDocument, "video uploaded sucessfully"));
});

const videoDetails = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "All fields are required");
  }

  const videoDocument = new video({
    title: title,
    description: description,
  });

  await videoDocument.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(
      new ApiResponse(200, videoDocument, "Video details saved sucessfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  console.log(videoId);

  if (!videoId) {
    throw new ApiError(400, "Something went wrong");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const getVideoDeatils = await video.findById(videoId);

  if (!getVideoDeatils) {
    throw new ApiError(400, "Something went wrong");
  }

  const deleteVideo = await video.deleteOne({ _id: videoId });

  if (!deleteVideo) {
    throw new ApiError(400, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, deleteVideo, "Video deleted sucessfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Something went wrong");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const videoDetails = await video.findById(videoId).select(["-__v"]);

  if (!videoDetails) {
    throw new ApiError(400, "Video Not Found");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, videoDetails, "Video details fetched sucessfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Something went wrong");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const videoDetails = await video.findById(videoId).select(["isPublished"]);

  const isPublished = !videoDetails.isPublished;

  const updateStatus = await video.updateOne({ isPublished: isPublished });

  if (!updateStatus) {
    throw new ApiError(400, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "status updated sucessfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
 console.log(req.files);

  if (!videoId) {
    throw new ApiError(400, "Something went wrong");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (!(title || !description)) {
    throw new ApiError(400, "All Fields are required");
  }

  const thumbnail_path = req.files?.thumbnail[0].path;

  if (!thumbnail_path) {
    throw new ApiError(400, "Thumbnail not found");
  }

  const thaumbnail = await uploadOnCloudinary(thumbnail_path);

  if (!thaumbnail.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const updateVideos = video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description:description,
        thaumbnail:thaumbnail.url,
       
      },
    },
    { new: true }
  )


 return res
    .status(201)
    .json(new ApiResponse(200,"video details updated sucessfully"));

  });






export {
  uploadVideo,
  videoDetails,
  deleteVideo,
  getVideoById,
  togglePublishStatus,
  updateVideo
};
