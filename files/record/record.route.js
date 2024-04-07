const recordRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")

const {
  createRecordController,
  getRecordController,
  updateRecordController,
} = require("./record.controller")

recordRoute.use(isAuthenticated)

//routes
recordRoute.route("/").post(createRecordController)
recordRoute.route("/").get(getRecordController)
recordRoute.route("/:id").patch(updateRecordController)

module.exports = recordRoute
