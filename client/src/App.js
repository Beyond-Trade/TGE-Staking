import logo from './logo.svg'
import './App.css'

import BYN from './contracts/BYN.json'

import Web3 from 'web3'

import React from 'react'

class App extends React.Component {
	state = { owner: '' }
	componentWillMount() {
		const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

		web3.eth.getAccounts().then((data) => {
			this.setState({ owner: data[0] })
			console.log(data[0])
		})
	}

	render() {
		return (
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />
					<p>
						Edit <code>src/App.js</code> and save to reload.
					</p>
					<a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
						Learn React
					</a>
				</header>
			</div>
		)
	}
}

export default App
