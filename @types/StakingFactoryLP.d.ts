/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { BigNumber } from 'bignumber.js'

export interface StakingFactoryLPContract extends Truffle.Contract<StakingFactoryLPInstance> {
	'new'(
		_rewardsToken: string | BigNumber,
		_startTime: number | BigNumber | string,
		meta?: Truffle.TransactionDetails
	): Promise<StakingFactoryLPInstance>
}

export interface OwnershipTransferred {
	name: 'OwnershipTransferred'
	args: {
		previousOwner: string
		newOwner: string
	}
}

type AllEvents = OwnershipTransferred

export interface StakingFactoryLPInstance extends Truffle.ContractInstance {
	level(txDetails?: Truffle.TransactionDetails): Promise<BigNumber>

	levels(
		arg0: number | BigNumber | string,
		txDetails?: Truffle.TransactionDetails
	): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>

	/**
	 * Returns the address of the current owner.
	 */
	owner(txDetails?: Truffle.TransactionDetails): Promise<string>

	/**
	 * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
	 */
	renounceOwnership: {
		(txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse<AllEvents>>
		call(txDetails?: Truffle.TransactionDetails): Promise<void>
		sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>
		estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>
	}

	stakingRewardsInfoByStakingToken(arg0: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<[string, BigNumber]>

	stakingTokens(arg0: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<string>

	startTime(txDetails?: Truffle.TransactionDetails): Promise<BigNumber>

	/**
	 * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
	 */
	transferOwnership: {
		(newOwner: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse<AllEvents>>
		call(newOwner: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<void>
		sendTransaction(newOwner: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<string>
		estimateGas(newOwner: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<number>
	}

	updateLevel: {
		(tokenValue: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse<AllEvents>>
		call(tokenValue: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<void>
		sendTransaction(tokenValue: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<string>
		estimateGas(tokenValue: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<number>
	}

	updateTokens: {
		(tokenValue: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse<AllEvents>>
		call(tokenValue: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<void>
		sendTransaction(tokenValue: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<string>
		estimateGas(tokenValue: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<number>
	}

	updateLevelCheck: {
		(txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse<AllEvents>>
		call(txDetails?: Truffle.TransactionDetails): Promise<void>
		sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>
		estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>
	}

	deploy: {
		(stakingToken: string | BigNumber, rewardAmount: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<
			Truffle.TransactionResponse<AllEvents>
		>
		call(stakingToken: string | BigNumber, rewardAmount: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<void>
		sendTransaction(
			stakingToken: string | BigNumber,
			rewardAmount: number | BigNumber | string,
			txDetails?: Truffle.TransactionDetails
		): Promise<string>
		estimateGas(
			stakingToken: string | BigNumber,
			rewardAmount: number | BigNumber | string,
			txDetails?: Truffle.TransactionDetails
		): Promise<number>
	}
}
