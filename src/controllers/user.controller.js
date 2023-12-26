import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { APIERROR } from "../utils/ApiError.js";
import UploadOnCloudinary from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullname } = req.body;
  if (
    [username, email, password, fullname].some((field) => {
      field.trim() === "";
    })
  ) {
    throw new APIERROR(400, "All field are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new APIERROR(409, "User already exists");
  }
  const avatarLocalPath = await req?.files.avatar[0]?.path;
  const coverLocalPath = await req?.files.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new APIERROR(404, "Avatar file unavailble");
  }
  const avatar = await UploadOnCloudinary(avatarLocalPath);
  const coverimage = await UploadOnCloudinary(coverLocalPath);

  if (!avatar) {
    throw new APIERROR(404, "Avatar file unavailble");
  }
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new APIERROR(500, "Something went wrong while creating the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
