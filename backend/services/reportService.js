import nodemailer from "nodemailer";
import Complaint from "../models/complaintModel.js";  // Import MongoDB model

export async function generateAndSendReport() {
    try {
        // Fetch complaints that need to be processed
        const complaints = await Complaint.find({ status: "Pending" });

        if (complaints.length === 0) {
            console.log("No new complaints to report.");
            return;
        }

        // Generate report content
        let reportContent = "<h2>Daily Civic Issues Report</h2><ul>";
        complaints.forEach((complaint) => {
            reportContent += `<li><b>Issue:</b> ${complaint.issue} <br> 
            <b>Location:</b> ${complaint.location} <br> 
            <b>Reported At:</b> ${complaint.createdAt}</li><br>`;
        });
        reportContent += "</ul>";

        // Send email
        await sendEmail(reportContent);
        console.log("Report sent successfully!");

    } catch (error) {
        console.error("Error generating report:", error);
    }
}

// Function to send email
async function sendEmail(reportContent) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your-email@gmail.com",  // Update with your email
            pass: "your-app-password"  // Use App Passwords instead of actual password
        }
    });

    const mailOptions = {
        from: "your-email@gmail.com",
        to: "department@example.com",  // Replace with department emails
        subject: "Daily Civic Issues Report",
        html: reportContent,
    };

    await transporter.sendMail(mailOptions);
}
