const UniswapV2FactoryBytecode = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const UniswapV2RouterBytecode = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const Contract = require('@truffle/contract');
const UniswapV2Factory = Contract(UniswapV2FactoryBytecode);
const UniswapV2Router = Contract(UniswapV2RouterBytecode);
UniswapV2Factory.setProvider(web3.currentProvider);
UniswapV2Router.setProvider(web3.currentProvider);
const DaiERC20 = artifacts.require("Dai");
const zeroAddress = "0x0000000000000000000000000000000000000000";

contract("Test", (accounts) => {
	let uniswapFactory0;
	let uniswapFactory1;
	let uniswapRouter0;
	let uniswapRouter1;
	let daiContract0;
	let daiContract1;
	beforeEach( async () => {
		// just deploy the uniswap factory twice to simplify implementation
		// would be different dexes in practice
		uniswapFactory0 = await UniswapV2Factory.new(accounts[0], {from: accounts[0]}); 
		uniswapFactory1 = await UniswapV2Factory.new(accounts[0], {from: accounts[0]});
		
		// deploy routers. we use the zero address for the weth contract address 
		// in the second arg since I don't think we'll need to use it for the purpose of this exercise
		uniswapRouter0 = await UniswapV2Router.new(uniswapFactory0.address, zeroAddress, {from: accounts[0]});
		uniswapRouter1 = await UniswapV2Router.new(uniswapFactory1.address, zeroAddress, {from: accounts[0]});


		// just deploy the dai contract twice to simplify implementation
		// functionally the same as adding a different token contract
		daiContract0 = await DaiERC20.new(accounts[0]);
		daiContract1 = await DaiERC20.new(accounts[0]);

		// initialize token balances and pairs
		daiContract0.mint(accounts[1], web3.utils.toBN(10**20)); // 100 dai0
		daiContract1.mint(accounts[1], web3.utils.toBN(10**20)); // 100 dai1
		uniswapFactory0.createPair(daiContract0.address, daiContract1.address, {from: accounts[0]});
		uniswapFactory1.createPair(daiContract0.address, daiContract1.address, {from: accounts[0]});

		// deploy aave contracts
		// add aave liquidity

		// deploy flash loan contract
	});

	it("should initialize correctly", async () => {
		var daiBal = await daiContract1.balanceOf(accounts[1]);
		var ethBal = await web3.eth.getBalance(accounts[1]);
		assert.equal(daiBal.toString(), web3.utils.toBN(10**20).toString());
		assert.equal(ethBal, 10**20);
		var pair0 = await uniswapFactory0.getPair(daiContract0.address, daiContract1.address);
		var pair1 = await uniswapFactory1.getPair(daiContract0.address, daiContract1.address);
		var nonexistentPair = await uniswapFactory1.getPair(daiContract0.address, daiContract0.address);
		assert.notEqual(pair0, 0);
		assert.notEqual(pair1, 0);
		assert.equal(nonexistentPair, 0);
	});

	// test adding liquidity for each pair

	it("should add liquidity correctly", async () => {
		var numPairsBefore = await uniswapFactory0.allPairsLength();
		daiContract0.approve(uniswapRouter0.address, 10000, {from: accounts[1]});
		daiContract1.approve(uniswapRouter0.address, 10000, {from: accounts[1]});
		await uniswapRouter0.addLiquidity(daiContract0.address, daiContract1.address, 10000, 10000, 10000, 10000, accounts[1], Date.now() + 120, {from: accounts[1]});
		var numPairsAfter = await uniswapFactory1.allPairsLength();
		assert.equal(numPairsBefore.toNumber() + 1, numPairsAfter.toNumber());
	})

	// test flash loan with an artificially created arbitrage opportunity

	// test flash loan fails when actions reduce address balance below loan amount

})
