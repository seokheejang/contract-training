import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect } from "chai";

describe("EntryPoint", function () {
  let entryPoint: Contract;
  let simpleAccount: Contract;

  beforeEach(async function () {
    const SimpleAccount = await ethers.getContractFactory("SimpleAccount");
    simpleAccount = await SimpleAccount.deploy();

    const EntryPoint = await ethers.getContractFactory("EntryPoint");
    entryPoint = await EntryPoint.deploy();
  });

  it("should transfer ether from SimpleAccount to another address", async function () {
    // 이전 잔고와 비교할 주소와 양
    const recipient = ethers.utils.getAddress(
      "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF"
    );
    const amount = ethers.utils.parseEther("0.1");

    // 수신자의 이전 잔고
    const beforeBalance = await ethers.provider.getBalance(recipient);

    // SimpleAccount 컨트랙트에서 지정된 양만큼 이동
    await entryPoint.handleOps({
      sender: simpleAccount.address,
      nonce: 0,
      initCode: "0x",
      callData: simpleAccount.interface.encodeFunctionData(
        "transfer(address,uint256)",
        [recipient, amount]
      ),
      callGasLimit: 1000000,
      verificationGasLimit: 1000000,
      preVerificationGas: 0,
      maxFeePerGas: 100,
      maxPriorityFeePerGas: 1,
      paymasterAndData: "0x",
      signature: "0x",
    });

    // 수신자의 이후 잔고
    const afterBalance = await ethers.provider.getBalance(recipient);

    // 이전 잔고와 지정된 양의 차이를 확인하여 전송이 이루어졌는지 확인
    expect(afterBalance.sub(beforeBalance)).to.equal(amount);
  });
});
