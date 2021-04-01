// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

import './Tokens.sol';

/**
This is a Staking contract created for every token.
 */
contract StakingLP is Ownable {
	uint256 oneDay = 2;

	struct Transaction {
		uint256 addedOn;
		uint256 amount;
	}
	/**
	User Data
	 */
	struct UserData {
		bool allowed;
		bool created;
		//
		uint256 level1Tokens;
		uint256 level2Tokens;
		uint256 level3Tokens;
		uint256 level4Tokens;
		//
		uint256 level1Reward;
		uint256 level2Reward;
		uint256 level3Reward;
		uint256 level4Reward;
		//
		//
		uint256 tokens;
		uint256 lastUpdateDate;
		Transaction[] transactions;
	}

	mapping(address => UserData) users;

	StakingFactoryLP factory; // Contract which is creating this one.

	Mock rewardsToken; // Reward Token

	IERC20 stakingToken; // Staking Token

	/**Level Data. TODO: move to library */
	struct LevelData {
		uint256 allowedForXCoins;
		uint256 rewardPercentTimes100;
		uint256 lockedDuration;
		uint256 allowedReward;
		uint256 alloted;
	}

	function checkUpdateLevel(uint256 amount, uint256 level) public returns (uint256, uint256) {
		uint256 remaining;
		(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
			factory.levels(level);

		if (alloted + amount >= allowedForXCoins) {
			remaining = amount - (allowedForXCoins - alloted);
			amount = allowedForXCoins - alloted;
		}
		return (amount, remaining);
	}

	/**deposit function */
	function deposit(uint256 amount) public {
		// Check if level has been updated due to time elapsed.
		uint256 level = factory.level();
		if (level == 3) {
			return;
		}
		factory.updateLevelCheck();
		// Fetch the level.
		uint256 remaining;
		// Check if the amount updates the level and only deposit the amount which just updates
		// and update the level. Return rest of the staking token to the user.
		if (level == 1) {
			(amount, remaining) = checkUpdateLevel(amount, level);
			users[msg.sender].level1Tokens += amount;
			stakingToken.transferFrom(msg.sender, address(this), amount);
			factory.updateLevel(amount);
			level = factory.level();
			amount = remaining;
		}
		if (level == 2) {
			(amount, remaining) = checkUpdateLevel(amount, level);
			users[msg.sender].level2Tokens += amount;
			stakingToken.transferFrom(msg.sender, address(this), amount);
			factory.updateLevel(amount);
			level = factory.level();
			amount = remaining;
		}
		if (level == 3) {
			return;
		}
		users[msg.sender].lastUpdateDate = block.timestamp;
		factory.updateTokens(amount);
	}

	// TODO: Make this dynamic.
	function calculateReward() public returns (UserData memory user) {
		if (users[msg.sender].level1Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(1);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				users[msg.sender].level1Reward = ((_rewardPercentTimes100 * users[msg.sender].level1Tokens)) / 10000;
			}
		}
		if (users[msg.sender].level2Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(2);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				users[msg.sender].level2Reward = ((_rewardPercentTimes100 * users[msg.sender].level2Tokens)) / 10000;
			}
		}
		return users[msg.sender];
	}

	// Withdraw.
	function withdraw(uint256 level) public {
		if (level == 1 && users[msg.sender].level1Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(1);

			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				uint256 rewardValue = users[msg.sender].level1Tokens + (((_rewardPercentTimes100 * users[msg.sender].level1Tokens)) / 10000);
				rewardsToken.approveInternal(address(this), msg.sender, rewardValue);
				rewardsToken.transferInternal(address(this), msg.sender, rewardValue);
				users[msg.sender].level1Tokens = 0;
				users[msg.sender].level1Reward = 0;
				return;
			}
		} else if (level == 2 && users[msg.sender].level2Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(2);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				uint256 rewardValue = users[msg.sender].level2Tokens + (((_rewardPercentTimes100 * users[msg.sender].level2Tokens)) / 10000);
				rewardsToken.approveInternal(address(this), msg.sender, rewardValue);
				rewardsToken.transferInternal(address(this), msg.sender, rewardValue);
				users[msg.sender].level2Tokens = 0;
				users[msg.sender].level2Reward = 0;
				return;
			}
		}
		require(false, 'Cannot withdraw');
	}

	constructor(
		address _factory,
		address _rewardsToken,
		address _stakingToken
	) {
		factory = StakingFactoryLP(_factory);
		rewardsToken = Mock(_rewardsToken);
		stakingToken = IERC20(_stakingToken);
	}
}

contract StakingFactoryLP is Ownable {
	Mock rewardsToken;
	uint256 public startTime;
	uint256 public level;
	address[] public stakingTokens;

	struct StakingRewardsInfo {
		address stakingRewards;
		uint256 rewardAmount;
	}

	// rewards info by staking token
	mapping(address => StakingRewardsInfo) public stakingRewardsInfoByStakingToken;

	// LevelData
	struct LevelData {
		uint256 allowedForXCoins;
		uint256 rewardPercentTimes100;
		uint256 lockedDuration;
		uint256 allowedReward;
		uint256 alloted;
	}

	mapping(uint256 => LevelData) public levels;

	// Create Levels
	// TODO: init in constructor?
	// Or create an array and provide user access to create them.
	function createLevels() internal onlyOwner {
		levels[1] = LevelData(300000, 9900, 30, 295890, 0);
		levels[2] = LevelData(200000, 4100, 30, 82192, 0);

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

	function updateLevelCheck() public {
		if (block.timestamp > startTime + 60 * 24 * 60) {
			level = 4;
		}
	}

	constructor(address _rewardsToken, uint256 _startTime) {
		rewardsToken = Mock(_rewardsToken);
		startTime = _startTime;
		level = 1;
		createLevels();
	}

	// THis fucntion creates the Staking reward.
	function deploy(address stakingToken, uint256 rewardAmount) public onlyOwner {
		StakingRewardsInfo storage info = stakingRewardsInfoByStakingToken[stakingToken];
		require(info.stakingRewards == address(0), 'StakingRewardsFactory::deploy: already deployed');
		info.stakingRewards = address(new StakingLP(address(this), address(rewardsToken), stakingToken));

		rewardsToken.approveInternal(msg.sender, info.stakingRewards, rewardAmount);
		rewardsToken.transferInternal(msg.sender, info.stakingRewards, rewardAmount);
		info.rewardAmount = rewardAmount;
		stakingTokens.push(stakingToken);
	}
}
