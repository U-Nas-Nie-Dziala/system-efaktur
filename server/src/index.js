import express from "express";

const app = express();

app.get("/api", async (req, res) => {
    return res.json({
        status: "running",
    });
});

app.listen(8000, () => {
    console.log("Server running http://localhost:8000");
});
