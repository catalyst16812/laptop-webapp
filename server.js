// Declares routes that should be routed to the right CRUD endpoints. This is a bit tricky because we don't want to require routes that are in the same group as any other route
const express = require("express");//server
const mongoose = require("mongoose");//database connection
const path = require("path");

const laptoproute = require("./laptoproute");

// Adds the service limits to the app. This is a convenience function to allow developers to add more services
const app = express();
app.use(express.json());

// Connects to the database and sets flags that allow writes to be retried. This is a no - op if there is an error
mongoose
  .connect(
    "mongodb+srv://catalyst16813:nikhil11111@cluster0.cv2jbdp.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
/**
 * / / object / list to be used in a call to
 */
db.once("open", function () {
  console.log("Connected successfully");
});

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/add_laptop", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "new_laptop.html"));
});
app.get("/database", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "laptopdb.html"));
});
app.use(laptoproute);
// Listen for HTTP requests on the port specified in environment variable or 3030
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
