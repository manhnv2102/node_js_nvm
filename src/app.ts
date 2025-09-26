//const express = require("express");
import express from "express";
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World! My name is Mạnh");
});

app.listen(port, () => {
  console.log(`My app listening on port ${port}`);
});
