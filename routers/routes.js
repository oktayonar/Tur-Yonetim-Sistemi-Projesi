const router = require("express").Router();
// const { register } = require("../controllers/controller");
const { registerSofor } = require("../controllers/controller");
const { registerProgram } = require("../controllers/controller");
const { registerOtel } = require("../controllers/controller");
const { getSoforler } = require("../controllers/controller");
const { getProgramlar } = require("../controllers/controller");
const { getSoforlerAd } = require("../controllers/controller");
const { registerArabalar } = require("../controllers/controller");
const { getArabalar } = require("../controllers/controller");
const { getOtellerAd } = require("../controllers/controller");
const { soforBilgiler } = require("../controllers/controller");
const { getSikayet } = require("../controllers/controller");
const { registerSikayet } = require("../controllers/controller");
const { getRezervasyon } = require("../controllers/controller");
const { getIstatistik } = require("../controllers/controller");
const { getIstatistik2 } = require("../controllers/controller");
const { getMusteri } = require("../controllers/controller");
const { deleteAraba } = require("../controllers/controller");
const { updateAraba } = require("../controllers/controller");
const { deleteSofor } = require("../controllers/controller");
const { kayitOlustur } = require("../controllers/controller");
const { getOtelById } = require("../controllers/controller");
const { getMusteri2 } = require("../controllers/controller");
const { getIstatistik3 } = require("../controllers/controller");
const { deleteRezervasyon } = require("../controllers/controller");
const { deleteProgramlar } = require("../controllers/controller");
const { deleteSikayet } = require("../controllers/controller");
const { deleteOda } = require("../controllers/controller");
const { deleteMusteri } = require("../controllers/controller");
const { registerOda } = require("../controllers/controller");
const {deleteOteller} = require("../controllers/controller");
const {getOteller} = require("../controllers/controller");
const {registerSikayet2} = require("../controllers/controller");
// router.post("/login",login)

// router.post("/register", register); //rezervasyon ekleme
//post:veri gönderme get:veri alma put:veri güncelleme patch:veri güncelleme
//delete:veri silme

router.post("/registerSofor", registerSofor); //sofor ekleme
router.post("/registerProgram", registerProgram); //program ekleme
router.post("/registerOtel", registerOtel); //otel ekleme
router.get("/getSoforler", getSoforler); //soforleri alma
router.get("/getProgramlar", getProgramlar); //programları alma
router.get("/getSoforlerAd", getSoforlerAd); //soforleri alma
router.post("/registerArabalar", registerArabalar); //araba ekleme
router.get("/getArabalar", getArabalar); //arabaları alma
router.get("/getOtellerAd", getOtellerAd)
router.get("/getOtellerAd/:otel_id", getOtellerAd); //otelleri alma
router.get("/soforBilgiler/:plaka", soforBilgiler); //otelleri alma
router.get("/getSikayet", getSikayet); //otelleri alma
router.post("/registerSikayet", registerSikayet); //otelleri alma
router.get("/getRezervasyon", getRezervasyon); //otelleri alma
router.get("/getIstatistik", getIstatistik); //otelleri alma
router.get("/getIstatistik2", getIstatistik2); //otelleri alma
router.get("/getMusteri2", getMusteri2); //otelleri alma
router.get("/getMusteri/:id", getMusteri); //otelleri alma
router.delete("/deleteAraba/:plaka", deleteAraba); //otelleri alma
router.put("/updateAraba/:plaka", updateAraba); //otelleri alma
router.delete("/deleteSofor/:sofor_id", deleteSofor); //otelleri alma
router.post("/kayitOlustur", kayitOlustur); //otelleri alma
router.get("/getOtelById/:otel_id", getOtelById); //otelleri alma
router.get("/getIstatistik3", getIstatistik3); //otelleri alma
router.delete('/deleteRezervasyon/:rez_id', deleteRezervasyon);
router.delete('/deleteProgramlar/:program_id', deleteProgramlar);
router.delete('/deleteSikayet/:sikayet_id', deleteSikayet);
router.delete('/getOtelById/:otel_id/:oda_id', deleteOda);
router.delete('/deleteMusteri/:musteri_id', deleteMusteri);
router.post('/registerOda', registerOda);
router.delete('/deleteOteller/:otel_id', deleteOteller);
router.get('/getOteller', getOteller);
router.post('/registerSikayet2', registerSikayet2);
module.exports = router;
