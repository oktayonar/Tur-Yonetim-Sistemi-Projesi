const express = require("express");
const app = express();
const router = require("./routers");
const port = 3000;
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

app.use(express.json({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "ana_giris.html"));
});

app.get("/admin.html", function (req, res) {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/rezervasyon_ekle.html", function (req, res) {
  res.sendFile(path.join(__dirname, "rezervasyon_ekle.html"));
});

app.get("/rezervasyon_goruntule.html", function (req, res) {
  res.sendFile(path.join(__dirname, "rezervasyon_goruntule.html"));
});
app.get("/araba_ekle.html", function (req, res) {
  res.sendFile(path.join(__dirname, "araba_ekle.html"));
});

app.get("/sofor_ekle.html", function (req, res) {
  res.sendFile(path.join(__dirname, "sofor_ekle.html"));
});

app.get("/program_ekle.html", function (req, res) {
  res.sendFile(path.join(__dirname, "program_ekle.html"));
});

app.get("/otel_ekle.html", function (req, res) {
  res.sendFile(path.join(__dirname, "otel_ekle.html"));
});

app.get("/sofor_goruntule.html", function (req, res) {
  res.sendFile(path.join(__dirname, "sofor_goruntule.html"));
});

app.get("/program_goruntule.html", function (req, res) {
  res.sendFile(path.join(__dirname, "program_goruntule.html"));
});

app.get("/araba_ekle.html", function (req, res) {
  res.sendFile(path.join(__dirname, "araba_ekle.html"));
});

app.get("/araba_goruntule.html", function (req, res) {
  res.sendFile(path.join(__dirname, "araba_goruntule.html"));
});

app.get("/ana_giris.html", function (req, res) {
  res.sendFile(path.join(__dirname, "ana_giris.html"));
});

app.get("/index.html", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/sofor.html", function (req, res) {
  res.sendFile(path.join(__dirname, "sofor.html"));
});

app.get("/sofor_bilgiler.html", function (req, res) {
  res.sendFile(path.join(__dirname, "sofor_bilgiler.html"));
});

app.get("/sikayet_goruntule.html", function (req, res) {
  res.sendFile(path.join(__dirname, "sikayet_goruntule.html"));
});

app.get("/musteri.html", function (req, res) {
  res.sendFile(path.join(__dirname, "musteri.html"));
});

app.get("/otel_bilgiler.html", function (req, res) {
  res.sendFile(path.join(__dirname, "otel_bilgiler.html"));
});




app.get("/musteriler.html", function (req, res) {
  res.sendFile(path.join(__dirname, "musteriler.html"));
});

app.get('/sumela.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sumela.jpg'));
});

app.get('/uzungol.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'uzungol.jpg'));
});


app.get('/patron.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'patron.jpg'));
});


app.get('/oda_ekle.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'oda_ekle.html'));
});

app.get('/oteller.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'oteller.html'));
});





app.use("/api", router);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
