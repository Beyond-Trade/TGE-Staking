#

### There are two major contracts in contracts/BYN.sol

-   Staking
-   StakingFactory

The StakingFactory receives a rewardToken and deploys a Staking contract for each Staking token in which the currency is staked.

## Running Instructions

Run `truffle migrate`.

Copy the contract addresses into the `client/src/config.js`

`cd client`

`yarn start`

## Contract

[Documentation]('contracts/README.md')
