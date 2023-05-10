pragma solidity ^0.8.0;

contract ERC20Delegate {
    address public delegate;
    address public token;

    constructor(address _token) {
        delegate = address(this);
        token = _token;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        (bool success, bytes memory result) = token.delegatecall(abi.encodeWithSignature("transferFrom(address,address,uint256)", sender, recipient, amount));
        require(success, "Failed to delegatecall");
        return abi.decode(result, (bool));
    }
}