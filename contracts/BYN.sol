pragma solidity ^0.5.17;

library SafeMath {
	function add(uint256 a, uint256 b) internal pure returns (uint256) {
		uint256 c = a + b;
		assert(c >= a);
		return c;
	}
}

contract Variable {
	string public name;
	string public symbol;
	uint256 public decimals;
	uint256 public totalSupply;
	address public owner;

	uint256 internal _decimals;
	bool internal transferLock;

	struct Transaction {
		uint256 addedOn;
		uint256 level;
		uint256 qty;
	}
	struct UserData {
		bool allowed;
		uint256 level1Tokens;
		uint256 level2Tokens;
		uint256 level3Tokens;
		Transaction[] transactions;
	}

	mapping(address => UserData) public allowedAddress;
	mapping(address => bool) public blockedAddress;

	mapping(address => uint256) public balanceOf;

	constructor() public {
		name = 'Beyond Finance';
		symbol = 'BYN';
		decimals = 18;
		_decimals = 10**uint256(decimals);
		totalSupply = _decimals * 100000000;
		transferLock = true;
		owner = msg.sender;
		balanceOf[owner] = totalSupply;
		allowedAddress[owner].allowed = true;
	}
}

contract Modifiers is Variable {
	modifier isOwner {
		assert(owner == msg.sender);
		_;
	}
}

contract Event {
	event Transfer(address indexed from, address indexed to, uint256 value);
	event TokenBurn(address indexed from, uint256 value);
	event Deposit(address _sender, uint256 amount);
}

contract manageAddress is Variable, Modifiers, Event {
	function add_allowedAddress(address _address) public isOwner {
		allowedAddress[_address].allowed = true;
	}

	function delete_allowedAddress(address _address) public isOwner {
		require(_address != owner);
		allowedAddress[_address].allowed = false;
	}

	function add_blockedAddress(address _address) public isOwner {
		require(_address != owner);
		blockedAddress[_address] = true;
	}

	function delete_blockedAddress(address _address) public isOwner {
		blockedAddress[_address] = false;
	}
}

contract Admin is Variable, Modifiers, Event {
	function admin_tokenBurn(uint256 _value) public isOwner returns (bool success) {
		require(balanceOf[msg.sender] >= _value);
		balanceOf[msg.sender] -= _value;
		totalSupply -= _value;
		emit TokenBurn(msg.sender, _value);
		return true;
	}
}

contract Get is Variable, Modifiers {
	function get_transferLock() public view returns (bool) {
		return transferLock;
	}

	function get_blockedAddress(address _address) public view returns (bool) {
		return blockedAddress[_address];
	}
}

contract Set is Variable, Modifiers, Event {
	function setTransferLock(bool _transferLock) public isOwner returns (bool success) {
		transferLock = _transferLock;
		return true;
	}
}

contract BYN is Variable, Event, Get, Set, Admin, manageAddress {
	using SafeMath for uint256;

	uint256 issuedTokens;
	struct LevelData {
		uint256 allowedForXCoins;
		uint256 rewardPercentTimes100;
		uint256 lockedDuration;
		uint256 allowedReward;
	}

	mapping(int256 => LevelData) levels;

	uint8 public level;

	constructor() public {
		name = 'Beyond Finance';
		symbol = 'BYN';
		decimals = 18;
		_decimals = 10**uint256(decimals);
		totalSupply = _decimals * 100000000;
		transferLock = true;
		owner = msg.sender;
		balanceOf[owner] = totalSupply;
		allowedAddress[owner].allowed = true;

		createLevels();
	}

	function createLevels() internal isOwner {
		levels[1] = LevelData(300000, 8219, 30, 246575);
		levels[2] = LevelData(600000, 3082, 45, 184932);
		levels[3] = LevelData(1000000, 2630, 60, 263014);

		level = 1;
	}

	function() external payable {
		emit Deposit(msg.sender, msg.value);
	}

	function withdraw() public isOwner {
		msg.sender.transfer(address(this).balance);
	}

	function getTokenForEth(uint256 weiValue) public pure returns (uint256 tokenValue) {
		return weiValue;
	}

	function addTokens() public payable {
		require(allowedAddress[msg.sender].allowed == true);
		require(!blockedAddress[msg.sender]);
		require(level <= 4 && level >= 1);

		require(msg.value > 0);

		uint256 tokenValue = getTokenForEth(msg.value);

		if (level == 1) {
			require(allowedAddress[msg.sender].level1Tokens == 0);
			if (issuedTokens + tokenValue > levels[level].allowedForXCoins) {
				allowedAddress[msg.sender].level1Tokens += levels[level].allowedForXCoins - issuedTokens;
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, levels[level].allowedForXCoins - issuedTokens));
				level += 1;
				allowedAddress[msg.sender].level2Tokens += tokenValue - (levels[level].allowedForXCoins - issuedTokens);
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, tokenValue - (levels[level].allowedForXCoins - issuedTokens)));

				balanceOf[msg.sender] += tokenValue;
				issuedTokens += tokenValue;
			} else {
				issuedTokens += tokenValue;
				allowedAddress[msg.sender].level1Tokens += tokenValue;
				balanceOf[msg.sender] += tokenValue;
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, tokenValue));
			}
		} else if (level == 2) {
			require(allowedAddress[msg.sender].level2Tokens == 0);
			if (issuedTokens + tokenValue > levels[level].allowedForXCoins) {
				allowedAddress[msg.sender].level2Tokens += levels[level].allowedForXCoins - issuedTokens;
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, levels[level].allowedForXCoins - issuedTokens));
				level += 1;
				allowedAddress[msg.sender].level3Tokens += tokenValue - (levels[level].allowedForXCoins - issuedTokens);
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, tokenValue - (levels[level].allowedForXCoins - issuedTokens)));

				balanceOf[msg.sender] += tokenValue;
				issuedTokens += tokenValue;
			} else {
				issuedTokens += tokenValue;
				allowedAddress[msg.sender].level2Tokens += tokenValue;
				balanceOf[msg.sender] += tokenValue;
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, tokenValue));
			}
		} else if (level == 3) {
			require(allowedAddress[msg.sender].level3Tokens == 0);
			if (issuedTokens + tokenValue > levels[level].allowedForXCoins) {
				allowedAddress[msg.sender].level3Tokens += levels[level].allowedForXCoins - issuedTokens;
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, levels[level].allowedForXCoins - issuedTokens));
				level += 1;

				balanceOf[msg.sender] += tokenValue;
				issuedTokens += tokenValue;
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, tokenValue - (levels[level].allowedForXCoins - issuedTokens)));
			} else {
				issuedTokens += tokenValue;
				allowedAddress[msg.sender].level3Tokens += tokenValue;
				balanceOf[msg.sender] += tokenValue;
				allowedAddress[msg.sender].transactions.push(Transaction(now, level, tokenValue));
			}
		} else {
			issuedTokens += tokenValue;
			balanceOf[msg.sender] += tokenValue;
			allowedAddress[msg.sender].transactions.push(Transaction(now, level, tokenValue));
		}
	}

	function transfer(address _to, uint256 _value) public {
		require(allowedAddress[msg.sender].allowed == true || transferLock == false);
		require(!blockedAddress[msg.sender] && !blockedAddress[_to]);
		require(balanceOf[msg.sender] >= _value && _value > 0);
		require((balanceOf[_to].add(_value)) >= balanceOf[_to]);

		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
	}
}
