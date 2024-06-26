const { queryConstructor, AlphaNumeric } = require("../../utils")
const { NotificationService } = require("../notification/notification.service")
const { ReportFailure, ReportSuccess } = require("./report.messages")
const { ReportRepository } = require("./report.repository")
const { sendMailNotification } = require("../../utils/email")
const mongoose = require("mongoose")

class ReportService {
  static async createReport(payload, locals) {
    const { image, body } = payload

    const reportHashId = AlphaNumeric(6, "alpha")

    const report = await ReportRepository.create({
      ...body,
      image,
      reportId: `#${reportHashId}`,
      reporterId: locals,
    })

    if (!report) return { success: false, msg: ReportFailure.CREATE }

    return { success: true, msg: ReportSuccess.CREATE, report }
  }

  static async getReport(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Report"
    )
    if (error) return { success: false, msg: error }

    const report = await ReportRepository.findAllReportParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (!report) return { success: false, msg: ReportFailure.FETCH }

    return {
      success: true,
      msg: ReportSuccess.FETCH,
      data: report,
    }
  }

  static async reportResponseService(payload, id) {
    const { title, message } = payload
    const response = await ReportRepository.findReportAndUpdate(id, {
      $set: { response: { ...payload } },
    })

    if (!response) return { success: false, msg: ReportFailure.RESPONSE }

    const report = await ReportRepository.findSingleReport({
      _id: new mongoose.Types.ObjectId(response._id),
    })

    try {
      const substitutional_parameters = {
        name: report.reporterId.firstName,
        email: report.reporterId.email,
        title,
        message,
      }

      await sendMailNotification(
        report.reporterId.email,
        "Ticket Response",
        substitutional_parameters,
        "TICKET_RESPONSE"
      )
      await NotificationService.create({
        userId: new mongoose.Types.ObjectId(response.reportedUser),
        recipientId: new mongoose.Types.ObjectId(response.reporterId),
        message: `Hi, Title: ${title}... Message: ${message}`,
      })
    } catch (error) {
      console.log("ticket response error", error)
    }
    return { success: true, msg: ReportSuccess.RESPONSE }
  }
}

module.exports = { ReportService }
