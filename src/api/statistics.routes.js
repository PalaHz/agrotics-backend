import { Router } from "express";
import { ReportService } from "../services/report-service";

export const StatisticsRouter = Router();

StatisticsRouter.get('/general', async(req, res) => {
    try {
        const statistics = await ReportService.getGeneralStatistics()
        res.json(statistics)
    } catch (error) {
        res.status(error.status || 500).json(error)
    }
})