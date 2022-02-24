/**
 * The entry point of the web application. 
 * 
 * The URL is parsed here and the corresponding webpage 
 * to display is determined here and returned
 */

/**
 * Neccessary imports
 */
const express = require("express");
const fs = require("fs");
const helmet = require("helmet");

/**
 * Setting up of application environment
 */
const app = express();
const secrets = require("./secrets")
const port = secrets.PORT;

/**
 * Setting up app configs
 */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));

// Render a dashboard to let people do a simple search
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html")
});

/**
 * Gets a list of suggestions based on current searched 
 * query by the user
 */
app.get("/suggest", (req, res) => {
  // Reads the available filenames
  const fileNames = [];
  fs.readdir(process.cwd() + "/restaurants/", (err, files) => {
    if (err) {
      // Error where filenames could not be read
      let data = {
        "status": 500, 
        "message": "An unexpected error occured. "
      };

      res.status(500).json(data);
      res.end();
    } else {
      // Filenames read
      fileNames.push(...files);
      let { query } = req.query;
      
      // Match filenames with search query
      if (query === "") {
        // Empty query
        res.json({
          "suggestions": []
        });
      } else {
        const matchingFiles = [];
        for (let file of fileNames) {
          if (file.includes(query.toLowerCase())) {
            matchingFiles.push(file);
          }
        }

        // Sends a JSON response as a REST API
        res.json({
          "suggestions": matchingFiles
        });
      }
    }
  });
});

/**
 * Return the individual HTML page associated with the search
 * 
 * If not location, redirect to index page / display error 
 */
app.get("/search", (req, res, next) => {
  let { name } = req.query;

  if (!name) {
    customError = {
      "status": 400,
      "message": "Please provide a restaurant name."
    }
    return next(customError);
  }

  name = name.replace(/\s+/gi, " ")

  fs.readFile("restaurants/" + name.toLowerCase(), "utf8", (err, data) => {
    if (err) {
      customError = {
        "status": 404,
        "message": name + " not found! Try another restaurant."
      }
      next(customError);
    } else {
      res.end(data);
    }
  });
});

/**
 * Catches errors and forwards them to error handler
 */
app.use((req, res, next) => {
  // Generate error message
  return next({ status: 404, message: "File not found" });
});

app.use((err, req, res, next) => {
  // Return error message
  res.status(err.status || 500).send(err.message);
})

/**
 * Initialise application
 */
app.listen(port, () => {
  console.log(`App running on port ${port}`);
})