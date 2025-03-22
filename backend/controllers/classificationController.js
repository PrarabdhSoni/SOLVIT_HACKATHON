import axios from "axios";

export async function classifyComplaint(req, res) {
    try {
        const response = await axios.post("http://127.0.0.1:3000/classify-complaint", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error classifying complaint", error: error.message });
    }
}
