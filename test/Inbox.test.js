const assert = require("assert");
const ganache = require("ganache-cli"); // eth local network
const Web3 = require("web3"); // js API to communicate with eth local network
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts, inboxContract;
const INITIAL_MESSAGE = "Yo mec";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inboxContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_MESSAGE],
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
});

describe("Inbox", () => {
  it("should deploy contract", async () => {
    assert.ok(inboxContract.options.address);
  });
  it("should get message value", async () => {
    const message = await inboxContract.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });
  it("should can change message", async () => {
    await inboxContract.methods
      .setMessage("Au revoir mec")
      .send({ from: accounts[0] });
    const message = await inboxContract.methods.message().call();
    assert.equal(message, "Au revoir mec");
  });
});
