async function main() {
  // Deploying the Wallet contract
  const Wallet = await ethers.getContractFactory("Wallet");
  const wallet = await Wallet.deploy();

  console.log("Wallet deployed to:", wallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

