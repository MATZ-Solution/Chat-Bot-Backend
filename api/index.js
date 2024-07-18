const URI = "mongodb+srv://matzsolutions:2VVG2QxBAMub9Oaz@cluster0.gyal2.mongodb.net";
const DB_NAME = "healthcare";

const CATEGORY_MAPPINGS = {
    "nursing-homes": "nursingHomenew",
    "memory-care": "memoryCare",
    "in-home-care": "inHomeCare",
    "inpatient-rehabilitations": "inpatientrehabilitiations",
};

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { MongoClient } = require("mongodb");
const client = new MongoClient(URI);
client.connect();

const database = client.db(DB_NAME);
console.log("Connected to MongoDB!");

app.get("/", (req, res) => {
    res.send("Welcome to the Nursing Home API 2.0");
});

app.get("/api/:category/fetch", async (req, res) => {
    try {
        var { category } = req.params;
        category = CATEGORY_MAPPINGS[category];

        const { zipCode, state, city, name, top } = req.query;

        let filters = {};

        console.log("FETCHING ...");
        console.log(zipCode, state, city, name, category);

        if (zipCode) {
            filters.zipCode = zipCode;
        }

        if (state) {
            filters.state = state;
        }

        if (city) {
            filters.city = city;
        }

        if (name) {
            filters.name = name;
        }

        const sortCriteria = { 'scrapedAverageRating.stars': -1, overall_rating: -1, name: 1 };

        const collection = database.collection(category);
        const data = await collection.find(filters).sort(sortCriteria).limit(7).toArray();

        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
