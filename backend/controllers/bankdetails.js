const { BankDetails } = require("../model/BankDetails");

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });

    let post = {
        ...req.body
    }
    await BankDetails.create(post)
}

const read = (req, res) => {
    BankDetails.find(req.params.id).exec().then((bankdetails) => {
        if (!bankdetails)
            return res.status(404).json({
                error: "Not Found",
                message: "BankDetails not found",
            });
        else return res.status(200).json(bankdetails);
    })
}

const update = async (req, res) => {
    try {
        let result = await BankDetails.findOne({_id: req.params.id}).exec();

        if (!result) {
            return res.status(404).json({
                error: "Not found",
                message: "BankDetails not found",
            });
        }

        result.nameOfTheBank = req.body.nameOfTheBank;
        result.IBAN = req.body.IBAN;
        result.BIC = req.body.BIC;

        result.save(function (error) {
            if (error)
                res.status(500).json({
                    error: "Internal server error",
                    message: error.message,
                });
            else res.status(200).json(result);
        });
    } catch (error) {
        return res.status(404).json({
            error: "Internal server error",
            message: error.message,
        });
    }
};

const remove = async (req, res) => {
    let result;
    try {
        result = await BankDetails.findOne({_id: req.params.id})
            .exec();
        if (!result) {
            return res.status(404).json({
                error: "Not found",
                message: "BankDetails not found",
            });
        }
    } catch (error) {
        return res.status(404).json({
            error: "Not found",
            message: "BankDetails not found",
        });
    }

    await result.remove();
    res.status(200).json({message: "BankDetails Deleted."});
};

module.exports = {
    create,
    read,
    update,
    remove,

};




