const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  githubUsername: {
    type: String,
    trim: true,
    sparse: true
  },
  leetcodeUsername: {
    type: String,
    trim: true,
    sparse: true
  },
  bio: {
    type: String,
    maxlength: [500, "Bio cannot exceed 500 characters"],
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Update timestamp before save
 * IMPORTANT: async middleware → NO next()
 */
ProfileSchema.pre("save", async function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model("Profile", ProfileSchema);
