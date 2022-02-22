const { HttpError } = require("../errors/errorController.js");
const fs = require("fs");

const User = require("../schemas/userSchema.js");
const Game = require("../schemas/gameSchema.js");
const Rank = require("../schemas/rankingSchema.js");

module.exports = userController = {
    getUser: async (req, res, nxt) => {
        console.log("GET on /user/:username/");
        try {
            const user = await User.findOne(
                { username: req.params.username },
                "-__v -_id -id -provider"
            ).populate("games");
            if (!user) return nxt(new HttpError(404, "user not found"));
            return res.send({ message: "success", payload: user });
        } catch (err) {
            nxt(err);
        }
    },

    patchUser: async (req, res, nxt) => {
        console.log("PATCH on /user/:username");
        try {
            if (req.body.updates.username) {
                const userCheck = await User.find({
                    username: req.body.updates.username,
                }).count();
                if (userCheck) return res.send({message: 'username taken'});
            }
            if (req.body.updates.email) {
                const userCheck = await User.find({
                    email: req.body.updates.email,
                }).count();
                if (userCheck) return nxt(new HttpError(409, "email taken"));
            }

            const DBUser = await  User.findOne({ username: req.params.username });
            if (req.body.updates.username
            && DBUser.img.startsWith(`https://${req.headers.host}`)
            && !DBUser.img.endsWith('default.png')
            ) {
                fs.rename(
                    `./uploads/${req.params.username}.png`,
                    `./uploads/${req.body.updates.username}.png`,
                    (err) => (err ? console.log(err) : null)
                );
                req.body.updates.img = `https://${req.headers.host}/${req.body.updates.username}.png`;
            }

            const update = await User.updateOne(
                { username: req.params.username },
                req.body.updates
            );
            if (!update.matchedCount)
                return nxt(new HttpError(404, "user not found"));
            if (!update.modifiedCount && update.matchedCount)
                return res.status(204).send();
            return res.send({ message: "user updated" });
        } catch (err) {
            nxt(err);
        }
    },

    deleteUser: async (req, res, nxt) => {
        console.log("DELETE on /user/:username");
        try {
            const deletion = await User.deleteOne({
                username: req.params.username,
            });
            if (!deletion.deletedCount)
                return res.send({ message: "user not deleted." });
            if (fs.existsSync(`./uploads/${req.params.username}.png`)) {
                fs.unlink(`./uploads/${req.params.username}.png`, (err) =>
                    err ? console.log(err) : null
                );
            }
            return res.send({ message: "user deleted" });
        } catch (err) {
            nxt(err);
        }
    },

    getGames: async (req, res, nxt) => {
        console.log("GET on /user/:username/games");
        try {
            const { games } = await User.findOne(
                { username: req.params.username },
                "-_id games"
            ).populate("games");
            if (!games.length) return res.send({ message: "no games found" });
            return res.send({ message: "success", payload: games });
        } catch (err) {
            nxt(err);
        }
    },

    postGame: async (req, res, nxt) => {
        console.log("POST on /user/:username/games");
        try {
            const user = await User.findOne({ username: req.params.username });
            if (!user) return nxt(new HttpError(404, "user not found"));
            const game = await Game.create({
                user: user._id,
                datePlayed: Date.now(),
                score: req.body.score,
                categories: req.body.categories,
            });
            if (!game) return nxt(new HttpError(404, "game not created"));

            res.game = game;
            nxt();
        } catch (err) {
            nxt(err);
        }
    },

    getStats: async (req, res, nxt) => {
        console.log("GET on /user/:username/stats");
        try {
            const { stats } = await User.findOne(
                { username: req.params.username },
                "-_id stats"
            );
            if (!stats) return nxt(new HttpError(404, "user not found"));

            return res.send({ message: "success", payload: stats });
        } catch (err) {
            nxt(err);
        }
    },

    getRanks: async (req, res, nxt) => {
        console.log("GET on /user/:username/ranks");
        // try {
        //   const rankings = await Rank.find();
        //   rankings.map(ranking => {ranking.name: ranking.list.map(
        //     (listEntry, i) => listEntry.username === res.params.username ? i : null
        //   )});
        //   return res.send({message: "success", payload: XXX});
        // } catch (err) {
        //   nxt(err);
        // }
    },

    getAchievs: async (req, res, nxt) => {
        console.log("GET on /user/:username/achieves");
        try {
            const { achievs } = await User.findOne(
                { username: req.params.username },
                "-_id achievs"
            );
            if (!achievs) return nxt(new HttpError(404, "user not found"));

            return res.send({ message: "success", payload: achievs });
        } catch (err) {
            nxt(err);
        }
    },

    uploadImage: async (req, res, nxt) => {
        console.log("POST on /user/:username/upload");
        try {
            if (!req.files)
                return nxt(new HttpError(404, "picture not attached"));
            if (req.files.userImg.size > 20 * 1024 * 1024)
                return nxt(new HttpError(404, "file too big"));

			const DBUser = await User.findOne({username: req.params.username})
			if (!DBUser) return nxt(new HttpError(404, 'user not found'));
			if (
                DBUser &&
                !DBUser.img.includes("googleusercontent") &&
                !DBUser.img.includes("githubusercontent") &&
                DBUser.img !== `${process.env.CALLBACK}/default.png`
            ) {
                fs.unlink(
                    `./uploads/${req.params.username}.png`,
                    (err) => (err ? console.log(err) : null)
                );
            }
            
            const userImg = req.files.userImg;
            userImg.name = `${req.params.username}.png`;
            const path = `./uploads/${userImg.name}`;
            userImg.mv(path);
            const update = await User.updateOne(
                { username: req.params.username },
                { img: `https://${req.headers.host}/${userImg.name}` }
            );
            if (!update.matchedCount) return nxt(new HttpError(404, "user not found"));
            return res.send({ message: "profile image uploaded" });
        } catch (err) {
            nxt(err);
        }
    },

    deleteUpload: async (req, res, nxt) => {
        console.log("GET on /user/:username/upload");
        try {
            fs.unlink(
                `./uploads/${req.params.username}.png`,
                (err) => (err ? console.log(err) : null)
            );

			const DBUser = await User.findOne({
                username: req.params.username,
            });

            if (
                !DBUser.img.includes("googleusercontent") &&
                !DBUser.img.includes("githubusercontent")
            ) {
                await User.updateOne(
                    { username: req.params.username },
                    { img: `https://${req.headers.host}/default.png` }
                );
            }
            
            return res.send({ message: "Profile image deleted" });
        } catch (err) {
            nxt(err);
        }
    },
};
