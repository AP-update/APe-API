const axios = require('axios');

module.exports = function(app) {

async function tiktokStalk(username) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await fetch(
        "https://tools.revesery.com/stalktk/revesery.php?username=" +
          encodeURI(username.replace(/[^\w\d]/gi, ""))
      );
      if (!res.ok) return reject("User Not Found");
      res = await res.json();
      delete res.base64;
      console.log(res);
      resolve(res);
    } catch (e) {
      reject(e);
    }
  });
}

// Endpoint tiktokstalk
  app.get('/tools/ttstalk', async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) {
        return res.status(400).json({ error: 'Parameter "text" Tidak Ditemukan, Tolong Masukkan Perintah' });
      }
      const response = await tiktokStalk(text);
      res.status(200).json({
        status: 200,
        creator: "AP",
        data: response
      });
    } catch (error) {
      res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  });
};