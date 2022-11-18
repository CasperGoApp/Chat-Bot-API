const casperClientSDK = require('casper-js-sdk') // import casper-js-sdk
const {
  Keys,
  CasperClient,
  CLPublicKey,
  DeployUtil,
  CLValueBuilder,
  RuntimeArgs,
} = require('casper-js-sdk')
const { ERC20Client, constants } = require('casper-erc20-js-client')
const bip39 = require('bip39')

module.exports = {
  casperClientSDK,
  Keys,
  CasperClient,
  CLPublicKey,
  DeployUtil,
  CLValueBuilder,
  RuntimeArgs,
  ERC20Client,
  constants,
  bip39,
  Buffer: require('buffer/').Buffer,
}
