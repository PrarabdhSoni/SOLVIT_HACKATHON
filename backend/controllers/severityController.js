import axios from "axios";

export async function predictSeverity(req, res) {
    try {
        const response = await axios.post("http://127.0.0.1:3000/predict-severity", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error predicting severity", error: error.message });
    }
}
