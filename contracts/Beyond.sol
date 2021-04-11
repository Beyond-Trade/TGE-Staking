/**
 *Submitted for verification at Etherscan.io on 2021-01-12
 */

// File: contracts\ERC20Basic.sol

pragma solidity ^0.8.0;

abstract contract ERC20Basic {
	function totalSupply() public view virtual returns (uint256);

	function balanceOf(address who) public view virtual returns (uint256);

	function transfer(address to, uint256 value) public virtual returns (bool);

	event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Ownable {
	address public owner;

	event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

	constructor(address _owner) public {
		owner = _owner;
	}

	modifier onlyOwner() {
		require(msg.sender == owner);
		_;
	}

	function transferOwnership(address newOwner) public onlyOwner {
		require(newOwner != address(0));
		emit OwnershipTransferred(owner, newOwner);
		owner = newOwner;
	}
}

library SafeMath {
	function mul(uint256 a, uint256 b) internal pure returns (uint256) {
		if (a == 0) {
			return 0;
		}
		uint256 c = a * b;
		assert(c / a == b);
		return c;
	}

	function div(uint256 a, uint256 b) internal pure returns (uint256) {
		// assert(b > 0); // Solidity automatically throws when dividing by 0
		uint256 c = a / b;
		// assert(a == b * c + a % b); // There is no case in which this doesn't hold
		return c;
	}

	function sub(uint256 a, uint256 b) internal pure returns (uint256) {
		assert(b <= a);
		return a - b;
	}

	function add(uint256 a, uint256 b) internal pure returns (uint256) {
		uint256 c = a + b;
		assert(c >= a);
		return c;
	}
}

contract BasicToken is ERC20Basic {
	using SafeMath for uint256;

	mapping(address => uint256) balances;

	uint256 public _totalSupply;

	function totalSupply() public view override returns (uint256) {
		return _totalSupply;
	}

	event Transfer(address indexed from, address indexed to, uint256 value);

	/**
	 * @dev transfer token for a specified address
	 * @param _to The address to transfer to.
	 * @param _value The amount to be transferred.
	 */

	function transfer(address _to, uint256 _value) public override returns (bool) {
		require(_to != address(0));
		require(_value <= balances[msg.sender]);

		// SafeMath.sub will throw if there is not enough balance.
		balances[msg.sender] = balances[msg.sender].sub(_value);
		balances[_to] = balances[_to].add(_value);
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	/**
	 * @dev Gets the balance of the specified address.
	 * @param _owner The address to query the the balance of.
	 * @return An uint256 representing the amount owned by the passed address.
	 */
	function balanceOf(address _owner) public view override returns (uint256 balance) {
		return balances[_owner];
	}
}

contract ERC20 is ERC20Basic {
	function allowance(address owner, address spender) public view returns (uint256);

	function transferFrom(
		address from,
		address to,
		uint256 value
	) public returns (bool);

	function approve(address spender, uint256 value) public returns (bool);

	event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract StandardToken is ERC20, BasicToken {
	mapping(address => mapping(address => uint256)) internal allowed;

	function transferFrom(
		address _from,
		address _to,
		uint256 _value
	) public returns (bool) {
		require(_to != address(0));
		require(_value <= balances[_from]);
		require(_value <= allowed[_from][msg.sender]);
		balances[_from] = balances[_from].sub(_value);
		balances[_to] = balances[_to].add(_value);
		allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

		emit Transfer(_from, _to, _value);
		return true;
	}

	function approve(address _spender, uint256 _value) public returns (bool) {
		require(_spender != address(0));
		allowed[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

	function allowance(address _owner, address _spender) public view returns (uint256) {
		return allowed[_owner][_spender];
	}

	function increaseApproval(address _spender, uint256 _addedValue) public returns (bool) {
		allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
		emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
		return true;
	}

	function decreaseApproval(address _spender, uint256 _subtractedValue) public returns (bool) {
		uint256 oldValue = allowed[msg.sender][_spender];
		if (_subtractedValue > oldValue) {
			allowed[msg.sender][_spender] = 0;
		} else {
			allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
		}
		emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
		return true;
	}
}

contract Pausable is Ownable {
	event Pause();
	event Unpause();

	bool public paused = false;

	modifier whenNotPaused() {
		require(!paused);
		_;
	}

	modifier whenPaused() {
		require(paused);
		_;
	}

	function pause() public onlyOwner whenNotPaused {
		paused = true;
		emit Pause();
	}

	function unpause() public onlyOwner whenPaused {
		paused = false;
		emit Unpause();
	}
}

contract Beyond is StandardToken, Ownable, Pausable {
	string public constant name = 'Beyond';
	string public constant symbol = 'BYN';
	uint8 public constant decimals = 18;

	uint256 public totalReleased;
	uint256 ethPrice; //rate: how many tokens to send against recieved value
	uint256 public weiRaised; // Amount of wei raised

	address payable wallet; // Address where funds are collected
	address public exchangeContract;
	address public rewardContract;

	bool public fundraising;

	mapping(address => Investor) public investorInfoByAddress;

	event Transfer(address indexed from, address indexed to, uint256 value);

	struct Investor {
		address investorAddress;
		uint256 investorTotalBalance;
		uint256 addTime;
		uint256 id;
	}

	modifier onlyContract {
		require(msg.sender == rewardContract || msg.sender == exchangeContract, 'Not Authorized address');
		_;
	}

	constructor(address payable _wallet, uint256 _ethPrice) public Ownable(msg.sender) {
		totalReleased = 0;
		_totalSupply = 0;
		wallet = _wallet;
		ethPrice = _ethPrice;

		mint(10000000 ether, msg.sender);
	}

	function buyTokens() public payable {
		uint256 weiAmount = msg.value;
		address _beneficiary = msg.sender;

		require(weiAmount > 0, 'Value is not greater than zero');

		require(ethPrice > 0, 'EthPrice is zero');

		uint256 tokens = (weiAmount.mul(ethPrice));

		weiRaised = weiRaised.add(weiAmount);

		investorInfoByAddress[_beneficiary].investorTotalBalance = investorInfoByAddress[_beneficiary].investorTotalBalance.add(tokens);

		mint(tokens, msg.sender);

		wallet.transfer(msg.value);
	}

	function balanceCheck(address _beneficiary) public view returns (uint256) {
		require(_beneficiary != address(0));
		return super.balanceOf(_beneficiary);
	}

	function mint(uint256 _value, address _beneficiary) internal returns (bool) {
		require(_value > 0);
		balances[_beneficiary] = balances[_beneficiary].add(_value);
		_totalSupply = _totalSupply.add(_value);

		emit Transfer(address(this), _beneficiary, _value);
	}

	function burn(uint256 _value, address _beneficiary) internal {
		require(balanceCheck(_beneficiary) >= _value, 'User does not have sufficient synths to burn');
		_totalSupply = _totalSupply.sub(_value);
		balances[_beneficiary] = balances[_beneficiary].sub(_value);

		emit Transfer(address(this), _beneficiary, _value);
	}

	function tokenValue() external view returns (uint256) {
		return ethPrice;
	}

	function rewardTransfer(uint256 _value, address _beneficiary) external onlyContract {
		// balances[_contract] = balances[_contract].sub(_value);
		balances[_beneficiary] = balances[_beneficiary].add(_value);
		_totalSupply = _totalSupply.add(_value);

		emit Transfer(address(this), _beneficiary, _value);
	}

	function staking(
		address _beneficiary,
		address _contract,
		uint256 _value
	) external onlyContract {
		balances[_beneficiary] = balances[_beneficiary].sub(_value);
		balances[_contract] = balances[_contract].add(_value);
		emit Transfer(_beneficiary, _contract, _value);
	}

	function unStaking(
		address _beneficiary,
		address _contract,
		uint256 _value
	) external onlyContract {
		balances[_contract] = balances[_contract].sub(_value);
		balances[_beneficiary] = balances[_beneficiary].add(_value);
		emit Transfer(_beneficiary, _contract, _value);
	}

	function calculateTokenAmount(uint256 _value) public view returns (uint256) {
		return ((_value.mul(ethPrice)).mul(1 ether));
	}

	function setBeyondExchangeAddressProx(address _address) public onlyOwner {
		exchangeContract = _address;
	}

	function setRewardContract(address _address) public onlyOwner {
		rewardContract = _address;
	}
}
