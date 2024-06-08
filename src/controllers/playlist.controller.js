import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

  if (!userId) {
    throw new ApiError(400, "All fields required");
  }

  const userExists = await user.findById(userId);

  if (!userExists) {
    throw new ApiError(400, "user does not exists");
  }

  
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
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
  //TODO: update playlist
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
