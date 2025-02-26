# Auto Swap Script

This project is a Node.js script to perform automatic token swaps using the TeaFi API for transaction confirmation.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Adinkkk725/teafi-auto-swap.git
   cd teafi-auto-swap
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the project root and add your configuration:
   ```plaintext
   SWAP_URL=https://api.tea-fi.com/transaction
   PRIVATE_KEY=YOUR_METAMASK_PRIVATE_KEY
   WPOL_TOKEN=0xYourWPOLTokenAddress  # WPOL Token Address
   TPOL_TOKEN=0xYourTPOLTokenAddress  # TPOL Token Address
   ```

## Usage

Run the script:
```sh
node index.js
```

The script will prompt you to enter the amount of tokens you want to swap, the number of times the swap should be repeated, and the direction of the swap (WPOL to TPOL or TPOL to WPOL). It will then perform the swap using the TeaFi API.

## Security

**Important:** Keep your `.env` file secure and do not share your private key or other sensitive information.
