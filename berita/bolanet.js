
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {
async function fetchBeritaTerkini() {
    try {
        // Mengambil HTML dari halaman berita terkini
        const { data } = await axios.get('https://www.bola.net/berita_terkini/');
        
        // Memuat HTML ke dalam Cheerio
        const $ = cheerio.load(data);
        
        // Mengambil berita terkini
        const berita = [];
        
        $('.box-article-list .item').each((index, element) => {
            const title = $(element).find('.description p a').text();
            const link = $(element).find('.description p a').attr('href');
            const category = $(element).find('.description-top span').first().text();
            const date = $(element).find('.description-top span').last().text();
            const imageUrl = $(element).find('figure img').attr('data-src');

            berita.push({
                title,
                link,
                category,
                date,
                imageUrl
            });
        });

        return berita;
    } catch (error) {
        console.error('Error fetching berita terkini:', error);
    }
}

// Endpoint untuk scraper bola net
  app.get('/berita/bolanet', async (req, res) => {
    try {
      const data = await fetchBeritaTerkini();
      if (data.length === 0) {
        return res.status(404).json({ message: 'Tidak ada berita terbaru yang ditemukan.' });
      }

      res.status(200).json({
        status: 200,
        creator: "Shannz",
        data: data
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data.' });
    }
  });
};
