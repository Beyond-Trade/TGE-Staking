// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Staking {
	uint256 oneDay = 24 * 60 * 60;

	struct Transaction {
		uint256 addedOn;
		uint256 amount;
	}

	struct UserData {
		bool allowed;
		bool created;
		uint256 level1Tokens;
		uint256 level2Tokens;
		uint256 level3Tokens;
		uint256 level1Reward;
		uint256 level2Reward;
		uint256 level3Reward;
		//
		//
		uint256 tokens;
		uint256 lastUpdateDate;
		Transaction[] transactions;
	}

	mapping(address => UserData) users;

	StakingFactory factory;
	IERC20 rewardsToken;
	IERC20 stakingToken;

	function deposit(uint256 amount) public {
		// 		require(users[msg.sender].allowed);
		// TODO:add fix for update only if success and succeds.
		factory.updateLevel(amount);
		uint256 level = factory.level();
		if (level == 1) {
			users[msg.sender].level1Tokens += amount;
			stakingToken.transferFrom(msg.sender, address(this), amount);
		} else if (level == 2) {
			users[msg.sender].level2Tokens += amount;
			stakingToken.transferFrom(msg.sender, address(this), amount);
		} else if (level == 3) {
			users[msg.sender].level3Tokens += amount;
			stakingToken.transferFrom(msg.sender, address(this), amount);
		} else {
			users[msg.sender].tokens += amount;
			users[msg.sender].transactions.push(Transaction(block.timestamp, amount));
		}
		users[msg.sender].lastUpdateDate = block.timestamp;
		factory.updateTokens(amount);
	}

	function calculateReward() public returns (UserData memory user) {
		if (users[msg.sender].level1Tokens != 0) {
			if (block.timestamp > factory.startTime() + 30 * oneDay) {
				users[msg.sender].level1Reward = ((8219 * users[msg.sender].level1Tokens)) / 10000;
			}
		}
		if (users[msg.sender].level2Tokens != 0) {
			if (block.timestamp > factory.startTime() + 30 * oneDay) {
				users[msg.sender].level2Reward = ((3082 * users[msg.sender].level2Tokens)) / 10000;
			}
		}
		if (users[msg.sender].level3Tokens != 0) {
			if (block.timestamp > factory.startTime() + 45 * oneDay) {
				users[msg.sender].level3Reward = ((2613 * users[msg.sender].level3Tokens)) / 10000;
			}
		} else {
			if (block.timestamp > factory.startTime() + 60 * oneDay) {
				// for (uint256 index = 0; index < users[msg.sender].transactions.length; index++) {
				// 	users[]
				// }
				// users[msg.sender].level3Reward = ((2613 * users[msg.sender].level3Tokens)) / 10000;
			}
		}
		return users[msg.sender];
	}

	function withdraw(uint256 level) public {
		if (level == 1 && users[msg.sender].level1Tokens != 0) {
			if (block.timestamp > factory.startTime() + 30 * oneDay) {
				rewardsToken.transferFrom(
					address(this),
					msg.sender,
					users[msg.sender].level1Tokens + ((8219 * users[msg.sender].level1Tokens)) / 10000
				);
			}
		}
		if (level == 2 && users[msg.sender].level2Tokens != 0) {
			if (block.timestamp > factory.startTime() + 30 * oneDay) {
				rewardsToken.transferFrom(
					address(this),
					msg.sender,
					users[msg.sender].level2Tokens + ((3082 * users[msg.sender].level2Tokens)) / 10000
				);
			}
		}
		if (level == 3 && users[msg.sender].level3Tokens != 0) {
			if (block.timestamp > factory.startTime() + 30 * oneDay) {
				rewardsToken.transferFrom(
					address(this),
					msg.sender,
					users[msg.sender].level3Tokens + ((2613 * users[msg.sender].level3Tokens)) / 10000
				);
			}
		}
	}

	constructor(
		address _factory,
		address _rewardsToken,
		address _stakingToken
	) {
		factory = StakingFactory(_factory);
		rewardsToken = IERC20(_rewardsToken);
		stakingToken = IERC20(_stakingToken);
	}
}

contract StakingFactory is Ownable {
	IERC20 rewardsToken;
	uint256 public startTime;
	uint256 public level;
	address[] public stakingTokens;

	struct StakingRewardsInfo {
		address stakingRewards;
		uint256 rewardAmount;
	}

	// rewards info by staking token
	mapping(address => StakingRewardsInfo) public stakingRewardsInfoByStakingToken;

	struct LevelData {
		uint256 allowedForXCoins;
		uint256 rewardPercentTimes100;
		uint256 lockedDuration;
		uint256 allowedReward;
		uint256 alloted;
	}

	mapping(uint256 => LevelData) public levels;

	function createLevels() internal onlyOwner {
		levels[1] = LevelData(300000, 8219, 30, 246575, 0);
		levels[2] = LevelData(900000, 3082, 45, 184932, 0);
		levels[3] = LevelData(1900000, 2630, 60, 263014, 0);
		levels[4] = LevelData(2900000, 416, 60, 41000, 0);

		level = 1;
	}

	function updateLevel(uint256 tokenValue) public {
		if (levels[level].alloted + tokenValue >= levels[level].allowedForXCoins) {
			level += 1;
		}
	}

	function updateTokens(uint256 tokenValue) public {
		levels[level].alloted += tokenValue;
	}

	constructor(address _rewardsToken, uint256 _startTime) {
		rewardsToken = IERC20(_rewardsToken);
		startTime = _startTime;
		level = 1;
		createLevels();
	}

	function deploy(address stakingToken, uint256 rewardAmount) public onlyOwner {
		StakingRewardsInfo storage info = stakingRewardsInfoByStakingToken[stakingToken];
		require(info.stakingRewards == address(0), 'StakingRewardsFactory::deploy: already deployed');

		info.stakingRewards = address(new Staking(address(this), address(rewardsToken), stakingToken));
		info.rewardAmount = rewardAmount;
		stakingTokens.push(stakingToken);
	}
}