const assert = require("assert");
const ganache = require("ganache-cli"); // eth local network
const Web3 = require("web3"); // js API to communicate with eth local network
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let accounts, lotteryContract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lotteryContract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
});

describe("Inbox", () => {
  it("should deploy contract", async () => {
    assert.ok(lotteryContract.options.address);
  });
  it("should one account enter success", async () => {
    await lotteryContract.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });
    const players = await lotteryContract.methods.getPlayers().call();
    assert.equal(players[0], accounts[0]);
    assert.equal(1, players.length);
  });
  it("should multiple accounts enter success", async () => {
    await lotteryContract.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });
    await lotteryContract.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.02", "ether") });
    await lotteryContract.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("0.02", "ether") });

    const players = await lotteryContract.methods.getPlayers().call();

    assert.equal(players[0], accounts[0]);
    assert.equal(players[1], accounts[1]);
    assert.equal(players[2], accounts[2]);
    assert.equal(3, players.length);
  });
  it("should fail because insufficient", async () => {
    try {
      await lotteryContract.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei("0.009", "ether") });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
  it("only manager can pick winner", async () => {
    try {
      await lotteryContract.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
  it("should pick winner and send balance", async () => {
    await lotteryContract.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lotteryContract.methods.pickWinner().send({ from: accounts[0] });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei("1.8", "ether"));

    const players = await lotteryContract.methods.getPlayers().call();
    assert.equal(0, players.length);

    const contractBalance = await web3.eth.getBalance(
      lotteryContract.options.address
    );
    assert.equal(0, contractBalance);
  });
});
