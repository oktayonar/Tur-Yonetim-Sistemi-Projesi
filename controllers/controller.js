const dbConn = require("../db/mysql_connect");

const util = require('util');
const dbQuery = util.promisify(dbConn.query).bind(dbConn);

const rezervasyonEkle = async (tarih, kisi_sayi, rez_yapan_ad, rez_yapan_soyad, rez_yapan_tel) => {
  const eklemeSorgusu = "INSERT INTO rezervasyon (rezervasyon.rez_tarih, kisi_sayi, rez_yapan_ad, rez_yapan_soyad, rez_yapan_tel) VALUES (?, ?, ?, ?, ?)";
  const params = [tarih, kisi_sayi, rez_yapan_ad, rez_yapan_soyad, rez_yapan_tel];

  try {
    const sonuc = await dbQuery(eklemeSorgusu, params);
    return sonuc.insertId;
  } catch (hata) {
    console.error(`Rezervasyon eklenirken hata oluştu: ${eklemeSorgusu} - ${JSON.stringify(params)}`);
    throw hata;
  }
};

const musteriEkle = async (musteri_ad, musteri_soyad, uyruk, pasaport_no, musteri_tel) => {
  const eklemeSorgusu = "INSERT INTO musteriler (musteriler.musteri_ad, musteriler.musteri_soyad, musteriler.uyruk, musteriler.pasaport_no, musteriler.musteri_tel) VALUES (?, ?, ?, ?, ?)";
  const params = [musteri_ad, musteri_soyad, uyruk, pasaport_no, musteri_tel];

  try {
    const sonuc = await dbQuery(eklemeSorgusu, params);
    return sonuc.insertId;
  } catch (hata) {
    console.error(`Müşteri eklenirken hata oluştu: ${eklemeSorgusu} - ${JSON.stringify(params)}`);
    throw hata;
  }
};

const rezerveMusteriEkle = async (rez_id, musteri_id) => {
  const eklemeSorgusu = "INSERT INTO rezerve_musteri (rezerve_musteri.rez_id, rezerve_musteri.musteri_id) VALUES (?, ?)";
  const params = [rez_id, musteri_id];

  try {
    const sonuc = await dbQuery(eklemeSorgusu, params);
    return sonuc.insertId;
  } catch (hata) {
    console.error(`Rezerve müşteri eklenirken hata oluştu: ${eklemeSorgusu} - ${JSON.stringify(params)}`);
    throw hata;
  }
};

const programRezervasyonEkle = async (rez_id, program_id, program_tarih, plaka, program_aciklama) => {
  const eklemeSorgusu = "INSERT INTO program_rezervasyon (program_rezervasyon.rez_id, program_rezervasyon.program_id, program_rezervasyon.program_tarih, program_rezervasyon.plaka, program_rezervasyon.program_aciklama) VALUES (?, ?, ?, ?, ?)";
  const params = [rez_id, program_id, program_tarih, plaka, program_aciklama];

  try {
    const sonuc = await dbQuery(eklemeSorgusu, params);
    return sonuc.insertId;
  } catch (hata) {
    console.error(`Program rezervasyon eklenirken hata oluştu: ${eklemeSorgusu} - ${JSON.stringify(params)}`);
    throw hata;
  }
}

const odaRezervasyonEkle = async (rez_id, oda_id, odaSayisi, gece_sayisi) => {
  const eklemeSorgusu = "INSERT INTO oda_rez (oda_rez.rez_id, oda_rez.oda_id, oda_rez.oda_sayi, oda_rez.gece_sayisi) VALUES (?, ?, ?, ?)";
  const params = [rez_id, oda_id, odaSayisi, gece_sayisi];

  try {
    const sonuc = await dbQuery(eklemeSorgusu, params);
    return sonuc.insertId;
  } catch (hata) {
    console.error(`Oda rezervasyon eklenirken hata oluştu: ${eklemeSorgusu} - ${JSON.stringify(params)}`);
    throw hata;
  }
}

