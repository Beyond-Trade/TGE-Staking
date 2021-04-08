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
						<div className='token'>
							<p>{token}</p>
						</div>

						<h2>
							Total Reward:
							<span className='consolas text-inner'>{(allowedReward / Math.pow(10, 18)).toFixed(4)}</span>
						</h2>
						<h2>
							Alloted Tokens:
							<span className='consolas text-inner'>{(alloted / Math.pow(10, 18), 4).toFixed(4)}</span>
						</h2>

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
