import { assert } from 'chai';
import {
  KittyTransferDistanceCalculator,
  DEFAULT_SIGNIFICANT_DIGITS,
  DEFAULT_GAS_CONSUMPTION
} from '../../src/KittyTransferDistanceCalculator';
import Web3 from 'web3';
import { ERC721 } from '../../types/web3-contracts/ERC721';
import ERC721_ABI from '../../src/abi/ERC721.json';

describe('KittyTransferDistanceCalculator Unit Tests', async () => {
  const web3 = new Web3('wss://mainnet.infura.io/ws');

  const CRYPTO_KITTY_ADDRESS = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

  const erc721: ERC721 = new web3.eth.Contract(ERC721_ABI as any, CRYPTO_KITTY_ADDRESS);
  const calculator = new KittyTransferDistanceCalculator(
    DEFAULT_SIGNIFICANT_DIGITS,
    DEFAULT_GAS_CONSUMPTION,
    erc721,
    web3
  );

  describe('calculateAddressesDistance()', () => {
    it('returns correct distance', async () => {
      const EXAMPLE_ADDRESS_ONE = '0x000000000000000000000000000000987654321b';
      const EXAMPLE_ADDRESS_TWO = '0x000000000000000000000000000000123456789a';
      const EXPECTED_DISTANCE = 576632764801;

      const distance = calculator.calculateAddressesDistance(
        EXAMPLE_ADDRESS_ONE,
        EXAMPLE_ADDRESS_TWO
      );

      assert.equal(distance, EXPECTED_DISTANCE);
    });

    it(`returns correct distance while taking into account only significant ${DEFAULT_SIGNIFICANT_DIGITS} digits`, async () => {
      const EXAMPLE_ADDRESS_ONE = '0x000000000000000000000000000011987654321b';
      const EXAMPLE_ADDRESS_TWO = '0x000000000000000000000000000000123456789a';
      const EXPECTED_DISTANCE = 576632764801;

      const distance = calculator.calculateAddressesDistance(
        EXAMPLE_ADDRESS_ONE,
        EXAMPLE_ADDRESS_TWO
      );

      assert.equal(distance, EXPECTED_DISTANCE);
    });

    it('returns correct distance for 12 significant digits', async () => {
      const EXAMPLE_ADDRESS_ONE = '0x000000000000000000000000000012987654321b';
      const EXAMPLE_ADDRESS_TWO = '0x000000000000000000000000000007123456789a';
      const EXPECTED_DISTANCE = 12671260670337;

      calculator.significantDigits = 12;

      const distance = calculator.calculateAddressesDistance(
        EXAMPLE_ADDRESS_ONE,
        EXAMPLE_ADDRESS_TWO
      );

      assert.equal(distance, EXPECTED_DISTANCE);

      calculator.significantDigits = 10;
    });

    it('returns correct distance when one of the addresses is 0x0', async () => {
      const EXAMPLE_ADDRESS_ONE = '0x000000000000000000000000000000987654321b';
      const EXAMPLE_ADDRESS_TWO = '0x0';
      const EXPECTED_DISTANCE = 654820258331;

      const distance = calculator.calculateAddressesDistance(
        EXAMPLE_ADDRESS_ONE,
        EXAMPLE_ADDRESS_TWO
      );

      assert.equal(distance, EXPECTED_DISTANCE);
    });
  });

  describe('calculateTransferDistance()', () => {
    it('returns correct distance for mainnet transfer', async () => {
      const EXAMPLE_TRANSFER_TRANSACTION_HASH =
        '0xabd7519a47d9ba52b5fde557d11d5dfda13572fc70bedd6710060cf137e24f15';
      const EXPECTED_DISTANCE = 56345312728; // Abs(865810512246 - 922155824974)

      const distance = await calculator.calculateTransferDistance(
        EXAMPLE_TRANSFER_TRANSACTION_HASH
      );

      assert.equal(distance, EXPECTED_DISTANCE);
    });

    it('returns correct distance for mainnet transfer when kitty has been created', async () => {
      const EXAMPLE_TRANSFER_TRANSACTION_HASH =
        '0xaaa2ade286d4e2a8382c352858a96134d1b3bab1af0237697a95128692a71920';
      const EXPECTED_DISTANCE = 708818119985;

      const distance = await calculator.calculateTransferDistance(
        EXAMPLE_TRANSFER_TRANSACTION_HASH
      );

      assert.equal(distance, EXPECTED_DISTANCE);
    });
  });

  describe('calculateDistanceCO2Consumed()', () => {
    it('returns correct CO2 consumption', async () => {
      const TEST_SETS = [
        [576632764801, 57663.2764801],
        [708818119985, 70881.81199850001],
        [12671260670337, 1267126.0670337]
      ];

      TEST_SETS.forEach(([EXAMPLE_DISTANCE, EXPECTED_CONSUMPTION]) => {
        const distance = calculator.calculateDistanceCO2Consumed(EXAMPLE_DISTANCE);

        assert.equal(distance, EXPECTED_CONSUMPTION);
      });
    });
  });

  describe('calculateTransferCO2Consumed()', () => {
    it('calls calculateDistanceCO2Consumed()', async () => {
      let called = false;

      const EXAMPLE_TRANSFER_TRANSACTION_HASH =
        '0xaaa2ade286d4e2a8382c352858a96134d1b3bab1af0237697a95128692a71920';

      calculator.calculateDistanceCO2Consumed = (() => {
        called = true;
      }) as any;

      await calculator.calculateTransferCO2Consumed(EXAMPLE_TRANSFER_TRANSACTION_HASH);

      assert.equal(called, true);
    });
  });
});
