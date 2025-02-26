const axios = require('axios');

async function swapTokens(amount, fromToken, toToken) {
    const privateKey = process.env.PRIVATE_KEY;
    const url = process.env.SWAP_URL;

    try {
        // Panggil API untuk melakukan swap
        const response = await axios.post(url, {
            privateKey,
            fromToken,
            toToken,
            amount
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`Swap berhasil: ${response.data}`);
    } catch (error) {
        if (error.response) {
            // Server merespons dengan status kode selain 2xx
            console.error(`Error during swap: ${error.response.status} - ${error.response.statusText}`);
            console.error(error.response.data);
        } else if (error.request) {
            // Permintaan dibuat tetapi tidak ada respons yang diterima
            console.error('No response received:', error.request);
        } else {
            // Kesalahan saat mengatur permintaan
            console.error('Error during swap:', error.message);
        }
    }
}

module.exports = { swapTokens };
