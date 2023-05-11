import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "@ethersproject/contracts";

describe("A and B contract tests", () => {
  let A: Contract;
  let B: Contract;
  let accounts: any;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    // Deploy the contracts
    const BFactory = await ethers.getContractFactory("B");
    B = await BFactory.deploy();

    const AFactory = await ethers.getContractFactory("A", accounts);
    A = await AFactory.deploy();
  });

  it("should set variables in B contract via A contract", async () => {
    // Call the setVars function in B contract via A contract
    console.log("ddddddddd", B.address);
    await A.setVars(B.address, 123, { value: ethers.utils.parseEther("1") });

    // Check that the variables were set correctly
    const num = await A.num();
    const sender = await A.sender();
    const value = await A.value();

    expect(num).to.equal(123);
    expect(sender).to.equal(await accounts[0].getAddress());
    expect(value).to.equal(ethers.utils.parseEther("1"));
  });
});
