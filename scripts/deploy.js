const { ethers } = require("hardhat");
require("dotenv").config({ path: "./.env2" });

async function main() {
  const Voting = await ethers.getContractFactory("Voting");

  // Start deployment, returning a promise that resolves to a contract object
  const Voting_ = await Voting.deploy(["Mark", "Mike", "Henry", "Rock"], 90);
  console.log("Contract address:", Voting_.address);

  const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const Voting2 = await ethers.getContractFactory("Voting2");
    const voting2Contract = await Voting2.connect(wallet).deploy(["Enes", "Berkay", "Fatih", "Mustafa"], 90);

    console.log("Contract address:", voting2Contract.address);

}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });