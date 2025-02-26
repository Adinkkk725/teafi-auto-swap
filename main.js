import axios from "axios";
import sendDepositTransaction from './utils/swap.js';
import pkg from "ethers";
import dotenv from "dotenv";
dotenv.config();

const { formatUnits } = pkg;

const TOKEN_ADDRESS = {
    POL: "0x0000000000000000000000000000000000000000",
    WPOL: process.env.CONTRACT_ADDRESS,
    NETWORK_ID: 137,
    TYPE: 2 // Convert
};

async function getGasQuote() {
    try {
        const url = `${process.env.SWAP_URL}/gas-quote`;
        const params = {
            chain: TOKEN_ADDRESS.NETWORK_ID,
            txType: TOKEN_ADDRESS.TYPE,
            gasPaymentToken: TOKEN_ADDRESS.POL,
            neededGasPermits: 0
        };

        const response = await axios.get(url, { params });
        const gasInNativeToken = response?.data?.gasInNativeToken || '0';

        console.log("⛽ Gas In Native Token:", `${formatUnits(gasInNativeToken, 18)} POL`);
        return gasInNativeToken;
    } catch (error) {
        console.error("❌ Error fetching gas:", error.response ? error.response.data : error.message);
        return '0';
    }
}

function getTokenSymbol(address) {
    return Object.keys(TOKEN_ADDRESS).find(key => TOKEN_ADDRESS[key] === address) || "UNKNOWN";
}

async function sendTransaction(gasFee, isRetry = false, retries = 5, txHash, address, amount) {
    if (!isRetry) {
        try {
            ({ txHash, address, amount } = await sendDepositTransaction());
            if (!txHash) throw new Error("Transaction hash is undefined.");
        } catch (error) {
            console.error("❌ Failed to initiate transaction:", error.message);
            return null;
        }
    }

    console.log(`🚀 Trying to send tx report to backend:`, txHash);

    const fromTokenSymbol = getTokenSymbol(TOKEN_ADDRESS.POL);
    const toTokenSymbol = getTokenSymbol(TOKEN_ADDRESS.WPOL);

    const payload = {
        hash: txHash,
        blockchainId: TOKEN_ADDRESS.NETWORK_ID,
        type: TOKEN_ADDRESS.TYPE,
        walletAddress: address,
        fromTokenAddress: TOKEN_ADDRESS.POL,
        toTokenAddress: TOKEN_ADDRESS.WPOL,
        fromTokenSymbol,
        toTokenSymbol,
        fromAmount: amount,
        toAmount: amount,
        gasFeeTokenAddress: TOKEN_ADDRESS.POL,
        gasFeeTokenSymbol: fromTokenSymbol,
        gasFeeAmount: gasFee
    };

    try {
        const response = await axios.post(process.env.SWAP_URL, payload);
        console.log("✅ Transaction Report Successfully Sent:", response?.data);

        await getPoints(address);
        return address;
    } catch (error) {
        console.error("❌ Failed To Send Transaction Report:", error.response?.data || error.message);

        if (retries > 0) {
            console.warn(`🔃 Retrying in 3s... (${retries - 1} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return sendTransaction(gasFee, true, retries - 1, txHash, address, amount);
        }

        console.error("🚨 Max retries reached. Giving up or ask them to upgrade server lol😆");
        return address;
    }
}

async function getPoints(address) {
    console.log(`🔃 Trying to check current points...`);
    try {
        const response = await axios.get(`${process.env.SWAP_URL}/points/${address}`);
        console.log("📊 Total Points:", response?.data?.pointsAmount || 0);
    } catch (error) {
        console.error("❌ Error When Checking Points:", error.response?.data || error.message);
    }
}

async function checkInStatus(address) {
    try {
        const response = await axios.get(`${process.env.SWAP_URL}/wallet/check-in/current?address=${address}`);
        console.log("📅 Last CheckIn:", response?.data?.lastCheckIn || `Never check in`);
        return response?.data?.lastCheckIn;
    } catch (error) {
        console.error("❌ Failed to Check latest checkIn:", error.response?.data || error.message);
    }
}

async function checkIn(address) {
    try {
        const response = await axios.post(`${process.env.SWAP_URL}/wallet/check-in?address=${address}`, {});
        console.log("✅ Check-In Successfully:", response.data);
    } catch (error) {
        console.error("❌ Failed to Check-In:", error.response?.data || error.message);
    }
}

async function checkInUser(address) {
    console.log(`📢 Trying to check latest checkin user...`);
    const lastCheckIn = await checkInStatus(address);
    const lastDate = new Date(lastCheckIn).getUTCDate();
    const now = new Date().getUTCDate();
    if (lastDate !== now) {
        console.log(`🔃 Trying to checkin...`);
        await checkIn(address);
    } else {
        console.log(`✅ Already checkin today...`);
    }
}

(async () => {
    await new Promise(resolve => setTimeout(resolve, 5 * 1000));
    let counter = 0;

    while (true) {
        console.clear();
        counter++;
        console.log(`=X= ================ZLKCYBER================ =X=`);
        console.log(`🔃 Processing Transaction ${counter} ( CTRL + C ) to exit..\n`);

        const gasFee = await getGasQuote();
        const address = await sendTransaction(gasFee);

        await checkInUser(address);
        console.log(`=X= ======================================== =X=`);
        await new Promise(resolve => setTimeout(resolve, 10 * 1000));
    }
})();
