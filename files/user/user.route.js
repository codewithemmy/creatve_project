const { uploadManager } = require("../../utils/multer")
const { checkSchema } = require("express-validator")
const userRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { validate } = require("../../validations/validate")

//controller files
const {
  createUserController,
  userLoginController,
} = require("../user/controllers/user.controller")
const {
  updateUserProfileController,
  getUserProfileController,
  deleteProfileController,
} = require("./controllers/profile.controller")
const { loginValidation } = require("../../validations/users/loginValidation")

userRoute
  .route("/login")
  .post(validate(checkSchema(loginValidation)), userLoginController)

userRoute.use(isAuthenticated)
//routes

userRoute.post(
  "/",
  uploadManager("image").single("profileImage"),
  createUserController
)

userRoute.route("/").get(getUserProfileController)
userRoute.route("/:id").delete(deleteProfileController)

userRoute.patch(
  "/update/:id",
  uploadManager("image").single("image"),
  updateUserProfileController
)

module.exports = userRoute
