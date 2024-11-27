const axios = require('axios');

module.exports = function(app) {

async function photoleap(prompt) {
    try {
        let result = []
        for (let i = 0; i < 1; i++) {
            let {
                data
            } = await axios.get('https://tti.photoleapapp.com/api/v1/generate?prompt=' + prompt);
            result.push(data.result_url)
        }
        return result
    } catch (e) {
        return ({
            msg: 404
        })
    }
}

// Endpoint 
  app.get('/ai/txt2img', async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) {
        return res.status(400).json({ error: 'Parameter "text" Tidak Ditemukan, Tolong Masukkan Perintah' });
      }
      const response = await photoleap(text);
      res.status(200).json({
        status: 200,
        creator: "hann & AP",
        data: response
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};