import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const sql = neon(process.env.DATABASE_URL);



export const details = async (req, res) => {

    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });
    console.log(token)
    jwt.verify(token, "hifi", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        console.log("Decoded JWT Payload:", decoded); // Debugging

        const userId = decoded.userId;
        console.log(userId);

        sql`SELECT name, email, phoneNumber, address FROM school_login WHERE id = ${userId}`
            .then((result) => {
                if (result.length === 0) return res.status(404).json({ message: "User not found" });
                res.json(result[0]); // Return user details
            }
        )
    });


//     const record =  await sql`SELECT name, email, phoneNumber, address FROM users WHERE id = ?`, [userId], (err, result) => {
//     if (err) return res.status(500).json({ message: "Database query failed" });

//     if (result.length === 0) return res.status(404).json({ message: "User not found" });

//     res.json(result[0]); // Return user details


//   console.log(userId, otp);

//   if (!userId || !otp) {
//     return res.status(400).json({ success: false, message: "Invalid request" });
//   }

//   const decoded = jwt.verify(userId, "hifi"); // Use your secret key
//   const decodedUserId = decoded.userId;  // Extract userId

//   const otpRecord = await sql`
//       SELECT otp FROM Confirmation_Token 
//       WHERE id = ${decodedUserId} AND otp = ${otp};
//     `;

//     if (otpRecord.length === 0) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     await sql`UPDATE School_Login SET is_active = TRUE WHERE id = ${decodedUserId}`;

//     // OTP verified, remove it from the database
//     await sql`DELETE FROM Confirmation_Token WHERE id = ${decodedUserId};`;

//     res.status(200).json({ message: "OTP verified successfully" });
};