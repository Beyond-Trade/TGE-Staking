import React, { Fragment } from 'react'

import { Link } from 'react-router-dom'

import './Card.scss'

export const Card = ({ token, value, token_image, total_staked, link, children }) => {
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
						<p>{total_staked} Staked</p>
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
