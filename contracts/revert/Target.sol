pragma solidity ^0.8.12;

contract Target {

  uint256 value = 0x7;
  address _sender;

  constructor(address sender) {
    _sender = sender;
  }

  function callRevert(bool flag) external pure returns (string memory) {
    if (flag == true) {
      return "call Revert Success";
    } else {
      revert("Error");
      return "call Revert Error";
    }
  }
}