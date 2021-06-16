const { EventModel } = require("../model/Event");

const fs = require("fs");

const test = async (req, res) => {
    return res.send("testing Event");
};

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });

    let url = req.protocol + "://" + req.get("host") + "/";
    let mediaFiles = [];

    if (req.files.length > 0) {
        for (var i = 0; i < req.files.length; i++)
            mediaFiles.push(url + req.files[i].filename);
    }
    let event = {
        ...req.body,
        media: mediaFiles,
    };

    EventModel.create(event)
        .then((event) => res.status(201).json(event))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const listEvents = (req, res) => {
    EventModel.find({})
        .populate("postedBy")
        .exec()
        .then((events) => {
            if (!events)
                return res.status(400).json({
                    error: "Not Found",
                    message: "No events Found",
                });
            else return res.status(200).json(events);
        });
};

const listNewEvents = (req, res) => {
    EventModel.find({})
        .sort("-datePosted")
        .populate("postedBy")
        .exec()
        .then((events) => res.status(200).json(events))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const listSoonEndingEvents = (req, res) => {
    EventModel.find({})
        .sort("endDate")
        .populate("postedBy")
        .exec()
        .then((events) => res.status(200).json(events))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const listEventsByUserID = (req, res) => {
    EventModel.find({ postedBy: req.params.id })
        .then((events) => res.status(200).json(events))
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const read = (req, res) => {
    EventModel.find(req.params.id)
        .populate("postedBy")
        .exec()
        .then((event) => {
            if (!event)
                return res.status(404).json({
                    error: "Not Found",
                    message: "Event not found",
                });
            else return res.status(200).json(event);
        })
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
};

const update = async (req, res) => {
    try {
        let event = await EventModel.findOne({ _id: req.params.id }).exec();

        if (!event) {
            return res.status(404).json({
                error: "Not found",
                message: "Event not found",
            });
        }

        if (req.file !== undefined) {
            let url = req.protocol + "://" + req.get("host") + "/";
            let mediaFiles = event.media;

            if (req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++)
                    mediaFiles.push(url + req.files[i].filename);
            }
        }

        event.title = req.body.title;
        event.description = req.body.description;
        event.media = mediaFiles;
        event.tags = req.body.tags;
        event.premiumStatus = req.body.premiumStatus;
        event.rating = req.body.rating;
        event.startDate = req.body.startDate;
        event.endDate = req.body.endDate;
        event.eventLocation = req.body.eventLocation;

        event.save(function (error) {
            if (error)
                res.status(500).json({
                    error: "Internal server error",
                    message: error.message,
                });
            else res.status(200).json(event);
        });
    } catch (error) {
        return res.status(404).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

const remove = async (req, res) => {
    let event;
    try {
        event = await EventModel.findOne({ _id: req.params.id })
            .populate("postedBy")
            .exec();
        if (!event) {
            return res.status(404).json({
                error: "Not found",
                message: "Event not found",
            });
        }
    } catch (error) {
        return res.status(404).json({
            error: "Not found",
            message: "Event not found",
        });
    }
    try {
        let { media } = event;
        media.map((mediaFile) => {
            let path =
                "./public/uploads/" +
                mediaFile.substr(mediaFile.lastIndexOf("/") + 1);
            fs.access(path, fs.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                fs.unlink(path, (err) => {
                    if (err) throw err;
                });
            });
        });

        await event.remove();
        res.status(200).json({ message: "Event Deleted." });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

module.exports = {
    create,
    read,
    listEvents,
    listNewEvents,
    listEventsByUserID,
    listSoonEndingEvents,
    update,
    remove,
    test,
};