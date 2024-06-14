const remarksRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

const {
  createRemarksController,
  getRemarksController,
  updateRemarksController,
  updateAffectiveDomainController,
} = require("./remarks.controller")

remarksRoute.use(isAuthenticated)

//routes
remarksRoute.route("/").get(getRemarksController)
remarksRoute.route("/").post(createRemarksController)
remarksRoute.route("/:id").patch(updateRemarksController)
remarksRoute.route("/domain/:id").patch(updateAffectiveDomainController)

module.exports = remarksRoute
