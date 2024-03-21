const adminRoute = require("express").Router()
const { isAuthenticated } = require("../../utils/index")
const { uploadManager } = require("../../utils/multer")

const {
  adminSignUpController,
  adminLogin,
  getAdminController,
  updateAdminController,
  deleteAdminController,
  changeAdminPasswordController,
} = require("./admin.controller")

//admin route
adminRoute.route("/").post(adminSignUpController)
adminRoute.route("/login").post(adminLogin)

//authenticated route
adminRoute.use(isAuthenticated)
adminRoute.route("/").get(getAdminController)
adminRoute.route("/:id").delete(deleteAdminController)
adminRoute
  .route("/:id")
  .patch(uploadManager("image").single("image"), updateAdminController)

//password
adminRoute.route("/change-password/:id").patch(changeAdminPasswordController)

module.exports = adminRoute
