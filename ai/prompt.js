const axios = require('axios');

// Fungsi untuk menghasilkan ID pengguna acak
function generateRandomUserId() {
    return 'user-' + Math.floor(Math.random() * 10000);
}

// Simpan ID pengguna di suatu tempat
let userId = generateRandomUserId();
console.log(`Generated User ID: ${userId}`);

module.exports = function(app) {

  // Fungsi untuk mem-fetch prompt
  async function fetchPrompt(content, prompt, user) {
    try {
      const response = await axios.post('https://luminai.my.id/', { content, prompt, user });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Endpoint AI Lunia
  app.get('/ai/prompt', async (req, res) => {
    try {
      const { text, prompt } = req.query;
      if (!text || !prompt) {
        return res.status(400).json({ error: 'Parameter "text" atau "prompt" Tidak Ditemukan, Tolong Masukkan Perintah' });
      }
      // Memanggil fetchPrompt dengan parameter text, prompt, dan userId
      const response = await fetchPrompt(text, prompt, userId);
      res.status(200).json({
        status: 200,
        creator: "siputz & AP",
        data: response
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
