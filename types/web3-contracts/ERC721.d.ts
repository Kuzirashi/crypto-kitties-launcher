/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractOptions, Options } from 'web3-eth-contract';
import { Block } from 'web3-eth';
import { EventLog } from 'web3-core';
import { EventEmitter } from 'events';
import { Callback, TransactionObject } from './types';

export class ERC721 extends Contract {
  constructor(jsonInterface: any[], address?: string, options?: ContractOptions);
  methods: {
    supportsInterface(_interfaceID: string | number[]): TransactionObject<boolean>;

    ownerOf(_tokenId: number | string): TransactionObject<string>;

    balanceOf(_owner: string): TransactionObject<string>;

    approve(_to: string, _tokenId: number | string): TransactionObject<void>;

    transferFrom(_from: string, _to: string, _tokenId: number | string): TransactionObject<void>;

    transfer(_to: string, _tokenId: number | string): TransactionObject<void>;

    totalSupply(): TransactionObject<string>;
  };
  events: {
    Transfer(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    Approval(
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ): EventEmitter;

    allEvents: (
      options?: {
        filter?: object;
        fromBlock?: number | string;
        topics?: (null | string)[];
      },
      cb?: Callback<EventLog>
    ) => EventEmitter;
  };
}