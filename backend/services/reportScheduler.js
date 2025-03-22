import cron from "node-cron";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Complaint Model (Assuming a schema exists)
const Complaint = mongoose.model("Complaint", new mongoose.Schema({
    category: String,
    location: String,
    severity: Number,
    department: String,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
}));

// Email Transporter (Configure your email credentials)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Your email
        pass: process.env.EMAIL_PASS   // Your password or app password
    }
});

// Function to generate a consolidated report
async function generateReport() {
    try {
        // Fetch all pending complaints
        const complaints = await Complaint.find({ status: "Pending" });

        if (complaints.length === 0) {
            console.log("No pending complaints to report.");
            return;
        }

        // Group complaints by department and location
        const reportData = complaints.reduce((acc, complaint) => {
            const key = `${complaint.department} - ${complaint.location}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(`- ${complaint.category} (Severity: ${complaint.severity})`);
            return acc;
        }, {});

        // Format report
        let reportText = "🚨 **Daily Civic Issue Report** 🚨\n\n";
        for (const [key, issues] of Object.entries(reportData)) {
            reportText += `📍 **${key}**\n${issues.join("\n")}\n\n`;
        }

        console.log("Generated Report:\n", reportText);

        // Send email
        await sendEmail(reportText);

    } catch (error) {
        console.error("Error generating report:", error);
    }
}

// Function to send email
async function sendEmail(report) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: [ 
            "waterdept@example.com", 
            "electricitydept@example.com", 
            "roadmaintainance@example.com" 
        ],  // Add your emails here
        subject: "Daily Civic Issue Report",
        text: report
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Report Sent Successfully!");
    } catch (error) {
        console.error("❌ Error Sending Email:", error);
    }
}

// Schedule the report every day at 7:50 AM
cron.schedule("50 7 * * *", () => {
    console.log("📅 Running Daily Report Cron Job...");
    generateReport();
}, {
    timezone: "Asia/Kolkata"
});

