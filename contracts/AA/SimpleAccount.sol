// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract SimpleAccount {

  event Call(bool success, bytes result);

  receive() external payable {}

  function execute(address dest, uint256 value, bytes calldata func) external {
    _call(dest, value, func);
  }

  function _call(address target, uint256 value, bytes memory data) internal {
    (bool success, bytes memory result) = target.call{value: value}(data);
    emit Call(success, result);
  }
}