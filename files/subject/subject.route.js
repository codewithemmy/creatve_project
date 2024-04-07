const subjectRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

const {
  createSubjectController,
  getSubjectController,
  updateSubjectController,
  deleteSubjectController,
} = require("./subject.controller")

subjectRoute.use(isAuthenticated)

//routes
subjectRoute.route("/").post(createSubjectController)
subjectRoute.route("/").get(getSubjectController)
subjectRoute.route("/:id").patch(updateSubjectController)
subjectRoute.route("/:id").delete(deleteSubjectController)

module.exports = subjectRoute
