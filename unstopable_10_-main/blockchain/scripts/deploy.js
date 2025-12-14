const hre = require("hardhat");

async function main() {
  console.log("Deploying InvoiceRegistry contract...");

  const InvoiceRegistry = await hre.ethers.getContractFactory("InvoiceRegistry");
  const invoiceRegistry = await InvoiceRegistry.deploy();

  await invoiceRegistry.waitForDeployment();

  const contractAddress = await invoiceRegistry.getAddress();
  console.log("InvoiceRegistry deployed to:", contractAddress);

  // Verify contract on Etherscan (optional)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await invoiceRegistry.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  return contractAddress;
}

main()
  .then((address) => {
    console.log("Deployment completed successfully!");
    console.log("Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });