/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { BigNumber } from 'bignumber.js'

export interface AdminContract extends Truffle.Contract<AdminInstance> {
	'new'(meta?: Truffle.TransactionDetails): Promise<AdminInstance>
}

export interface Deposit {
	name: 'Deposit'
	args: {
		_sender: string
		amount: BigNumber
	}
}

export interface TokenBurn {
	name: 'TokenBurn'
	args: {
		from: string
		value: BigNumber
	}
}

export interface Transfer {
	name: 'Transfer'
	args: {
		from: string
		to: string
		value: BigNumber
	}
}

type AllEvents = Deposit | TokenBurn | Transfer

export interface AdminInstance extends Truffle.ContractInstance {
	allowedAddress(arg0: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<[boolean, BigNumber, BigNumber, BigNumber]>

	balanceOf(arg0: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<BigNumber>

	blockedAddress(arg0: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<boolean>

	decimals(txDetails?: Truffle.TransactionDetails): Promise<BigNumber>

	name(txDetails?: Truffle.TransactionDetails): Promise<string>

	owner(txDetails?: Truffle.TransactionDetails): Promise<string>

	symbol(txDetails?: Truffle.TransactionDetails): Promise<string>

	totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BigNumber>

	admin_tokenBurn: {
		(_value: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse<AllEvents>>
		call(_value: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<boolean>
		sendTransaction(_value: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<string>
		estimateGas(_value: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<number>
	}
}
