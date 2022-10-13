import { utils } from "ethers";

export const networkMap = {
  MUMBAI_TESTNET: {
    chainId: utils.hexValue(80001),
    chainName: "Mumbai",
    nativeCurrency: { name: "tMATIC", symbol: "tMATIC", decimals: 18 },
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};
