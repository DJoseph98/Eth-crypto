pragma solidity ^0.8.9;

contract Lottery {
  /* adress without payable function*/
  address public winnerPicker;
  /* set array of address payable */
  address payable[] public players;

  constructor() {
    winnerPicker = msg.sender;
  }

  /* have to pay for using this function */
  function enter() public payable {
    require(msg.value > 0.01 ether); /* require certain ammount to enter */
    /* specify adress to be payable */
    players.push(payable(msg.sender));
  }

  /* can't change variables */
  function random() private view returns (uint256) {
    /*return transform in uint hash of int,time,nb player */
    return
      uint256(
        keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))
      );
  }

  function pickWinner() public restricted {
    /* fail if manager is not the caller of this function */
    uint256 index = random() % players.length;
    /* transfer money from contract to player */
    players[index].transfer(address(this).balance);
    /* reset players array */
    players = new address payable[](0);
  }

  /* virtual function to add to function will call this modifier */
  modifier restricted() {
    require(msg.sender == winnerPicker);
    _;
  }

  function getPlayers() public view returns (address payable[] memory) {
    return players;
  }
}
