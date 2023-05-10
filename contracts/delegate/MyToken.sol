pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./ERC20Delegate.sol";

contract MyToken is ERC20 {
    address delegate;

    constructor() {
        delegate = address(new ERC20Delegate(address(this)));
        mint(msg.sender, 1000000 * 10 ** 18);
    }

    function transferFrom(address sender, address recipient, uint256 amount) override public returns (bool) {
        require(ERC20Delegate(delegate).transferFrom(sender, recipient, amount), "Failed to transferFrom using delegatecall");
        return true;
    }
}