const ucusEkle = async (gidis_ucus_no, gidis_tarih, gidis_saati, gelis_ucus_no, gelis_tarih, gelis_saati) => {
  const eklemeSorgusu = "INSERT INTO ucuslar (   ucuslar.gelis_ucus_no,ucuslar.gelis_tarih, ucuslar.gelis_saati,ucuslar.gidis_ucus_no, ucuslar.gidis_tarih, ucuslar.gidis_saati) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [gelis_ucus_no, gelis_tarih, gelis_saati, gidis_ucus_no, gidis_tarih, gidis_saati];

  try {
    const sonuc = await dbQuery(eklemeSorgusu, params);
    return sonuc.insertId;
  } catch (hata) {
    console.error(`Uçuş eklenirken hata oluştu: ${eklemeSorgusu} - ${JSON.stringify(params)}`);
    throw hata;
  }
}

const ucusRezervasyonEkle = async (rez_id, ucus_id) => {
  const eklemeSorgusu = "INSERT INTO ucus_rez (ucus_rez.rez_id, ucus_rez.ucus_id) VALUES (?, ?)";
  const params = [rez_id, ucus_id];

  try {
    const sonuc = await dbQuery(eklemeSorgusu, params);
    return sonuc.insertId;
  } catch (hata) {
    console.error(`Uçuş rezervasyon eklenirken hata oluştu: ${eklemeSorgusu} - ${JSON.stringify(params)}`);
    throw hata;
  }
}



const kayitOlustur = async (req, res) => {
  try {
    const {
      rez_tarih, kisi_sayi, rez_yapan_ad, rez_yapan_soyad, rez_yapan_tel,
      musteriler, gece_sayisi, odalar, odaSayisi, programlar, gelis_ucus_no, gelis_tarih,
      gidis_ucus_no, gidis_tarih, programTarih, plaka, aciklama, gelis_saati, gidis_saati
    } = req.body;

    if (!musteriler || !musteriler.length) {
      return res.status(400).send("En az bir müşteri gereklidir.");
    }

    // Rezervasyonu ekle
    const rez_id = await rezervasyonEkle(rez_tarih, kisi_sayi, rez_yapan_ad, rez_yapan_soyad, rez_yapan_tel);

    // Müşterileri ve ilişkili rezervasyonları ekle
    for (let musteri of musteriler) {
      const musteri_id = await musteriEkle(musteri.musteri_ad, musteri.musteri_soyad, musteri.uyruk, musteri.pasaport_no, musteri.musteri_tel);
      await rezerveMusteriEkle(rez_id, musteri_id);
    }

    // Programları ve ilişkili rezervasyonları ekle
    for (let program of programlar) {
      await programRezervasyonEkle(rez_id, program.program_id, program.program_tarih, program.plaka, program.program_aciklama);
    }


    // Odaları ve ilişkili rezervasyonları ekle
    for (let oda of odalar) {
      await odaRezervasyonEkle(rez_id, oda.odaId, oda.odaSayisi, oda.gece_sayisi);
    }

    // Uçuşları ve uçuş rezervasyonlarını ekle
    const ucus_id = await ucusEkle(gelis_ucus_no, gelis_tarih, gelis_saati, gidis_ucus_no, gidis_tarih, gidis_saati);
    await ucusRezervasyonEkle(rez_id, ucus_id);

    res.status(200).send("Rezervasyon başarıyla oluşturuldu.");

  } catch (hata) {
    console.error(hata);
    res.status(500).send("Bir hata oluştu.");
  }
};



const registerSofor = async (req, res) => {
  const { soforAd, soforSoyad, soforTel } = req.body;

  dbConn.query(
    "SELECT * FROM soforler WHERE sofor_tel = ?",
    soforTel,
    (err, result) => {
      if (result.length > 0) {
        return res.status(401).json({
          success: false,
          message: "Kayıt Mevcut",
        });
      } else {
        dbConn.query(
          "INSERT INTO soforler (sofor_ad,sofor_soyad,sofor_tel) VALUES (?,?,?)",
          [soforAd, soforSoyad, soforTel],
          (err, result) => {
            if (!err) {
              return res.status(201).json({
                success: true,
                message: "Kayıt Başarılı",
              });
            } else {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Sunucu Hatası",
              });
            }
          }
        );
      }
    }
  );
};

