// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract EntryPoint {
  
  event innerHandleOpCall(bool success);

  struct UserOperation {
      address sender;
      uint256 nonce;
      bytes initCode;
      bytes callData;
      uint256 callGasLimit;
      uint256 verificationGasLimit;
      uint256 preVerificationGas;
      uint256 maxFeePerGas;
      uint256 maxPriorityFeePerGas;
      bytes paymasterAndData;
      bytes signature;
  }
  
  function handleOps(UserOperation calldata ops) public {
    _executeUserOp(ops);
  }

  function _executeUserOp(UserOperation calldata ops) private {
    this.innerHandleOp(ops);
  }

  function innerHandleOp(UserOperation calldata ops) external {
    bool success = _call(ops.sender, 0, ops.callData, ops.callGasLimit);
    emit innerHandleOpCall(success);
  }

  function _call(
        address to,
        uint256 value,
        bytes memory data,
        uint256 txGas
    ) internal returns (bool success) {
        assembly {
            success := call(txGas, to, value, add(data, 0x20), mload(data), 0, 0)
        }
    }
}