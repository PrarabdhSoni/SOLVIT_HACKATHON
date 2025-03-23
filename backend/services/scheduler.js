import cron from "node-cron";
import { generateAndSendReport } from "./reportService.js";

cron.schedule("0 8 * * *", async () => {  // Runs every day at 8 AM
    console.log("Running daily report generation...");
    await generateAndSendReport();
});
