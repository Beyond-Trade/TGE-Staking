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
							{value} {token}
						</h1>
						<h1>
							{value_r} {token_r}
						</h1>
						<p>{}</p>
						<p>{alloted} Alloted</p>
						<p>{allowedForXCoins} Total</p>
						<div className='button'>
							<Link to={link}>
								<span>Stake</span>
							</Link>
						</div>
					</>
				)}
			</div>
		</Fragment>
	)
}
