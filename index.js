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

        const interval = 3600 * 1000;  // Interval waktu dalam milidetik (misalnya, setiap jam)

        // Jalankan swap pertama kali
        await swapTokens(amount, fromToken, toToken);

        // Swap secara berkala sesuai dengan swapCount
        let currentSwap = 1;
        const intervalId = setInterval(async () => {
            if (currentSwap < swapCount) {
                await swapTokens(amount, fromToken, toToken);
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
