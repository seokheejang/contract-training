import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "@ethersproject/contracts";

describe("EntryPoint and SimpleAccount", function () {
  let entryPoint: Contract;
  let simpleAccount: Contract;
  let admin: any;
  let ep: any;
  let userA: any;
  let userB: any;

  before(async () => {
    // Get the signers
    [admin, ep, userA, userB] = await ethers.getSigners();

    // Deploy EntryPoint contract
    const EntryPoint = await ethers.getContractFactory("EntryPoint", ep);
    entryPoint = await EntryPoint.deploy();

    // Deploy SimpleAccount contract
    const SimpleAccount = await ethers.getContractFactory(
      "SimpleAccount",
      userA
    );
    simpleAccount = await SimpleAccount.deploy();
  });

  it("should transfer ether from SimpleAccount to another address", async function () {
    // Send 1 ether from admin account to SimpleAccount
    await admin.sendTransaction({
      to: simpleAccount.address,
      value: ethers.utils.parseEther("1"),
    });
    // Execute SimpleAccount's execute function through EntryPoint contract
    const data = simpleAccount.interface.encodeFunctionData("execute", [
      userB.address,
      ethers.utils.parseEther("0.2"),
      "0x",
    ]);
    const tx = await entryPoint.connect(ep).handleOps({
      sender: simpleAccount.address,
      nonce: 0,
      initCode: "0x",
      callData: data,
      callGasLimit: 1000000,
      verificationGasLimit: 1000000,
      preVerificationGas: 1000000,
      maxFeePerGas: 0,
      maxPriorityFeePerGas: 0,
      paymasterAndData: "0x",
      signature: "0x",
    });

    const receipt = await tx.wait();
    const CALL_EVENT = "Call";
    const logs = receipt.logs.filter(
      (log: any) =>
        log.address === simpleAccount.address &&
        log.topics[0] === simpleAccount.interface.getEventTopic(CALL_EVENT)
    );
    const eventFragment = simpleAccount.interface.getEvent(CALL_EVENT);
    const logResult = simpleAccount.interface.decodeEventLog(
      eventFragment,
      logs[0].data
    );

    // Check "Call" event logs data
    expect(logResult.success).to.equal(true);
    expect(logResult.result).to.equal("0x");

    // Check that 0.1 ether was transferred from SimpleAccount to userA
    expect(await ethers.provider.getBalance(simpleAccount.address)).to.equal(
      ethers.utils.parseEther("0.8")
    );
    expect(await ethers.provider.getBalance(userB.address)).to.equal(
      ethers.utils.parseEther("10000.2")
    );
  });
});
