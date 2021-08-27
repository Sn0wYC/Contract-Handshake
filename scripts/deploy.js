async function main() {
    // set agreement text
    const agreement = "";
    // set signers
    const signers = [""]
    // Deploy the contract
    const CONTRACT = await ethers.getContractFactory("ContractHandshake");
    const contract = await CONTRACT.deploy();
    console.log("Contract handshake deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
