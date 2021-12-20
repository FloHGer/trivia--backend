const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
   email: { type: String, required: true, unique: true },
   nickname: { type: String, min: 3 }, // random name
   dob: { type: Date, default: 0 }, // <- to be shown as year only
   nat: { type: String, default: "" },
   createdAt: { type: Date, default: new Date.now() },
   games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Games" }],
   rank: [{}],
   stats: {}, // <--object in object in object
   achievements: {{}}, // <--object in object
});

