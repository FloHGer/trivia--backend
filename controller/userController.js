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
                if (userCheck) return nxt(new HttpError(409, "username taken"));

                if (
                    (
                        await User.findOne({ username: req.params.username })
                    ).img.startsWith(`http://${req.headers.host}`)
                ) {
                    fs.rename(
                        `./uploads/${req.params.username}.png`,
                        `./uploads/${req.body.updates.username}.png`,
                        (err) => (err ? console.log(err) : null)
                    );
                    req.body.updates.img = `http://${req.headers.host}/${req.body.updates.username}.png`;
                }
            }
            if (req.body.updates.email) {
                const userCheck = await User.find({
                    email: req.body.updates.email,
                }).count();
                if (userCheck) return nxt(new HttpError(409, "email taken"));
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
			const deleteOldImage = await User.findOne({username: req.params.username})
			console.log(deleteOldImage.img.slice(deleteOldImage.img.lastIndexOf("-")));

			if (!deleteOldImage) return nxt(new HttpError(404, 'user not found'))
			if (
                deleteOldImage &&
                !deleteOldImage.img.includes("googleusercontent") &&
                !deleteOldImage.img.includes("githubusercontent") &&
                deleteOldImage.img !== `${process.env.CALLBACK}/default.png`
            ) {
                fs.unlink(
                    `./uploads/${req.params.username}${deleteOldImage.img.slice(
                        deleteOldImage.img.lastIndexOf("-")
                    )}`,
                    (err) => (err ? console.log(err) : null)
                );
            }
            console.log("Request:", req.files);
            if (!req.files)
                return nxt(new HttpError(404, "picture not attached"));
            if (req.files.userImg.size > 20 * 1024 * 1024)
                return nxt(new HttpError(404, "file too big"));
            const userImg = req.files.userImg;
            // console.log("UserImg:", userImg);
            userImg.name = `${req.params.username}-${userImg.name}.png`;
            // console.log(userImg.name);
            const path = `./uploads/${userImg.name}`;
            userImg.mv(path);
            // console.log(path);
            const update = await User.updateOne(
                { username: req.params.username },
                { img: `http://${req.headers.host}/${userImg.name}` }
            );
            if (!update.matchedCount)
                return nxt(new HttpError(404, "user not found"));
            // if (!update.modifiedCount) return res.send({message: 'user not modified'});
            // console.log(update);
            return res.send({ message: "profile image uploaded" });
        } catch (err) {
            nxt(err);
        }
    },

    deleteUpload: (req, res, nxt) => {
        console.log("GET on /user/:username/upload/delete");
        try {
            if (!fs.existsSync(`./uploads/${req.params.username}.png`)) {
                return nxt(new HttpError(404, "file not found"));
            }
            fs.unlink(`./uploads/${req.params.username}.png`, (err) =>
                err ? console.log(err) : null
            );
            return res.send({ message: "Profile image deleted" });
        } catch (err) {
            nxt(err);
        }
    },
};
