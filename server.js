const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);
app.get("/", (req, res) => {
  if (!req.session.user && req.cookies.user) {
    return res.send(
      `Welcome back! Last time you logged in as ${req.cookies.user}`
    );
  }

  res.send("Welcome to Online Course Platform");
});
app.post("/login", (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.send("Please provide username and role");
  }

  req.session.user = {
    username,
    role,
  };
  res.cookie("user", username);

  res.send("Login successful");
});

app.get("/courses", (req, res) => {
  if (!req.session.user) {
    return res.send("Please login first");
  }

  res.send("You can view courses");
});
app.get("/create-course", (req, res) => {
  if (!req.session.user) {
    return res.send("Please login first");
  }

  if (req.session.user.role !== "instructor") {
    return res.send("Access Denied");
  }

  res.send("Course created successfully");
});
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.send("Please login first");
  }

  const { username, role } = req.session.user;

  res.send(`Username: ${username}, Role: ${role}`);
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out");
    }
    res.clearCookie("connect.sid"); 
    res.clearCookie("user"); 

    res.send("Logged out successfully");
  });
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
