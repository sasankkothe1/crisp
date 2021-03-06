const { EventModel } = require("../model/Event");

const test = async (req, res) => {
    return res.send("testing Event");
};

const { removeFileFromS3 } = require("../middleware/upload");

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });
    if (req.body.title === "undefined" || req.body.title === "")
        return res.status(400).json({
            error: "Bad Request",
            message: "The title is empty",
        });
    if (req.body.description === "undefined" || req.body.description === "")
        return res.status(400).json({
            error: "Bad Request",
            message: "The description is empty",
        });
    if (req.body.eventDate === "undefined")
        return res.status(400).json({
            error: "Bad Request",
            message: "The event date is empty",
        });
    if (req.body.startTime === "undefined")
        return res.status(400).json({
            error: "Bad Request",
            message: "The start Time is empty",
        });
    if (req.body.endTime === "undefined")
        return res.status(400).json({
            error: "Bad Request",
            message: "The end time is empty",
        });
    if (req.body.eventLocation === undefined)
        return res.status(400).json({
            error: "Bad Request",
            message: "The event location is empty",
        });
    if (req.body.premiumStatus === undefined)
        return res.status(400).json({
            error: "Bad Request",
            message: "The premium status is empty",
        });

    let event = {
        ...req.body,
        postedBy: req.user._id,
        media:
            req.files?.length > 0
                ? [...req.files].map((file) => file.location)
                : [],
    };

    const session = await EventModel.startSession();
    session.startTransaction();

    EventModel.create(event)
        .then((event) => {
            req.user.events.push(event._id);
            req.user.save(async (error) => {
                if (error) {
                    throw error;
                } else {
                    try {
                        await session.commitTransaction();
                        res.status(201).json(event);
                    } catch (error) {
                        res.status(500).json({
                            error: "Internal server error",
                            message: error.message,
                        });
                    } finally {
                        session.endSession();
                    }
                }
            });
        })
        .catch(async (error) => {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            });
        });
};

const listSideBarEvents = (req, res) => {
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

const listEvents = (req, res) => {
    EventModel.paginate(
        {},
        {
            limit: req.query.limit,
            page: req.query.page,
            sort: "-datePosted",
            populate: "postedBy",
        }
    )
        .then((events) => {
            if (!events) {
                return res.status(400).json({
                    error: "Not Found",
                    message: "No Posts Found",
                });
            } else {
                return res.status(200).json(events);
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            });
        });
};

const listEventsByUserID = (req, res) => {
    EventModel.paginate(
        { postedBy: req.params.id },
        {
            limit: req.query.limit,
            page: req.query.page,
            sort: "-datePosted",
            populate: "postedBy",
        }
    )
        .then((events) => {
            if (!events) {
                return res.status(400).json({
                    error: "Not Found",
                    message: "No Events Found",
                });
            } else {
                return res.status(200).json(events);
            }
        })
        .catch((error) =>
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
            })
        );
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

const read = (req, res) => {
    EventModel.findById(req.params.id)
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

        let mediaFiles =
            req.files?.length > 0
                ? [...req.files].map((file) => file.location)
                : [];

        let toBeDeleted = req.body.toBeDeleted;

        if (toBeDeleted && toBeDeleted.length) {
            toBeDeleted.map((media) => removeFileFromS3(media));
        }

        let userImages = JSON.parse(req.body.userImages);

        if (userImages && userImages.length) {
            for (let i = 0; i < userImages.length; i++) {
                mediaFiles.push(userImages[i]["preview"]);
            }
        }

        event.title = req.body.title;
        event.description = req.body.description;
        event.tags = req.body.tags;
        event.premiumStatus = req.body.premiumStatus;
        event.rating = req.body.rating;
        event.eventDate = req.body.eventDate;
        event.startDate = req.body.startDate;
        event.endDate = req.body.endDate;
        event.eventLocation = req.body.eventLocation;
        event.media = mediaFiles

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
        media.map((media) => removeFileFromS3(media));

        await event.remove();
        res.status(200).json({ message: "Event Deleted." });
    } catch (error) {
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
    listSideBarEvents,
};
