
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {
async function jadwalSholat(kota) {
  try {
    const { data } = await axios.get(`https://jadwal-sholat.tirto.id/${kota}`);
    const $ = cheerio.load(data);

    const daerahRaw = $('.f18.font59').text().toLowerCase().trim();
    const daerah = daerahRaw.replace('jadwal sholat hari ini ', '').replace('kota', '').replace('kab', '').replace('.', '').trim();

    if (!daerah.includes(kota.replace('kab', '').replace('-', '').replace('kota', '').trim())) {
      return { creator: 'zaenishi', mess: `Daerah "${kota}" tidak ditemukan, coba pakai kab atau kota (kab-karawang, kota-karawang).`, debug: daerah };
    }

    const nextSholat = $('#XXcd #nextSholat').text().trim();
    const waktu = $('#XXcd #nextCountDown').text().trim();
    const sholat = `${waktu} menuju waktu adzan sholat ${nextSholat} di kota ${daerah}`

    const hasil = [];
    $('.table-content-sholat').each((i, el) => {
      const tanggal = $(el).find('td').eq(0).text().trim();
      const subuh = $(el).find('td').eq(1).text().trim();
      const duha = $(el).find('td').eq(2).text().trim();
      const dzuhur = $(el).find('td').eq(3).text().trim();
      const ashar = $(el).find('td').eq(4).text().trim();
      const maghrib = $(el).find('td').eq(5).text().trim();
      const isya = $(el).find('td').eq(6).text().trim();

      hasil.push({ tanggal, subuh, duha, dzuhur, ashar, maghrib, isya });
    });

    return { daerah, informasi: sholat, jadwal: hasil };
  } catch (e) {
    return { mess: e.message };
  }
}

// Endpoint simi
  app.get('/jadwalsholat', async (req, res) => {
    try {
      const { search } = req.query;
      if (!search) {
        return res.status(400).json({ error: 'Parameter "search" Tidak Ditemukan, Tolong Masukkan Perintah' });
      }
      const response = await jadwalSholat(search);
      res.status(200).json({
        status: 200,
        creator: "zaenishi",
        data: response
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};