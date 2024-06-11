const remarksRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

const {
  createRemarksController,
  getRemarksController,
  updateRemarksController,
} = require("./remarks.controller")

remarksRoute.use(isAuthenticated)

//routes
remarksRoute.route("/").get(getRemarksController)
remarksRoute.route("/").post(createRemarksController)
remarksRoute.route("/:id").patch(updateRemarksController)

module.exports = remarksRoute
