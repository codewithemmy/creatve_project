const { SchoolClass } = require("./schoolClass.model")
const mongoose = require("mongoose")

class SchoolClassRepository {
  static async create(payload) {
    return await SchoolClass.create(payload)
  }

  static async findSchoolClassWithParams(payload, select) {
    return await SchoolClass.find({ ...payload }).select(select)
  }

  static async findSingleSchoolClassWithParams(payload, select) {
    const schoolClass = await SchoolClass.findOne({ ...payload }).select(select)

    return schoolClass
  }

  static async validateSchoolClass(payload) {
    return SchoolClass.exists({ ...payload })
  }

  static async findAllSchoolClassParams(payload) {
    const { limit, skip, sort, ...restOfPayload } = payload

    const schoolClass = await SchoolClass.find({ ...restOfPayload })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return schoolClass
  }

  static async updateSchoolClassDetails(id, params) {
    return SchoolClass.findOneAndUpdate(
      { ...id },
      { ...params } //returns details about the update
    )
  }
}

module.exports = { SchoolClassRepository }
