import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateVideo } from "./video.controller.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, userId } = req.body;

  if (!name || !description || !userId) {
    throw new ApiError(400, "All fields required");
  }

  const userExists = await User.findById(userId);

  if (!userExists) {
    throw new ApiError(400, "user does not exists");
  }

  const playlist = await Playlist.create({
    owner: userId,
    name: name,
    description: description,
  });

  if (!playlist) {
    throw new ApiError(400, "Something went wrong while creating the playlist");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "Playlist created sucessfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  console.log(userId);

  if (!userId) {
    throw new ApiError(400, "All fields required");
  }

  const userExists = await User.findById(userId);

  if (!userExists) {
    throw new ApiError(400, "user does not exists");
  }

  const UserId = new mongoose.Types.ObjectId(userId);

  const userPlaylist = await Playlist.aggregate([
    //for owner of playlist
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
        owner: {
          $first: "$owner",
        },
      },
    },
    //for videos of playlist
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              _id: 1,
              video: 1,
              thumbnail: 1,
              videoFile: 1,
              title: 1,
              views: 1,
              owner: 1,
            },
          },
          //for owner of videos
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
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        videos: {
          $first: "$videos",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "User playlist is fetched sucessfully")
    );

  return res
    .status(201)
    .json(new ApiResponse(200, playlist, "Playlist fetched sucessfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "All fields required");
  }

  const playlistexists = await Playlist.findById(playlistId);

  if (!playlistexists) {
    throw new ApiError(400, "playlist does not exists");
  }

  const playlist_id = new mongoose.Types.ObjectId(playlistId);

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: playlist_id,
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videoDetails: 1, // Exclude the videos field from the final output
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist fetched sucesssfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "All fields required");
  }

  const playlistexists = await Playlist.findById(playlistId);

  if (!playlistexists) {
    throw new ApiError(400, "playlist does not exists");
  }

  const videoexists = await video.findById(videoId);

  if (!videoexists) {
    throw new ApiError(400, "video does not exists");
  }

  const updateVideos = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!updateVideos) {
    throw new ApiError(400, "Something went wrong while adding the videos");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "added video to the playlist sucessfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "All fields required");
  }

  const playlistexists = await Playlist.findById(playlistId);

  if (!playlistexists) {
    throw new ApiError(400, "playlist does not exists");
  }

  const videoexists = await video.findById(videoId);

  if (!videoexists) {
    throw new ApiError(400, "video does not exists");
  }

  const RemoveVideos = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );

  if (!RemoveVideos) {
    throw new ApiError(400, "playlist does not exists");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "sucessfully removed video from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "All fields required");
  }

  const playlistExists = await Playlist.findById(playlistId);

  if (!playlistExists) {
    throw new ApiError(400, "Playlist does not exists");
  }

  const playlist = await Playlist.findOneAndDelete(playlistId);

  if (!playlist) {
    throw new ApiError(
      400,
      "Something went worong while deleting the playlist"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "playlist deleted sucessfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId) {
    throw new ApiError(400, "All fields required");
  }

  if (!name || !description) {
    throw new ApiError(400, "All fields required");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "Playlist not found");
  }

  const updateVideos = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name: name,
        description: description,
      },
    },
    { new: true }
  );

  if (!updateVideos) {
    throw new ApiError(
      400,
      "There is some issues while updating the video details"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "video details updated sucessfully"));
});
export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
