const { uploadManager } = require("../../utils/multer")
const { checkSchema } = require("express-validator")
const branchRoute = require("express").Router()
const { isAuthenticated, adminVerifier } = require("../../utils")
const { validate } = require("../../validations/validate")
const {
  createBranchController,
  getBranchController,
  updateBranchController,
} = require("./branch.controller")
const { createUser } = require("../../validations/users/createUser.validation")

branchRoute.use(isAuthenticated)

//routes
branchRoute.route("/").post(adminVerifier, createBranchController)
branchRoute.route("/").get(adminVerifier, getBranchController)

branchRoute.patch(
  "/:id",
  uploadManager("profile").single("image"),
  updateBranchController
)

module.exports = branchRoute
