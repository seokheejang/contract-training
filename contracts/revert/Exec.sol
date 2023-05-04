pragma solidity ^0.8.12;

import "./Target.sol";

contract Exec {

  Target target;
  uint256 nonce;

  event eventCallTarget(string result);
  event eventRevert(uint256 result);

  constructor() {
    target = new Target(msg.sender);
  }
  
  function callTarget(bool flag) public {
    this.increseNonce();
    try target.callRevert(flag) returns (string memory result) {
      emit eventCallTarget(result);
    } catch Error(string memory reason) {
      // revert(reason);
      this.decreseNonce();
      emit eventRevert(0x8);     
    } catch {
      emit eventRevert(0x9);     
    }
  }

  function increseNonce() public {
    nonce++;
  }

  function decreseNonce() public {
    nonce--;
  }

  function getNonce() public view returns (uint256) {
    return nonce;
  }
}