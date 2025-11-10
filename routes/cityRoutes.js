import express from "express";
const router = express.Router();

const cities = [
  "Kabupaten Aceh Barat",
  "Kabupaten Aceh Barat Daya",
  "Kabupaten Aceh Besar",
  "Kabupaten Aceh Jaya",
  "Kabupaten Aceh Selatan",
  "Kabupaten Aceh Singkil",
  "Kabupaten Aceh Tamiang",
  "Kabupaten Aceh Tengah",
  "Kabupaten Aceh Tenggara",
  "Kabupaten Aceh Timur",
  "Kabupaten Aceh Utara",
  "Kota Banda Aceh",
  "Kota Sabang",
  "Kabupaten Badung",
  "Kota Denpasar",
  "Kabupaten Bangkalan",
  "Kabupaten Banyuwangi",
  "Kota Surabaya",
  "Kota Malang",
  "Kabupaten Bandung",
  "Kota Bandung",
  "Kota Bekasi",
  "Kota Bogor",
  "Kota Tangerang",
  "Kota Depok",
  "Kota Jakarta Pusat",
  "Kota Jakarta Selatan",
  "Kota Jakarta Timur",
  "Kota Jakarta Barat",
  "Kota Jakarta Utara",
  "Kabupaten Sleman",
  "Kota Yogyakarta",
  "Kota Semarang",
  "Kota Surakarta",
  "Kota Pekalongan",
  "Kota Magelang",
  "Kabupaten Banyumas",
  "Kota Tegal",
  "Kabupaten Garut",
  "Kabupaten Cirebon",
  "Kota Cirebon",
  "Kota Palembang",
  "Kota Medan",
  "Kota Batam",
  "Kota Padang",
  "Kota Pekanbaru",
  "Kota Pontianak",
  "Kota Samarinda",
  "Kota Balikpapan",
  "Kota Makassar",
  "Kota Manado",
  "Kota Kendari",
  "Kota Jayapura"

];
router.get("/", (req, res)=> {
    res.json(cities);
});

export default router;