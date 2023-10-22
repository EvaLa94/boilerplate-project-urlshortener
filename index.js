require("dotenv").config();
const dns = require("dns");
const express = require("express");
const cors = require("cors");
const app = express();
const { validateUrl, createNewRecord } = require("./services");

// Database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const { ShortUrl } = require("./schema");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

// API endpoints
app.get("/", async (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", (req, res) => {
  const validatedUrl = validateUrl(req.body.url);

  if (!validatedUrl) {
    res.json({ error: "invalid url" });
  } else {
    dns.lookup(validatedUrl.hostname, async (err) => {
      if (err) {
        res.json({
          error: "An error occurred.",
        });
      } else {
        const result = await ShortUrl.findOne({
          original_url: validatedUrl.href,
        });

        if (Boolean(result)) {
          res.json(result);
        } else {
          const newShortUrl = await createNewRecord(validatedUrl);
          res.json(newShortUrl);
        }
      }
    });
  }
});

app.get("/api/shorturl/:id", async (req, res) => {
  const result = await ShortUrl.findOne({ short_url: +req.params.id });

  if (Boolean(result)) {
    res.redirect(result["original_url"]);
  } else {
    res.json({
      error: "No short URL found for the given input.",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
