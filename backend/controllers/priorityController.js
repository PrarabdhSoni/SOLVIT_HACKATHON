const { getPriorityList } = require("../services/flaskService");

const fetchPriorityList = async (req, res) => {
    try {
        const data = await getPriorityList();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = { fetchPriorityList };
