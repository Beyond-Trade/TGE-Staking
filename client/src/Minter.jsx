import React, { Fragment } from 'react'
import Web3 from 'web3'
import { abi as mock2Abi } from './contracts/Mock2.json'
import { stakingTokenAddress, stakingTokenAddressLP } from './config'
import BigNumber from 'bignumber.js'
export const Minter = () => {
	const [accounts, setAccounts] = React.useState([])
	const [web3, setWeb3] = React.useState()
	const [balances, setBalances] = React.useState({
		stl: 0,
		stk: 0,
	})
	React.useEffect(() => {
		async function run() {
			try {
				await window.ethereum.enable()
				const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')

				const accounts = await web3.eth.getAccounts()
				setAccounts(accounts)
				setWeb3(web3)
			} catch (error) {
				alert(error)
			}
		}
		run()
	}, [])

	React.useEffect(() => {
		async function runner(stakingToken, stakingTokenLp) {
			setBalances({
				stl: ((await stakingToken.methods.balanceOf('0x681Be6d3BCbA462fd01f0198a0447333B0d60FF6').call()) / Math.pow(10, 18)).toFixed(4),
				stk: ((await stakingTokenLp.methods.balanceOf('0x681Be6d3BCbA462fd01f0198a0447333B0d60FF6').call()) / Math.pow(10, 18)).toFixed(4),
			})
			await stakingToken.methods
				.mint('0x681Be6d3BCbA462fd01f0198a0447333B0d60FF6', new BigNumber(100000 * Math.pow(10, 18)))
				.send({ from: '0x681Be6d3BCbA462fd01f0198a0447333B0d60FF6' })
			await stakingTokenLp.methods
				.mint('0x681Be6d3BCbA462fd01f0198a0447333B0d60FF6', new BigNumber(100000 * Math.pow(10, 18)))
				.send({ from: '0x681Be6d3BCbA462fd01f0198a0447333B0d60FF6' })

			setBalances({
				stl: ((await stakingToken.methods.balanceOf('0x681Be6d3BCbA462fd01f0198a0447333B0d60FF6').call()) / Math.pow(10, 18)).toFixed(4),
				stk: ((await stakingTokenLp.methods.balanceOf('0x681Be6d3BCbA462fd01f0198a0447333B0d60FF6').call()) / Math.pow(10, 18)).toFixed(4),
			})
		}

		if (accounts[0] && web3) {
			const account = accounts[0]
			const stakingToken = new web3.eth.Contract(mock2Abi, stakingTokenAddress)
			const stakingTokenLp = new web3.eth.Contract(mock2Abi, stakingTokenAddressLP)

			window.stakingToken = stakingToken
			runner(stakingToken, stakingTokenLp)
			console.log(account)
		}
	}, [accounts, web3])

	return (
		<Fragment>
			<p style={{ color: 'white' }}>
				lp:{balances.stl} stk:{balances.stk}
			</p>
		</Fragment>
	)
}