const getSoforler = async (req, res) => {
  dbConn.query("SELECT * FROM soforler", (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
};

const deleteSofor = async (req, res) => {
  const { sofor_id } = req.params;
  dbConn.query("DELETE FROM soforler WHERE sofor_id = ?", [sofor_id], (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        message: "Şoför başarıyla silindi",
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
};

const getProgramlar = async (req, res) => {
  try {
    dbConn.query("SELECT * FROM programlar", (err, results) => {
      if (err) {
        console.log(err);
        throw new Error("Sunucu Hatası");
      } else {
        return res.status(200).json({
          success: true,
          data: results,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Sunucu Hatası",
    });
  }
};

const deleteProgramlar = async (req, res) => {
  const { program_id } = req.params;
  dbConn.query("DELETE FROM programlar WHERE program_id = ?", [program_id], (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        message: "Program başarıyla silindi",
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
};
const getArabalar = async (req, res) => {
  const { plaka, model, sofor_ad, } = req.body;
  dbConn.query(
    "SELECT arabalar.plaka, arabalar.model, CONCAT(soforler.sofor_ad,' ',soforler.sofor_soyad) AS sofor_ad FROM arabalar INNER JOIN soforler ON arabalar.sofor_id = soforler.sofor_id",
    [plaka, model, sofor_ad],
    (err, result) => {
      if (!err) {
        return res.status(200).json({
          success: true,
          data: result,
        });
      } else {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Sunucu Hatası",
        });
      }
    }
  );
};

const updateAraba = async (req, res) => {
  const { oldPlaka, newPlaka, sofor_id, model } = req.body;

  if (!sofor_id) {
    return res.status(400).json({
      success: false,
      message: "sofor_id is required",
    });
  }

  // Araba güncelleme sorgusu
  const updateArabaQuery =
    "UPDATE arabalar SET arabalar.plaka = ?, arabalar.model = ?, arabalar.sofor_id = ? WHERE arabalar.plaka = ?";

  dbConn.query(
    updateArabaQuery,
    [newPlaka, model, sofor_id, oldPlaka],
    (updateErr, updateResult) => {
      if (updateErr) {
        console.log(updateErr);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }

      // Güncelleme başarılı
      return res.status(200).json({
        success: true,
        message: "Update successful",
      });
    }
  );
};

const deleteAraba = async (req, res) => {
  const { plaka } = req.params; // Assuming that the car's plate number is unique and used as an identifier
  dbConn.query(
    "DELETE FROM arabalar WHERE plaka = ?",
    [plaka],
    (err, result) => {
      if (!err) {
        return res.status(200).json({
          success: true,
          message: "Car deleted successfully",
        });
      } else {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    }
  );
};

const getSoforlerAd = async (req, res) => {
  dbConn.query(
    "SELECT CONCAT(soforler.sofor_ad,' ',soforler.sofor_soyad) AS sofor_ad FROM soforler",
    (err, result) => {
      if (!err) {
        return res.status(200).json({
          success: true,
          data: result,
        });
      } else {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Sunucu Hatası",
        });
      }
    }
  );
};

const queryPromise = (sql, values) => {
  return new Promise((resolve, reject) => {
    dbConn.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getOtellerAd = async (req, res) => {
  try {
    let otel = {};
    otel.otel_id = req.params.id;
    const oteller = await queryPromise("SELECT oteller.otel_ad, oteller.otel_id FROM oteller");

    for (let i = 0; i < oteller.length; i++) {
      const otel = oteller[i];
      const rooms = await queryPromise(
        "SELECT odalar.oda_id, odalar.oda_turu, odalar.gecelik_fiyat FROM odalar WHERE otel_id = ?",
        [otel.otel_id]
      );

      oteller[i] = {
        otel_ad: otel.otel_ad,
        otel_id: otel.otel_id,
        rooms: rooms,
      };
    }

    return res.status(200).json({
      success: true,
      data: oteller,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Sunucu Hatası",
    });
  }
};
const getOtelById = async (req, res) => {
  try {
    const otel_id = req.params.otel_id;

    const otel = await queryPromise("SELECT * FROM oteller WHERE otel_id = ?", [otel_id]);
    console.log(req.params.otel_id);

    if (otel.length > 0) {
      const rooms = await queryPromise(
        "SELECT odalar.oda_id, odalar.oda_turu, odalar.gecelik_fiyat FROM odalar WHERE otel_id = ?",
        [otel_id]
      );
      console.log(otel);

      otel[0].rooms = rooms;

      return res.status(200).json({
        success: true,
        data: otel[0],
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Otel bulunamadı",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Sunucu Hatası",
    });
  }
};

const deleteOda = async (req, res) => {
  try {
    const otel_id = req.params.otel_id;
    const oda_id = req.params.oda_id;

    // Delete the room associated with the hotel
    await queryPromise("DELETE FROM odalar WHERE otel_id = ? AND oda_id = ?", [otel_id, oda_id]);

    return res.status(200).json({
      success: true,
      message: "Oda başarıyla silindi",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Sunucu Hatası",
    });
  }
};


const registerArabalar = async (req, res) => {
  const { plaka, sofor_id, model } = req.body;

  dbConn.query(
    "SELECT * FROM arabalar WHERE plaka = ?",
    [plaka],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(401).json({
          success: false,
          message: "Kayıt Mevcut",
        });
      } else {
        dbConn.query(
          "SELECT * FROM soforler WHERE sofor_id = ?",
          [sofor_id],
          (err, result) => {
            if (result.length == 0) {
              return res.status(400).json({
                success: false,
                message: "Sofor bulunamadı",
              });
            } else {
              dbConn.query(
                "INSERT INTO arabalar (plaka, sofor_id, model) VALUES (?,?,?)",
                [plaka, sofor_id, model],
                (err, result) => {
                  if (!err) {
                    return res.status(201).json({
                      success: true,
                      message: "Kayıt Başarılı",
                      sofor_id: sofor_id,
                    });
                  } else {
                    console.log(err);
                    return res.status(500).json({
                      success: false,
                      message: "Sunucu Hatası",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

const registerProgram = async (req, res) => {
  const { programAd, programFiyat } = req.body;
  dbConn.query(
    "SELECT * FROM programlar WHERE program_ad = ?",
    programAd,
    (err, result) => {
      if (result.length > 0) {
        return res.status(401).json({
          success: false,
          message: "Kayıt Mevcut",
        });
      } else {
        dbConn.query(
          "INSERT INTO programlar (program_ad,program_fiyat) VALUES (?,?)",
          [programAd, programFiyat],
          (err, result) => {
            if (!err) {
              return res.status(201).json({
                success: true,
                message: "Kayıt Başarılı",
              });
            } else {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Sunucu Hatası",
              });
            }
          }
        );
      }
    }
  );
};


const registerOtel = async (req, res) => {
  const { otelAd, otelAdres } = req.body;
  dbConn.query(
    "SELECT * FROM oteller WHERE otel_ad = ?",
    [otelAd],
    (err, result) => {
      if (result.length > 0) {
        return res.status(401).json({
          success: false,
          message: "Otel Mevcut",
        });
      } else {
        dbConn.query(
          "INSERT INTO oteller (otel_ad,otel_adres) VALUES (?,?)",
          [otelAd, otelAdres],
          (err, result) => {
            if (!err) {
              return res.status(201).json({
                success: true,
                message: "Kayıt Başarılı",
              });
            } else {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Sunucu Hatası",
              });
            }
          }
        );
      }
    }
  );
};

const registerOda = async (req, res) => {
  const { odaTuru, gecelikFiyat, otel_id } = req.body;

  // otel_id kontrolü ekleniyor
  if (!otel_id) {
    return res.status(400).json({
      success: false,
      message: "Geçerli bir otel seçilmelidir.",
    });
  }

  dbConn.query(
    "INSERT INTO odalar (oda_turu,gecelik_fiyat,otel_id) VALUES (?,?,?)",
    [odaTuru, gecelikFiyat, otel_id],
    (err, result) => {
      if (!err) {
        return res.status(201).json({
          success: true,
          message: "Kayıt Başarılı",
        });
      } else {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Sunucu Hatası",
        });
      }
    }
  );
}

const soforBilgiler = async (req, res) => {
  const { plaka } = req.params;
  let results = {};

  const query = `
    SELECT 
    CONCAT(soforler.sofor_ad,' ',soforler.sofor_soyad) AS sofor_ad_soyad,
      program_rezervasyon.program_tarih, 
      program_rezervasyon.plaka, 
      programlar.program_ad,
      
      oteller.otel_ad,
      oteller.otel_adres, 
      CONCAT(rezervasyon.rez_yapan_ad,' ',rezervasyon.rez_yapan_soyad) AS rez_ad_soyad, 
      rezervasyon.rez_yapan_tel, 
      rezervasyon.kisi_sayi, 
      ucuslar.gelis_tarih, 
      ucuslar.gelis_ucus_no, 
      ucuslar.gelis_saati,
      ucuslar.gidis_tarih, 
      ucuslar.gidis_ucus_no, 
      ucuslar.gidis_saati,
      program_rezervasyon.program_aciklama 
    FROM 
      programlar, 
      program_rezervasyon,
      oteller,
      odalar,
      oda_rez,
      ucus_rez,
      ucuslar,
      rezervasyon,
      soforler,
      arabalar
    WHERE 
      programlar.program_id = program_rezervasyon.program_id AND
      oteller.otel_id = odalar.otel_id AND
      odalar.oda_id = oda_rez.oda_id AND
      oda_rez.rez_id = rezervasyon.rez_id AND
      rezervasyon.rez_id = ucus_rez.rez_id AND
      ucus_rez.ucus_id = ucuslar.ucus_id AND
      rezervasyon.rez_id = program_rezervasyon.rez_id AND arabalar.plaka = program_rezervasyon.plaka AND  
      soforler.sofor_id = arabalar.sofor_id
      AND
      program_rezervasyon.plaka = ?
    GROUP BY 
      program_rezervasyon.program_tarih
    ORDER BY 
      program_rezervasyon.program_tarih DESC
  `;

  dbConn.query(query, [plaka], (err, result) => {
    if (!err) {
      if (result.length > 0) {
        results.plaka_sorgu = result; // Sonucu results nesnesine atayın
        return res.status(200).json({
          success: true,
          data: results, // results nesnesini döndürün
        });
      } else {
        console.error("No data or invalid data format received");
        return res.status(500).json({
          success: false,
          message: "Invalid data format or no data received",
        });
      }
    } else {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`,
      });
    }
  });
};
const getSikayet = async (req, res) => {
  dbConn.query("SELECT sikayet.musteri_id, sikayet.sikayet_id,   musteriler.musteri_ad, musteriler.musteri_soyad, musteriler.musteri_tel, sikayet.sikayet_turu, sikayet.sikayet_aciklama FROM musteriler, sikayet WHERE musteriler.musteri_id = sikayet.musteri_id", (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
};

const deleteSikayet = async (req, res) => {
  const { sikayet_id } = req.params; // Assuming that the car's plate number is unique and used as an identifier
  dbConn.query(
    "DELETE FROM sikayet WHERE sikayet_id = ?",
    [sikayet_id],
    (err, result) => {
      if (!err) {
        return res.status(200).json({
          success: true,
          message: "complaint deleted successfully",
        });
      } else {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    }
  );
};

const registerSikayet = async (req, res) => {
  const { musteri_tel, sikayet_turu, sikayet_aciklama } = req.body;

  dbConn.query(
    "SELECT * FROM musteriler WHERE musteri_tel = ?",
    [musteri_tel],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (result.length > 0) {
        const musteri_id = result[0].musteri_id;
        dbConn.query(
          "INSERT INTO sikayet (musteri_id, sikayet_turu, sikayet_aciklama) VALUES (?,?,?)",
          [musteri_id, sikayet_turu, sikayet_aciklama],
          (err, result) => {
            if (!err) {
              return res.status(201).json({
                success: true,
                message: "Kayıt Başarılı",
                musteri_id: musteri_id,
              });
            } else {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Sunucu Hatası",
              });
            }
          }
        );
      } else {
        return res.status(401).json({
          success: false,
          message: "Müşteri bulunamadı",
        });
      }
    }
  );
}

const nodemailer = require("nodemailer");

const registerSikayet2 = async (req, res) => {
  const { musteri_ad, musteri_soyad, musteri_tel, sikayet_turu, sikayet_aciklama } = req.body;

  dbConn.query(
    "SELECT * FROM musteriler WHERE musteri_tel = ?",
    [musteri_tel],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (result.length > 0) {
        const musteri_id = result[0].musteri_id;
        dbConn.query(
          "INSERT INTO sikayet (musteri_id, sikayet_turu, sikayet_aciklama) VALUES (?,?,?)",
          [musteri_id, sikayet_turu, sikayet_aciklama],
          (err, result) => {
            if (!err) {
              // Create a transporter using nodemailer
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "63furkan27@gmail.com",
                  pass: "conh wjlq icbg cehh",
                },
              });

              // Define the email options
              const mailOptions = {
                from: "63furkan27@gmail.com",
                to: "63furkan27@gmail.com",
                subject: "New Sikayet Form Submission",
                html: `
                  <p><strong>Name:</strong> ${musteri_ad}</p>
                  <p><strong>Surname:</strong> ${musteri_soyad}</p>
                  <p><strong>Phone:</strong> ${musteri_tel}</p>
                  <p><strong>Subject:</strong> ${sikayet_turu}</p>
                  <p><strong>Message:</strong> ${sikayet_aciklama}</p>
                `,
              };

              // Send the email
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  return res.status(500).json({ success: false, message: "Error sending email" });
                }

                return res.status(201).json({
                  success: true,
                  message: "Kayıt Başarılı ve Email Gönderildi",
                  musteri_id: musteri_id,
                });
              });
            } else {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Sunucu Hatası",
              });
            }
          }
        );
      } else {
        return res.status(401).json({
          success: false,
          message: "Müşteri bulunamadı",
        });
      }
    }
  );
};
const getRezervasyon = async (req, res) => {
  dbConn.query("SELECT rezervasyon.rez_tarih, rezervasyon.rez_id, CONCAT(rezervasyon.rez_yapan_ad,' ',rezervasyon.rez_yapan_soyad) AS rez_ad_soyad, rezervasyon.rez_yapan_tel, ucuslar.gelis_ucus_no, ucuslar.gelis_tarih,ucuslar.gelis_saati, ucuslar.gidis_ucus_no, ucuslar.gidis_tarih,ucuslar.gidis_saati, rezervasyon.kisi_sayi,rezervasyon.toplam_fiyat FROM rezervasyon, ucuslar, ucus_rez WHERE ucus_rez.ucus_id=ucuslar.ucus_id AND ucus_rez.rez_id=rezervasyon.rez_id  ORDER BY rezervasyon.rez_tarih DESC", (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
};
const getIstatistik = async (req, res) => {
  // ... existing code ...
  let istatistikQuery = "SELECT (SELECT COUNT(*) FROM musteriler) AS musteri_sayisi, (SELECT COUNT(*) FROM rezervasyon) AS rez_sayisi,(SELECT COUNT(*) FROM soforler) AS sofor_sayisi,(SELECT COUNT(*) FROM arabalar) AS araba_sayisi, (SELECT COUNT(*) FROM sikayet) AS sikayet_sayisi;";
  let aktifRezQuery = "SELECT COUNT(*) AS aktif_rez_sayisi FROM rezervasyon WHERE rez_tarih >= CURDATE()";
  let bostaArabaSayisi = "SELECT COUNT(*) AS bosta_olan_araba FROM arabalar LEFT JOIN program_rezervasyon ON arabalar.plaka = program_rezervasyon.plaka WHERE program_rezervasyon.plaka IS NULL;"
  let bostaSoforSayisi = "SELECT COUNT(*) AS bosta_olan_sofor_sayisi FROM soforler LEFT JOIN arabalar ON soforler.sofor_id = arabalar.sofor_id LEFT JOIN program_rezervasyon ON program_rezervasyon.plaka = arabalar.plaka WHERE program_rezervasyon.plaka IS NULL;"
  dbConn.query(istatistikQuery, (err, istatistikResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    } else {
      dbConn.query(aktifRezQuery, (err, aktifRezResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Sunucu Hatası",
          });
        } else {
          istatistikResult[0].aktif_rez_sayisi = aktifRezResult[0].aktif_rez_sayisi;
          dbConn.query(bostaArabaSayisi, (err, bostaArabaResult) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Sunucu Hatası",
              });
            } else {
              istatistikResult[0].bosta_olan_araba = bostaArabaResult[0].bosta_olan_araba;
              dbConn.query(bostaSoforSayisi, (err, bostaSoforResult) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    success: false,
                    message: "Sunucu Hatası",
                  });
                } else {
                  istatistikResult[0].bosta_olan_sofor_sayisi = bostaSoforResult[0].bosta_olan_sofor_sayisi;
                  return res.status(200).json({
                    success: true,
                    data: istatistikResult[0],
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}
const getIstatistik2 = async (req, res) => {
  let results = [];
  let programSet = new Set();

  // Programların ID'lerini ve isimlerini çeken sorgu
  dbConn.query("SELECT program_rezervasyon.program_id, programlar.program_ad FROM program_rezervasyon INNER JOIN programlar ON program_rezervasyon.program_id = programlar.program_id", async (err, programs) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }

    for (let i = 0; i < programs.length; i++) {
      // Eğer program_id daha önce işlenmediyse
      if (!programSet.has(programs[i].program_id)) {
        programSet.add(programs[i].program_id);

        await new Promise((resolve, reject) => {
          dbConn.query(`SELECT ROUND(COUNT(program_rezervasyon.program_id) / (SELECT COUNT(*) FROM programlar) * 100,1) AS \`${programs[i].program_ad}\` FROM program_rezervasyon WHERE program_rezervasyon.program_id = ${programs[i].program_id}`, (err, result) => {
            if (!err) {
              results.push(result);
              resolve();
            } else {
              console.log(err);
              reject();
            }
          });
        }).catch(() => {
          return res.status(500).json({
            success: false,
            message: "Sunucu Hatası",
          });
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  });
}

const getIstatistik3 = async (req, res) => {
  const istatistikQuery = `
  SELECT 
  MONTH(rezervasyon.rez_tarih) AS ay,
  YEAR(rezervasyon.rez_tarih) AS yil,
  COUNT(*) AS rezervasyon_sayisi
FROM rezervasyon
GROUP BY ay,yil

ORDER BY MONTH(rez_tarih);
  `;

  dbConn.query(istatistikQuery, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    } else {
      return res.status(200).json({
        success: true,
        data: results,
      });
    }
  });
}



const getMusteri = async (req, res) => {
  const rez_id = req.params.id; // rez_id değerini istekten alın
  console.log(`rez_id: ${rez_id}`); // rez_id değerini logla
  let results = {};

  // musteri_rez saklı yordamını çağır
  dbConn.query(`
  SELECT CONCAT(musteriler.musteri_ad,' ',musteriler.musteri_soyad) AS musteri_ad_soyad, musteriler.uyruk, 
  musteriler.musteri_tel, musteriler.pasaport_no FROM musteriler, rezerve_musteri,rezervasyon WHERE musteriler.musteri_id = rezerve_musteri.musteri_id AND  rezerve_musteri.rez_id = rezervasyon.rez_id AND rezervasyon.rez_id = ?`,
    [rez_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Sunucu Hatası",
        });
      }
      console.log(result); // sonucu logla
      results.musteri_rez = result;

      // program_rez saklı yordamını çağır
      dbConn.query(`
    SELECT programlar.program_ad, programlar.program_fiyat,program_rezervasyon.program_tarih, program_rezervasyon.plaka, CONCAT(soforler.sofor_ad,' ',soforler.sofor_soyad) AS sofor_ad_soyad
    FROM  rezervasyon, program_rezervasyon, programlar, arabalar, soforler
    WHERE rezervasyon.rez_id = program_rezervasyon.rez_id AND program_rezervasyon.program_id = programlar.program_id AND program_rezervasyon.plaka = arabalar.plaka AND arabalar.sofor_id = soforler.sofor_id AND rezervasyon.rez_id = ?`,
        [rez_id], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              message: "Sunucu Hatası",
            });
          }
          console.log(result); // sonucu logla
          results.program_rez = result;

          // otel_rez saklı yordamını çağır
          dbConn.query(`
          SELECT oteller.otel_ad, odalar.oda_turu, oda_rez.oda_sayi, oda_rez.gece_sayisi, (oda_rez.oda_sayi*oda_rez.gece_sayisi*odalar.gecelik_fiyat) AS toplam_otel_fiyat
          FROM  rezervasyon, odalar, oteller,oda_rez
          WHERE rezervasyon.rez_id = oda_rez.rez_id AND oda_rez.oda_id = odalar.oda_id AND oteller.otel_id = odalar.otel_id AND rezervasyon.rez_id = ? GROUP BY odalar.oda_turu;`,
            [rez_id], (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: false,
                  message: "Sunucu Hatası",
                });
              }
              console.log(result); // sonucu logla
              results.otel_rez = result;

              // Tüm sonuçları bir kez gönder
              return res.status(200).json({
                success: true,
                data: results,
              });
            });
        });
    });
};

const getMusteri2 = async (req, res) => {
  dbConn.query("SELECT * FROM musteriler, rezerve_musteri WHERE musteriler.musteri_id = rezerve_musteri.musteri_id ORDER BY musteriler.musteri_ad", (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
}

const deleteMusteri = async (req, res) => {
  const { musteri_id } = req.params; // musteri_id'yi URL parametresinden al
  dbConn.query("DELETE FROM musteriler WHERE musteri_id = ?", [musteri_id], (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        message: "Müşteri başarıyla silindi",
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
};


const deleteRezervasyon = async (req, res) => {
  const rez_id = parseInt(req.params.rez_id, 10); // Parse rez_id as an integer

  if (isNaN(rez_id)) {
    return res.status(400).send('Invalid rez_id');
  }

  const silmeSorgusu = [
    "DELETE FROM rezerve_musteri WHERE rez_id = ?",
    "DELETE FROM program_rezervasyon WHERE rez_id = ?",
    "DELETE FROM oda_rez WHERE rez_id = ?",
    "DELETE FROM ucus_rez WHERE rez_id = ?",
    "DELETE FROM rezervasyon WHERE rez_id = ?"
  ];

  try {
    for (const query of silmeSorgusu) {
      await dbQuery(query, [rez_id]);
    }

    res.status(200).send(`Rezervasyon ve bağlı veriler başarıyla silindi. (rez_id: ${rez_id})`);
  } catch (hata) {
    console.error(hata);
    res.status(500).send('Bir hata oluştu.');
  }
};
const deleteOteller = async (req, res) => {
  const { otel_id } = req.params;
  dbConn.query("DELETE FROM oteller WHERE otel_id = ?", [otel_id], (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        message: "Otel başarıyla silindi",
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
};

const getOteller = async (req, res) => {
  dbConn.query("SELECT * FROM oteller", (err, result) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Sunucu Hatası",
      });
    }
  });
};




module.exports = {

  registerSofor,
  registerProgram,
  registerOtel,
  getSoforler,
  getProgramlar,
  getSoforlerAd,
  registerArabalar,
  getArabalar,
  getOtellerAd,
  soforBilgiler,
  getSikayet,
  registerSikayet,
  getRezervasyon,
  getIstatistik,
  getIstatistik2,
  getMusteri,
  deleteAraba,
  updateAraba,
  deleteSofor,
  kayitOlustur,
  getOtelById,
  getMusteri2,
  getIstatistik3,
  deleteRezervasyon,
  deleteProgramlar,
  deleteSikayet,
  deleteOda,
  deleteMusteri,
  registerOda,
  deleteOteller,
  getOteller,
  registerSikayet2,




};
