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
} = require("./controllers/profile.controller")
const { loginValidation } = require("../../validations/users/loginValidation")

userRoute.use(isAuthenticated)
//routes
userRoute.route("/").post(createUserController)

userRoute
  .route("/login")
  .post(validate(checkSchema(loginValidation)), userLoginController)

userRoute.route("/").get(getUserProfileController)

userRoute.patch(
  "/update/:id",
  uploadManager("image").single("image"),
  updateUserProfileController
)

module.exports = userRoute
