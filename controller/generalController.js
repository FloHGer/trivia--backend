const Stat = require("../schemas/statSchema.js");
const Feedback = require("../schemas/feedbackSchema.js");
const sendMail = require("../common/nodemailer.js");
const flags = require("../uploads/countryFlags/countryCodes.js");

module.exports = generalController = {
   stats: async (req, res, nxt) => {
      console.log("GET on /stats");
      try {
         const stats = await Stat.findOne({ name: "serverStats" });
         if (!stats) res.status(204).send({ message: "stats not found" });
         res.send({ message: "success", payload: stats });
      } catch (err) {
         nxt(err);
      }
   },

   feedback: async (req, res, nxt) => {
      const feedback = await Feedback.create({
         value: req.body.feedback.value,
         message: req.body.feedback.message,
      });
      if (!feedback)
         return res.status(204).send({ message: "feedback not created" });

      sendMail({
         purpose: "feedback",
         recipient: "mail@florianhoehle.de", // change to a triva-ga.me address later
         subject: "TRIVIA Game - feedback",
         body: {
            value: feedback.value,
            message: feedback.message,
         },
      });

      res.send({ message: "success", payload: feedback });
   },
};
