//const express = require("express");
import express from "express";
import "dotenv/config";
import getConnection from "./config/database";
import webRoutes from "./routes/web";

const app = express();
const port = process.env.PORT || 8080;

//config view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config statc:img,css,js
app.use(express.static("public"));

//config routes
webRoutes(app);

getConnection();

app.listen(port, () => {
  console.log(`My app listening on port ${port}`);
});
