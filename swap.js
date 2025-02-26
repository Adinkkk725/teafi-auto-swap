const axios = require('axios');

async function swapTokens(amount, fromToken, toToken, fromTokenSymbol, toTokenSymbol, walletAddress, blockchainId, gasFeeTokenAddress, gasFeeTokenSymbol, gasFeeAmount) {
    const url = process.env.SWAP_URL;

    const data = {
        blockchainId,
        type: 3,
        walletAddress,
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        fromTokenSymbol,
        toTokenSymbol,
        fromAmount: amount,
        toAmount: amount,
        gasFeeTokenAddress,
        gasFeeTokenSymbol,
        gasFeeAmount
    };

    try {
        // Panggil API untuk melakukan swap
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://app.tea-fi.com',
                'Referer': 'https://app.tea-fi.com/',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
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
