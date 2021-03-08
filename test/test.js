const UniswapV2FactoryBytecode = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const Contract = require('@truffle/contract');
const UniswapV2Factory = Contract(UniswapV2FactoryBytecode);
UniswapV2Factory.setProvider(web3.currentProvider);
const DaiERC20 = artifacts.require("Dai");

contract("Test", (accounts) => {
	let uniswapFactory0;
	let uniswapFactory1;
	let daiContract0;
	let daiContract1;
	beforeEach( async () => {
		// just deploy the uniswap factory twice to simplify implementation
		// would be different dexes in practice
		uniswapFactory0 = await UniswapV2Factory.new(accounts[0], {from: accounts[0]});
		uniswapFactory1 = await UniswapV2Factory.new(accounts[0], {from: accounts[0]});

		// just deploy the dai contract twice. less interesting but functionally the same as
		// adding a different token contract
		daiContract0 = await DaiERC20.new(accounts[0]);
		daiContract1 = await DaiERC20.new(accounts[0]);

		// initialize token balances and pairs
		daiContract0.mint(accounts[1], web3.utils.toBN(10**20)); // 100 dai0
		daiContract1.mint(accounts[1], web3.utils.toBN(10**20)); // 100 dai1
		uniswapFactory0.createPair(daiContract0.address, daiContract1.address, {from: accounts[0]});
		uniswapFactory1.createPair(daiContract0.address, daiContract1.address, {from: accounts[0]});
	});

	it("should initialize correctly", async () => {
		daiBal = await daiContract1.balanceOf(accounts[1]);
		ethBal = await web3.eth.getBalance(accounts[1]);
		assert.equal(daiBal.toString(), web3.utils.toBN(10**20).toString());
		assert.equal(ethBal, 10**20);
		pair0 = await uniswapFactory0.getPair(daiContract0.address, daiContract1.address);
		pair1 = await uniswapFactory1.getPair(daiContract0.address, daiContract1.address);
		nonexistentPair = await uniswapFactory1.getPair(daiContract0.address, daiContract0.address);
		assert.notEqual(pair0, 0);
		assert.notEqual(pair1, 0);
		assert.equal(nonexistentPair, 0);
	});
})
