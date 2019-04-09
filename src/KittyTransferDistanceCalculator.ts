import Web3 from 'web3';
import { ERC721 } from '../types/web3-contracts/ERC721';

export const DEFAULT_SIGNIFICANT_DIGITS = 10;
export const DEFAULT_GAS_CONSUMPTION = 0.0001;

export class KittyTransferDistanceCalculator {
  public significantDigits: number;
  public gasConsumptionInTonesPerKm: number;

  private web3: Web3;
  private contract: ERC721;

  constructor(
    significantDigits: number = DEFAULT_SIGNIFICANT_DIGITS,
    gasConsumptionInTonesPerKm = DEFAULT_GAS_CONSUMPTION,
    contract?: ERC721,
    web3?: Web3
  ) {
    this.significantDigits = significantDigits;
    this.gasConsumptionInTonesPerKm = gasConsumptionInTonesPerKm;
    this.contract = contract;
    this.web3 = web3;
  }

  public async calculateTransferCO2Consumed(transactionHash: string): Promise<number> {
    const distance = await this.calculateTransferDistance(transactionHash);

    return this.calculateDistanceCO2Consumed(distance);
  }

  public async calculateTransferDistance(transactionHash: string): Promise<number> {
    const transferEvent = this.contract.jsonInterface.getEvent('Transfer');

    if (!transferEvent) {
      throw new Error(`Transfer event not found.`);
    }

    const receipt = await this.web3.eth.getTransactionReceipt(transactionHash);

    let transferLog;

    for (const log of receipt.logs) {
      if (log.topics[0] === transferEvent.signature) {
        transferLog = this.web3.eth.abi.decodeLog(transferEvent.getInputs(), log.data, []);
        break;
      }
    }

    if (!transferLog) {
      throw new Error(`Transfer log hasn't been found.`);
    }

    return this.calculateAddressesDistance(transferLog.from, transferLog.to);
  }

  public calculateAddressesDistance(addressOne: string, addressTwo: string): number {
    if (!addressOne || !addressTwo) {
      throw new Error('Invalid arguments.');
    }

    const addressOneSignificantDigits = this.getLastDigits(addressOne, this.significantDigits);
    const addressTwoSignificantDigits = this.getLastDigits(addressTwo, this.significantDigits);

    return this.calculateDecDifferenceBetweenHexValues(
      addressOneSignificantDigits,
      addressTwoSignificantDigits
    );
  }

  public calculateDistanceCO2Consumed(distance: number) {
    return (distance / 1000) * this.gasConsumptionInTonesPerKm;
  }

  private getLastDigits(text: string, amount: number): string {
    return text.slice(text.length - amount, text.length);
  }

  private calculateDecDifferenceBetweenHexValues(
    hexStringOne: string,
    hexStringTwo: string
  ): number {
    return Math.abs(parseInt(hexStringOne, 16) - parseInt(hexStringTwo, 16));
  }
}
