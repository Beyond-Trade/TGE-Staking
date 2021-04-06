import React, { Fragment } from 'react'

import { Link } from 'react-router-dom'

import './Card.scss'
//
export const Card = ({ token, token_r, value, value_r, token_image, total_staked, link, allowedReward, alloted, allowedForXCoins, children }) => {
	return (
		<Fragment>
			<div className='card'>
				{children ? (
					children
				) : (
					<>
						<img src={token_image} alt='' />
						<h1>
							{/* {value} */}
							{token}
						</h1>
						{/* <h1>
							{value_r} {token_r}
						</h1> */}
						<h2>Total Reward: {allowedReward}</h2>
						<h2>Alloted Tokens: {alloted}</h2>
						{/* <p>{allowedForXCoins} Total</p> */}
						<Link to={link}>
							<div className='button'>
								<span>Stake</span>
							</div>
						</Link>
					</>
				)}
			</div>
		</Fragment>
	)
}
