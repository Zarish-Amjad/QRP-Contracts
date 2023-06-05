const { expect } = require("chai");

describe("Wallet", function () {
  let wallet;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    const Wallet = await ethers.getContractFactory("Wallet");
    wallet = await Wallet.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("should have correct initial balance", async function () {
    expect(await wallet.getBalance()).to.equal(0);
  });

  it("should allow deposits", async function () {
    const depositAmount = ethers.utils.parseEther("1.0");
    await wallet.connect(addr1).deposit({ value: depositAmount });
    expect(await wallet.getBalance()).to.equal(depositAmount);
  });

  it("should allow the owner to withdraw funds", async function () {
    const initialAmount = ethers.utils.parseEther("2.0");
    const withdrawAmount = ethers.utils.parseEther("1.0");

    await wallet.connect(addr1).deposit({ value: initialAmount });
    await wallet.connect(owner).withdraw(withdrawAmount);

    expect(await wallet.getBalance()).to.equal(initialAmount.sub(withdrawAmount));
  });

  it("should revert when a non-owner tries to withdraw funds", async function () {
    const initialAmount = ethers.utils.parseEther("2.0");
    const withdrawAmount = ethers.utils.parseEther("1.0");

    await wallet.connect(addr1).deposit({ value: initialAmount });

    await expect(wallet.connect(addr1).withdraw(withdrawAmount)).to.be.revertedWith(
      "Only the owner can perform this action"
    );
  });

  it("should revert when trying to withdraw more than the balance", async function () {
    const initialAmount = ethers.utils.parseEther("1.0");
    const withdrawAmount = ethers.utils.parseEther("2.0");

    await wallet.connect(addr1).deposit({ value: initialAmount });

    await expect(wallet.connect(owner).withdraw(withdrawAmount)).to.be.revertedWith(
      "Insufficient balance"
    );
  });
});
