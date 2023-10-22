require("dotenv").config();
const dns = require("dns");
const url = require("url");
const express = require("express");
const cors = require("cors");
const app = express();
const { validateUrl, filterResults, shortUrls } = require("./services");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

// API endpoints
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", (req, res) => {
  const inputUrl = req.body.url;
  const validatedUrl = validateUrl(inputUrl);

  if (!validatedUrl) {
    res.json({ error: "invalid url" });
  } else {
    dns.lookup(validatedUrl.hostname, (err) => {
      if (err) {
        res.json({
          error: "An error occurred.",
        });
      } else {
        const result = filterResults("original_url", inputUrl);
        if (Boolean(result)) {
          res.json(result);
        } else {
          const newRecord = {
            original_url: inputUrl,
            short_url: shortUrls.length + 1,
          };
          shortUrls.push(newRecord);
          res.json(newRecord);
        }
      }
    });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const result = filterResults("short_url", +req.params.id);

  if (Boolean(result)) {
    res.redirect(result["original_url"]);
    //res.send(result);
  } else {
    res.json({
      error: "No short URL found for the given input.",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
