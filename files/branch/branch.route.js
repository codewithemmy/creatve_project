const { uploadManager } = require("../../utils/multer")
const { checkSchema } = require("express-validator")
const branchRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const {} = require("../../utils/multer")
const { validate } = require("../../validations/validate")
const {
  createBranchController,
  getBranchController,
  updateBranchController,
  deleteBranchController,
} = require("./branch.controller")
const { createUser } = require("../../validations/users/createUser.validation")

branchRoute.use(isAuthenticated)

//routes
branchRoute
  .route("/")
  .post(
    adminVerifier,
    uploadManager("image").single("image"),
    createBranchController
  )
branchRoute.route("/").get(adminVerifier, getBranchController)
branchRoute.route("/:id").delete(deleteBranchController)

branchRoute.patch(
  "/:id",
  uploadManager("image").single("image"),
  updateBranchController
)

module.exports = branchRoute
