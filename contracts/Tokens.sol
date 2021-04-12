// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Mock is ERC20 {
	constructor(string memory name, string memory symbol) payable ERC20(name, symbol) {
		mint(msg.sender, 100000000 ether);
		increaseAllowance(msg.sender, 100000000 ether);
		approve(msg.sender, 100000000 ether);
	}

	function mint(address account, uint256 amount) public {
		_mint(account, amount);
	}

	function burn(address account, uint256 amount) public {
		_burn(account, amount);
	}

	function transferInternal(
		address from,
		address to,
		uint256 value
	) public {
		_transfer(from, to, value);
	}

	function approveInternal(
		address owner,
		address spender,
		uint256 value
	) public {
		_approve(owner, spender, value);
	}
}

contract Mock2 is ERC20 {
	constructor(string memory name, string memory symbol) payable ERC20(name, symbol) {
		mint(msg.sender, 100000000 ether);
		increaseAllowance(msg.sender, 100000000 ether);
		approve(msg.sender, 100000000 ether);
	}

	function mint(address account, uint256 amount) public {
		_mint(account, amount);
	}

	function burn(address account, uint256 amount) public {
		_burn(account, amount);
	}

	function increaseAllowanceInternal(address spender, uint256 addedValue) public {
		increaseAllowance(spender, addedValue);
	}

	function transferInternal(
		address from,
		address to,
		uint256 value
	) public {
		_transfer(from, to, value);
	}

	function approveInternal(
		address owner,
		address spender,
		uint256 value
	) public {
		_approve(owner, spender, value);
	}
}
