const userRoute = require("../files/user/user.route")
const authRoute = require("../files/auth/auth.route")
const notificationRoute = require("../files/notification/notification.route")
const adminRoute = require("../files/admin/admin.routes")
const branchRoute = require("../files/branch/branch.route")
const studentRoute = require("../files/student/student.route")
const schoolClassRoute = require("../files/class/schoolClass.route")
const subjectRoute = require("../files/subject/subject.route")
const recordRoute = require("../files/record/record.route")

const routes = (app) => {
  const base_url = "/api/v1"

  app.use(`${base_url}/user`, userRoute)
  app.use(`${base_url}/auth`, authRoute)
  app.use(`${base_url}/notification`, notificationRoute)
  app.use(`${base_url}/admin`, adminRoute)
  app.use(`${base_url}/branch`, branchRoute)
  app.use(`${base_url}/student`, studentRoute)
  app.use(`${base_url}/class`, schoolClassRoute)
  app.use(`${base_url}/subject`, subjectRoute)
  app.use(`${base_url}/record`, recordRoute)
}

module.exports = routes
