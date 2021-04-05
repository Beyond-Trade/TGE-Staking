import React, { Fragment } from 'react'
import { Card } from './Card'

import './Home.scss'

export const Home = () => {
	return (
		<Fragment>
			<div className='home'>
				<div className='outer'>
					<h1>BYN Staking</h1>
					<p>Exchange tokens</p>
					<div className='inner'>
						<Card
							token='TST'
							value='0.00000'
							token_image='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png'
							total_staked='XXX'
							link='/BYNStake'
						></Card>
						<Card
							token='TST'
							value='0.00000'
							token_image='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png'
							total_staked='XXX'
							link='/BYNStake?token=LP'
						></Card>
					</div>
				</div>
			</div>
		</Fragment>
	)
}
