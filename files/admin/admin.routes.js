const adminRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils/index")
const { uploadManager } = require("../../utils/multer")
const { getUserController } = require("../user/controllers/profile.controller")
const {
  adminSignUpController,
  adminLogin,
  getAdminController,
  updateAdminController,
} = require("./admin.controller")

//admin route
adminRoute.route("/").post(adminSignUpController)
adminRoute.route("/login").post(adminLogin)
adminRoute.use(isAuthenticated)
adminRoute.route("/").get(getAdminController)
adminRoute
  .route("/:id")
  .patch(uploadManager("image").single("image"), updateAdminController)

module.exports = adminRoute
