const analyticsModel = require("../models/analytics-model");
const handleResponse = require("../utils/handleResponse");


class AnalyticsController {
    async getBookingAnalyticsController(req, res) {
        try {
            const { courtId } = req.params;
            const data = await analyticsModel.getBookingAnalytics(courtId);
            console.log("Booking Analytics Data for court", courtId, ":", data);
            handleResponse(res, 200, 'Booking analytics retrieved', data);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    };

    async getRevenueAnalyticsController(req, res) {
        try {
            const { courtId } = req.params;
            const data = await analyticsModel.getRevenueAnalytics(courtId);
            console.log("Revenue Analytics Dat for court", courtId, ":", data);
            handleResponse(res, 200, 'Revenue analytics retrieved', data);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    };

    async getCourtUtilizationController(req, res) {
        try {
            const { courtId } = req.params;
            const data = await analyticsModel.getCourtUtilization(courtId);
            console.log("Court Utilization Data for court", courtId, ":", data);
            handleResponse(res, 200, 'Court utilization retrieved', data);
        } catch (error) {
            handleResponse(res, 500, 'Internal server error');
        }
    };
};

module.exports = new AnalyticsController();