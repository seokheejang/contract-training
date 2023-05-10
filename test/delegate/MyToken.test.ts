import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract, ContractFactory } from "@ethersproject/contracts";

describe("MyToken", function () {
  let accounts: any[];
  let myToken: Contract;
  let delegate: Contract;
  let DELEGATE: ContractFactory;
  let MYTOKEN: ContractFactory;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    DELEGATE = await ethers.getContractFactory("ERC20Delegate");
    MYTOKEN = await ethers.getContractFactory("MyToken");

    myToken = await MYTOKEN.deploy();
    delegate = await DELEGATE.deploy(myToken.address);

    await myToken
      .connect(accounts[0])
      .mint(accounts[0].getAddress(), ethers.utils.parseEther("1000000"));
    await myToken
      .connect(accounts[0])
      .approve(delegate.address, ethers.constants.MaxUint256);
  });

  it("transferFrom using delegatecall should transfer tokens between two accounts", async function () {
    const sender = await accounts[0].getAddress();
    const recipient = await accounts[1].getAddress();
    const amount = ethers.utils.parseEther("1000");
    await delegate.connect(accounts[0]).transferFrom(sender, recipient, amount);
    const senderBalance = await myToken.balanceOf(sender);
    const recipientBalance = await myToken.balanceOf(recipient);
    expect(senderBalance).to.equal(ethers.utils.parseEther("999000"));
    expect(recipientBalance).to.equal(amount);
  });
});
