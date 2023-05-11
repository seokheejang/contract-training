import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";

describe("Exec Contract", function () {
  let exec: Contract;

  beforeEach(async function () {
    const Exec = await ethers.getContractFactory("Exec");
    exec = await Exec.deploy();
    await exec.deployed();
  });

  it("increases nonce when calling callTarget function with flag=true", async function () {
    const initialNonce = await exec.getNonce();
    await exec.callTarget(true);
    const newNonce = await exec.getNonce();
    expect(initialNonce).to.equal(0);
    expect(newNonce).to.equal(1);
  });

  it("increases nonce when calling callTarget function with flag=false", async function () {
    const initialNonce = await exec.getNonce();
    const tx = await exec.callTarget(false);
    const receipt = await tx.wait();
    const eventRevert = receipt.events.find(
      (event: any) => event.event === "eventRevert"
    );
    const newNonce = await exec.getNonce();
    expect(eventRevert).to.not.be.undefined;
    expect(eventRevert.args.result).to.equal(8);
    expect(initialNonce).to.equal(0);
    expect(newNonce).to.equal(0); // 다른 컨트랙트에서 revert 되더라도 기존 컨트랙트는 상태 변수값 변형 유지
  });

  it("emits eventCallTarget when calling callTarget function with flag=true", async function () {
    const tx = await exec.callTarget(true);
    const receipt = await tx.wait();
    const eventCallTarget = receipt.events.find(
      (event: any) => event.event === "eventCallTarget"
    );
    expect(eventCallTarget).to.not.be.undefined;
    expect(eventCallTarget.args.result).to.equal("call Revert Success");
  });

  it("emits eventRevert when calling callTarget function with flag=false", async function () {
    const tx = await exec.callTarget(false);
    const receipt = await tx.wait();
    const eventRevert = receipt.events.find(
      (event: any) => event.event === "eventRevert"
    );
    expect(eventRevert).to.not.be.undefined;
    expect(eventRevert.args.result).to.equal(8);
  });
});
