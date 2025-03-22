import axios from "axios";

export async function detectAnomaly(req, res) {
    try {
        const response = await axios.post("http://127.0.0.1:3000/detect-anomaly", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error detecting anomaly", error: error.message });
    }
}
