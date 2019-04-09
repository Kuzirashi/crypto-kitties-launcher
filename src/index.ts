import Web3 from 'web3';
import ERC721_ABI from './abi/ERC721.json';
import { ERC721 } from '../types/web3-contracts/ERC721';
import { KittyTransferDistanceCalculator } from './KittyTransferDistanceCalculator';

const web3 = new Web3('wss://mainnet.infura.io/ws');

const CRYPTO_KITTY_ADDRESS = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

const erc721: ERC721 = new web3.eth.Contract(ERC721_ABI as any, CRYPTO_KITTY_ADDRESS);

(async function run() {
  const calculator = new KittyTransferDistanceCalculator(undefined, undefined, erc721, web3);

  const transactionHash = process.argv[2];

  console.log(
    `Checking how much CO2 kitty transfer in transaction hash ${transactionHash} consumed...`
  );

  try {
    const consumedCO2 = await calculator.calculateTransferCO2Consumed(transactionHash);

    console.log(`CryptoKitty transfer consumed ${consumedCO2} tonnes of CO2!`);
    process.exit(0);
  } catch (error) {
    console.error(
      'There was error when processing your request. Make sure transaction hash is correct and contains a valid transfer!'
    );
  }

  process.exit(1);
})();
