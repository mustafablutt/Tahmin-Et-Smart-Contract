const { ethers } = require("hardhat");
require("dotenv").config({ path: "./.env2" });

async function main() {
  const StockMarket = await ethers.getContractFactory("StockMarket");

  // Start deployment, returning a promise that resolves to a contract object
  const StockMarket_ = await StockMarket.deploy(["Mark", "Mike", "Henry", "Rock"], 90);
  console.log("Contract address:", StockMarket_.address);

  const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const StockMarket2 = await ethers.getContractFactory("StockMarket2");
    const Stock2Market = await StockMarket2.connect(wallet).deploy(["Enes", "Berkay", "Fatih", "Mustafa"], 90);

    console.log("Contract address:", Stock2Market.address);

}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });