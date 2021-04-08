// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
This is a Staking contract created for every token.
 */
contract Staking is Ownable {
	uint256 oneDay = 24 * 60 * 60;

	StakingFactory factory; // Contract which is creating this one.

	IERC20 rewardsToken; // Reward Token

	IERC20 stakingToken; // Staking Token

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
		uint256 withdrawable;
		//
		uint256 tokens;
		uint256 lastUpdateDate;
	}

	/**Level Data. TODO: move to library */
	struct LevelData {
		uint256 allowedForXCoins;
		uint256 rewardPercentTimes100;
		uint256 lockedDuration;
		uint256 allowedReward;
		uint256 alloted;
	}

	mapping(address => UserData) users;

	constructor(
		address _factory,
		address _rewardsToken,
		address _stakingToken
	) {
		factory = StakingFactory(_factory);
		rewardsToken = IERC20(_rewardsToken);
		stakingToken = IERC20(_stakingToken);
	}

	function checkUpdateLevel(uint256 amount, uint256 level) internal view returns (uint256, uint256) {
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
	function deposit(uint256 amount) external {
		// Check if level has been updated due to time elapsed.

		factory.updateLevelCheck();
		// Fetch the level.
		uint256 remaining;
		uint256 level = factory.level();
		// Check if the amount updates the level and only deposit the amount which just updates
		// and update the level. Return rest of the staking token to the user.
		if (level == 1) {
			(amount, remaining) = checkUpdateLevel(amount, level);
			stakingToken.transferFrom(msg.sender, address(this), amount);
			users[msg.sender].level1Tokens += amount;
			users[msg.sender].tokens += amount;
			factory.updateTokens(amount);
			level = factory.level();
			amount = remaining;
		}
		if (level == 2) {
			(amount, remaining) = checkUpdateLevel(amount, level);
			stakingToken.transferFrom(msg.sender, address(this), amount);
			users[msg.sender].level2Tokens += amount;
			users[msg.sender].tokens += amount;
			factory.updateTokens(amount);

			level = factory.level();
			amount = remaining;
		}
		if (level == 3) {
			(amount, remaining) = checkUpdateLevel(amount, level);
			stakingToken.transferFrom(msg.sender, address(this), amount);
			users[msg.sender].level3Tokens += amount;
			users[msg.sender].tokens += amount;
			factory.updateTokens(amount);

			level = factory.level();
			amount = remaining;
		}
		// if (level == 4) {
		// 	(amount, remaining) = checkUpdateLevel(amount, level);
		// 	users[msg.sender].level4Tokens += amount;
		// 	stakingToken.transferFrom(msg.sender, address(this), amount);
		// 	factory.updateTokens(amount);

		// 	level = factory.level();
		// 	amount = remaining;
		// }

		users[msg.sender].lastUpdateDate = block.timestamp;
	}

	function calculateReward() public view returns (UserData memory user) {
		UserData memory userDetails = users[msg.sender];
		//
		if (userDetails.level1Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(1);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				userDetails.level1Reward = ((_rewardPercentTimes100 * userDetails.level1Tokens)) / 10000;
			}
		}
		if (userDetails.level2Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(2);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				userDetails.level2Reward = ((_rewardPercentTimes100 * userDetails.level2Tokens)) / 10000;
			}
		}
		if (userDetails.level3Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(3);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				userDetails.level3Reward = ((_rewardPercentTimes100 * userDetails.level3Tokens)) / 10000;
			}
		}
		// if (userDetails.level4Tokens != 0) {
		// 	(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
		// 		factory.levels(4);
		// 	if (block.timestamp > users[msg.sender].lastUpdateDate + _lockedDuration * oneDay) {
		// 		userDetails.level4Reward = ((_rewardPercentTimes100 * userDetails.level4Tokens)) / 10000;
		// 	}
		// }
		return userDetails;
	}

	// Withdraw.
	function withdraw(uint256 level) external {
		if (level == 1 && users[msg.sender].level1Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(1);

			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				uint256 rewardValue = users[msg.sender].level1Tokens + (((_rewardPercentTimes100 * users[msg.sender].level1Tokens)) / 10000);
				rewardsToken.transfer(msg.sender, rewardValue);
				users[msg.sender].level1Tokens = 0;
				users[msg.sender].level1Reward = 0;
				return;
			}
		} else if (level == 2 && users[msg.sender].level2Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(2);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				uint256 rewardValue = users[msg.sender].level2Tokens + (((_rewardPercentTimes100 * users[msg.sender].level2Tokens)) / 10000);
				rewardsToken.transfer(msg.sender, rewardValue);
				users[msg.sender].level2Tokens = 0;
				users[msg.sender].level2Reward = 0;
				return;
			}
		} else if (level == 3 && users[msg.sender].level3Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(3);
			if (block.timestamp > users[msg.sender].lastUpdateDate + _lockedDuration * oneDay) {
				uint256 rewardValue = users[msg.sender].level3Tokens + (((_rewardPercentTimes100 * users[msg.sender].level3Tokens)) / 10000);
				rewardsToken.transfer(msg.sender, rewardValue);
				users[msg.sender].level3Tokens = 0;
				users[msg.sender].level3Reward = 0;
				return;
			}
		}
		//  else if (level == 4 && users[msg.sender].level4Tokens != 0) {
		// 	(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
		// 		factory.levels(4);
		// 	if (block.timestamp > users[msg.sender].lastUpdateDate + _lockedDuration * oneDay) {
		// 		uint256 rewardValue = users[msg.sender].level4Tokens + (((_rewardPercentTimes100 * users[msg.sender].level4Tokens)) / 10000);
		// 		rewardsToken.transfer(msg.sender, rewardValue);
		// 		users[msg.sender].level4Tokens = 0;
		// 		users[msg.sender].level4Reward = 0;
		// 		return;
		// 	}
		// }
		require(false, 'Cannot withdraw');
	}

	function withdrawByAmount(uint256 amount) external {
		require(amount != 0);

		if (users[msg.sender].level1Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(1);

			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				uint256 rewardValue = users[msg.sender].level1Tokens + (((_rewardPercentTimes100 * users[msg.sender].level1Tokens)) / 10000);
				users[msg.sender].withdrawable += rewardValue;
				users[msg.sender].level1Tokens = 0;
				users[msg.sender].level1Reward = 0;
			}
		}
		if (users[msg.sender].level2Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(2);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				uint256 rewardValue = users[msg.sender].level2Tokens + (((_rewardPercentTimes100 * users[msg.sender].level2Tokens)) / 10000);
				users[msg.sender].withdrawable += rewardValue;
				users[msg.sender].level2Tokens = 0;
				users[msg.sender].level2Reward = 0;
			}
		}
		if (users[msg.sender].level3Tokens != 0) {
			(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
				factory.levels(3);
			if (block.timestamp > factory.startTime() + _lockedDuration * oneDay) {
				uint256 rewardValue = users[msg.sender].level3Tokens + (((_rewardPercentTimes100 * users[msg.sender].level3Tokens)) / 10000);
				users[msg.sender].withdrawable += rewardValue;
				users[msg.sender].level3Tokens = 0;
				users[msg.sender].level3Reward = 0;
			}
		}
		// if (users[msg.sender].level4Tokens != 0) {
		// 	(uint256 allowedForXCoins, uint256 _rewardPercentTimes100, uint256 _lockedDuration, uint256 _allowedReward, uint256 alloted) =
		// 		factory.levels(4);
		// 	if (block.timestamp > users[msg.sender].lastUpdateDate + _lockedDuration * oneDay) {
		// 		uint256 rewardValue = users[msg.sender].level4Tokens + (((_rewardPercentTimes100 * users[msg.sender].level4Tokens)) / 10000);
		// 		users[msg.sender].withdrawable += rewardValue;
		// 		users[msg.sender].level4Tokens = 0;
		// 		users[msg.sender].level4Reward = 0;
		// 	}
		// }

		require(amount <= users[msg.sender].withdrawable, 'Requested amount more than reward.');
		rewardsToken.transfer(msg.sender, amount);
		users[msg.sender].withdrawable = users[msg.sender].withdrawable - amount;
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

	// LevelData
	struct LevelData {
		uint256 allowedForXCoins;
		uint256 rewardPercentTimes100;
		uint256 lockedDuration;
		uint256 allowedReward;
		uint256 alloted;
	}

	address public stakingContractAddress;
	// rewards info by staking token
	mapping(address => StakingRewardsInfo) public stakingRewardsInfoByStakingToken;

	mapping(uint256 => LevelData) public levels;

	constructor(address _rewardsToken, uint256 _startTime) {
		rewardsToken = IERC20(_rewardsToken);
		startTime = _startTime;
		level = 1;
		createLevels();
	}

	// THis fucntion creates the Staking reward.
	function deploy(address stakingToken, uint256 rewardAmount) public onlyOwner {
		StakingRewardsInfo storage info = stakingRewardsInfoByStakingToken[stakingToken];
		require(info.stakingRewards == address(0), 'StakingRewardsFactory::deploy: already deployed');

		info.stakingRewards = address(new Staking(address(this), address(rewardsToken), stakingToken));

		stakingContractAddress = info.stakingRewards;

		rewardsToken.transferFrom(msg.sender, info.stakingRewards, rewardAmount);
		info.rewardAmount = rewardAmount;
		stakingTokens.push(stakingToken);
	}

	// Create Levels
	// Or create an array and provide user access to create them.
	function createLevels() internal {
		levels[1] = LevelData(100000 ether, 4900, 15, 49315 ether, 0);
		levels[2] = LevelData(400000 ether, 4100, 30, 123288 ether, 0);
		levels[3] = LevelData(800000 ether, 4300, 45, 172603 ether, 0);
		// levels[4] = LevelData(1500000, 3300, 60, 230137, 0);

		level = 1;
	}

	modifier restricted() {
		require(msg.sender == stakingContractAddress, 'Sender has to be a staking contract.');
		_;
	}

	function updateTokens(uint256 tokenValue) external restricted {
		levels[level].alloted += tokenValue;
		// if (level == 4) {
		if (level == 3) {
			return;
		}
		if (levels[level].alloted >= levels[level].allowedForXCoins) {
			level += 1;
		}
	}

	function updateLevelCheck() external {
		// Stop accepting entries in level 1,2 after one day.
		// Level 1,2 offer is only for one day.
		if (block.timestamp > startTime + 60 * 24 * 60) {
			// level = 4;
			level = 3;
		}
	}
}
