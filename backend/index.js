const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./mongo");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/youtube", require("./routes/youtube"));

app.get("/", (req, res) => res.send("YouTube Companion Dashboard API"));

app.listen(3001, () => console.log("Backend running on port 3001"));
