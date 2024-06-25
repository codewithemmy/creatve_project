const reportRoute = require("express").Router()
const { isAuthenticated } = require("../../utils")
const { uploadManager } = require("../../utils/multer")
const {
  createReportController,
  getReportController,
  reportResponseController,
} = require("./report.controller")

reportRoute.use(isAuthenticated)

//routes
reportRoute
  .route("/")
  .post(uploadManager("reportImage").single("image"), createReportController)
  .get(getReportController)

reportRoute.route("/response/:id").patch(reportResponseController)

module.exports = reportRoute
