const mongoose = require("mongoose")
const { queryConstructor } = require("../../utils")
const { NoticeRepository } = require("./notice.repository")
const {
  NotificationRepository,
} = require("../notification/notification.repository")
const { NoticeFailure, NoticeSuccess } = require("./notice.messages")
const { UserRepository } = require("../user/user.repository")

class NoticeService {
  static async create(payload, locals) {
    const { image, body } = payload
    const { classId } = body

    if (!body.noticeType)
      return {
        success: false,
        msg: `Notice type cannot be empty`,
      }

    let userType
    let createdBy
    if (locals.accountType === "admin") {
      userType = "Admin"
      createdBy = new mongoose.Types.ObjectId(locals._id)
    }
    if (locals.accountType === "teacher") {
      if (!classId)
        return {
          success: false,
          msg: `classId cannot be null for teacher creating notice`,
        }
      userType = "User"
      createdBy = new mongoose.Types.ObjectId(locals._id)
    }

    const { branchId, title, content, noticeType } = body
    const notice = await NoticeRepository.create({
      ...body,
      image,
      userType,
      createdBy,
      branchId: new mongoose.Types.ObjectId(branchId),
    })

    let mappedUsers

    if (locals.accountType === "admin") {
      const user = await UserRepository.findAllUsersParams({})
      mappedUsers = user.map(async (item) => {
        NotificationRepository.createNotification({
          recipientId: new mongoose.Types.ObjectId(item._id),
          title: `${title}`,
          message: `${content}`,
          recipient: "User",
          type: noticeType,
        })
        // if (noticeType === "emailSms") {
        //   try {
        //     const substitutional_parameters = {
        //       name: item.fullName,
        //       content: content,
        //       title: title,
        //     }

        //     await sendMailNotification(
        //       item.email,
        //       `${title}`,
        //       substitutional_parameters,
        //       "EMAIL_NOTICE"
        //     )
        //   } catch (error) {
        //     console.log("error", error)
        //   }
        // }
      })

      await Promise.all(mappedUsers)

      if (!notice) return { success: false, msg: NoticeFailure.CREATE }
    }

    if (locals.accountType === "teacher") {
      const user = await UserRepository.findAllUsersParams({
        intendedClass: new mongoose.Types.ObjectId(body.classId),
      })
      mappedUsers = user.map(async (item) => {
        NotificationRepository.createNotification({
          recipientId: new mongoose.Types.ObjectId(item._id),
          title: `${title}`,
          message: `${content}`,
          recipient: "User",
          type: noticeType,
        })
        // if (noticeType === "emailSms") {
        //   try {
        //     const substitutional_parameters = {
        //       name: item.fullName,
        //       content: content,
        //       title: title,
        //     }

        //     await sendMailNotification(
        //       item.email,
        //       `${title}`,
        //       substitutional_parameters,
        //       "EMAIL_NOTICE"
        //     )
        //   } catch (error) {
        //     console.log("error", error)
        //   }
        // }
      })

      await Promise.all(mappedUsers)

      if (!notice) return { success: false, msg: NoticeFailure.CREATE }
    }

    return {
      success: true,
      msg: NoticeSuccess.CREATE,
      notice,
    }
  }

  static async getNotice(payload) {
    const { error, params, limit, skip, sort } = queryConstructor(
      payload,
      "createdAt",
      "Notice"
    )

    if (error) return { success: false, msg: error }

    const notice = await NoticeRepository.findAllNoticeParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (!notice) return { success: false, msg: NoticeFailure.FETCH }

    return {
      success: true,
      msg: NoticeSuccess.FETCH,
      notice,
    }
  }

  static async updateNotice(payload, id) {
    const { image, body } = payload

    const notice = await NoticeRepository.updateModuleDetails(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        image,
        ...body,
      }
    )

    if (!notice) return { success: false, msg: NoticeFailure.UPDATE }

    return {
      success: true,
      msg: NoticeSuccess.UPDATE,
    }
  }

  static async deleteNotice(id) {
    const notice = await NoticeRepository.deleteNotice(id)

    if (!notice) return { success: false, msg: NoticeFailure.SOFT_DELETE }

    return {
      success: true,
      msg: NoticeSuccess.SOFT_DELETE,
    }
  }
}
module.exports = { NoticeService }
