require('dotenv').config();
const { swapTokens } = require('./swap');
const readline = require('readline');

// Fungsi untuk mendapatkan input dari pengguna
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

// Fungsi untuk memvalidasi input jumlah token
function validateAmount(amount) {
    return !isNaN(amount) && parseFloat(amount) > 0;
}

(async function() {
    try {
        // Minta input dari pengguna
        let amount;
        do {
            amount = await askQuestion('Masukkan jumlah token yang ingin di-swap (gunakan titik untuk desimal): ');
            if (!validateAmount(amount)) {
                console.log('Jumlah token tidak valid. Silakan coba lagi.');
            }
        } while (!validateAmount(amount));

        const swapCount = await askQuestion('Masukkan jumlah berapa kali swap akan dilakukan: ');
        const direction = await askQuestion('Masukkan arah swap (1 untuk WPOL ke TPOL, 2 untuk TPOL ke WPOL): ');

        // Tentukan token berdasarkan pilihan pengguna
        const fromToken = direction === '1' ? process.env.WPOL_TOKEN : process.env.TPOL_TOKEN;
        const toToken = direction === '1' ? process.env.TPOL_TOKEN : process.env.WPOL_TOKEN;
        const fromTokenSymbol = direction === '1' ? 'WPOL' : 'tPOL';
        const toTokenSymbol = direction === '1' ? 'tPOL' : 'WPOL';

        const walletAddress = '0x9C55c173877f25D13538f4355305632126f8e1E0';
        
        // Dapatkan hash transaksi terbaru
        const hash = await askQuestion('Masukkan hash transaksi terbaru: ');
        
        const blockchainId = 137;
        const gasFeeTokenAddress = '0x0000000000000000000000000000000000000000';
        const gasFeeTokenSymbol = 'POL';
        const gasFeeAmount = '37605854299037000';

        const interval = 3600 * 1000;  // Interval waktu dalam milidetik (misalnya, setiap jam)

        // Jalankan swap pertama kali
        await swapTokens(amount, fromToken, toToken, fromTokenSymbol, toTokenSymbol, walletAddress, hash, blockchainId, gasFeeTokenAddress, gasFeeTokenSymbol, gasFeeAmount);

        // Swap secara berkala sesuai dengan swapCount
        let currentSwap = 1;
        const intervalId = setInterval(async () => {
            if (currentSwap < swapCount) {
                await swapTokens(amount, fromToken, toToken, fromTokenSymbol, toTokenSymbol, walletAddress, hash, blockchainId, gasFeeTokenAddress, gasFeeTokenSymbol, gasFeeAmount);
                currentSwap++;
            } else {
                clearInterval(intervalId);
                console.log('Swap selesai.');
            }
        }, interval);
    } catch (error) {
        console.error('Error during swap:', error);
    }
})();
