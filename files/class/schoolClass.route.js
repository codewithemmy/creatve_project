const schoolClassRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  createSchoolClassController,
  getSchoolClassController,
  updateSchoolClassController,
} = require("./schoolClass.controller")

schoolClassRoute.use(isAuthenticated)

//routes
schoolClassRoute
  .route("/")
  .post(uploadManager("image").single("image"), createSchoolClassController)

schoolClassRoute
  .route("/")
  .get(getSchoolClassController)
  .patch(updateSchoolClassController)

//routes
schoolClassRoute
  .route("/:id")
  .patch(uploadManager("image").single("image"), updateSchoolClassController)

module.exports = schoolClassRoute
