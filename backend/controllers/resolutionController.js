import axios from "axios";

export async function predictResolutionTime(req, res) {
    try {
        const response = await axios.post("http://127.0.0.1:3000/predict-resolution-time", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error predicting resolution time", error: error.message });
    }
}
