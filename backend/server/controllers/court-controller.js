const handleResponse = require("../utils/handleResponse");
const courtModel = require("../models/court-model"); // In your court-model.js, you're exporting an instance of CourtModel 
                                                    // Since you're exporting an instance, when you import it, the convention is to use camelCase because it's an object, not a class definition.
                                                    // This is why courtModel (lowercase c) is used in your CourtController.

/*
const createCourtController = async (req, res, next) => {
    try {
        const courtData = req.body;
        const newCourt = await courtModel.createCourt(courtData);
        handleResponse(res, 201, "Court creted successfully", newCourt);

    } catch (error) {
        next(error);
    }
};

const getAllCourtsController = async (req, res, next) => {
    try {
        const courts = await courtModel.getAllCourts();
        handleResponse(res, 200, "Courts fetch uccessfulyy", courts);
    } catch (error) {
        next(error);
    }
};



module.exports = {
    createCourtController,
    getAllCourtsController
}
    */




class CourtController {
    async getAllCourtController(req, res, next) {
        try {
            const courts = await courtModel.getAllCourts();
            handleResponse(res, 200, 'Courts fetched successfully'. courts);
        } catch (error) {
            next(error);
        }
    }

    async getCourtByIdController(req, res, next) {
        const { courtId } = req.params;
        try {
            const court = await courtModel.getCourtById(courtId);
            if (!court) {
                return handleResponse(res, 404, 'Court not found');

            }
            handleResponse(res, 200, 'Court fetched successfully', court);
        } catch (error) {
            next(error);
        }
    }

    async createCourtController(req, res, next) {
        const courtData = req.body;
        try {
            const newCourt = await courtModel.createCourt(courtData);
            handleResponse(res, 201, 'Court created successfully', newCourt);

        } catch (error) {
            next(error);
        }
    }

    async updateCourtController(req, res, next) {
        const { courtId } = req.params;
        const courtData = req.body;
        try {
            const updatedCourt = await courtModel.updateCourt(courtId, courtData);
            if (!updatedCourt) {
                return handleResponse(res, 404, 'Court not found');

            }
            handleResponse(res, 200, 'Court updated successfully', updatedCourt);

        } catch (error) {
            next(error);
        }
    }

    async deleteCourtController(req, res, next) {
        const { courtId } = req.params;
        try {
            const deletedCourt = await courtModel.deleteCourt(courtId);
            if (!deletedCourt) {
                return handleResponse(res, 404, 'Court not found');
            }

            handleResponse(res, 200, 'Court deleted successfully', deletedCourt);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourtController();
