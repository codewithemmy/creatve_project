const schoolClassRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const {
  createSchoolClassController,
  getSchoolClassController,
  updateSchoolClassController,
} = require("./schoolClass.controller")

schoolClassRoute.use(isAuthenticated)

//routes
schoolClassRoute
  .route("/")
  .post(createSchoolClassController)
  .get(getSchoolClassController)
  .patch(updateSchoolClassController)

module.exports = schoolClassRoute
