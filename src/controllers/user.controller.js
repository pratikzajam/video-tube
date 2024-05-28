import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens=async(userId)=>{
try{
const user= await User.findById(userId)
const acccessToken=user.generateAccessToken()
const refreshToken=user.generateRefreshToken()

user.refreshToken=refreshToken
await user.save({validateBeforeSave:false})

}catch(error){
  throw new ApiError(500,"Something went wrong while generating refresh and access token")
}
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  const userArrey = [fullName, email, username, password];

  if (userArrey.some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username alreay exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
let coverImageLocalPath 

if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  coverImageLocalPath = req.files.coverImage[0].path
}

if(req.files && Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0)
  {
    coverImageLocalPath=req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Path is required");
  }



  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options={
    httpOnly:true,
    secure:true,
  }

  

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Sucessfully"));
});


const loginUser = asyncHandler(async(req,res)=>{
//take data from user
//check email exists
//if email exists ckeck for password

const {email,username,password}=req.body

if(!username && !email){
throw new ApiError(400,"username or email is required");
}

const user= await User.findOne({
  $or:[{username},{email}]
})

if(!user)
  {
    throw new ApiError(404,"User does not exists");
  }

 const  isPasswordValid= await user.isPasswordCorrect(password)

 if(!isPasswordValid)
  {
    throw new ApiError(401,"Invalid login credentials");
  }

  const {acccessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

  
const options={
  httpOnly:true,
  secure:true
}


return res
.status(200)
.cookie("accessToken",acccessToken,options)
.cookie("refreshToken",acccessToken,options)
.json(
  new ApiResponse(
    200,
    {
      user:loggedInuser,acccessToken,
      refreshToken
    }
  )
)

})


const logoutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
req.user._id,
  {
    $set:{
      refreshToken:undefined
    }
    },
    {
      new:true
    }
  )

  const options={
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged Out sucessfully"))
})
    



export { registerUser,
  loginUser,
  logoutUser
 };
