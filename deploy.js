const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3"); // js API to communicate with eth local network
const { abi, evm } = require("./compile");
require("dotenv").config();

/* Permet de gérer ton wallet pour le connecter au réeseau etherum*/
const provider = new HDWalletProvider(
  /* process.env.WALLET_WORDS */ "exile wool edit shiver inch merry runway crowd educate target ranch adult",
  /* process.env.WALLET_URL */ "wss://rinkeby.infura.io/ws/v3/3a8b2e6bf8734861bead19c674559910"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("attempt to deploy from account", accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });
  console.log(abi);
  console.log("contract deployed on", result.options.address);
  provider.engine.stop();
};

deploy();
