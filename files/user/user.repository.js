const { User } = require("./user.model")
const mongoose = require("mongoose")

class UserRepository {
  static async create(payload) {
    return await User.create(payload)
  }

  static async findUserWithParams(userPayload, select) {
    return await User.find({ ...userPayload }).select(select)
  }

  static async findSingleUserWithParams(userPayload, select) {
    const user = await User.findOne({ ...userPayload }).select(select)

    return user
  }

  static async validateUser(userPayload) {
    return User.exists({ ...userPayload })
  }

  static async findAllUsersParams(userPayload) {
    const { limit, skip, sort, ...restOfPayload } = userPayload

    const user = await User.find({ ...restOfPayload }, { password: 0 })
      .sort(sort)
      .skip(skip)
      .limit(limit)

    return user
  }

  static async updateUserDetails(id, params) {
    return User.findOneAndUpdate(
      { ...id },
      { ...params },
      { new: true, runValidators: true }
    )
  }

  static async deleteUserById(id) {
    return User.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    })
  }
}

module.exports = { UserRepository }
