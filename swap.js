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
        });
        console.log(`Swap berhasil: ${response.data}`);
    } catch (error) {
        console.error("Error during swap:", error);
    }
}

module.exports = { swapTokens };
