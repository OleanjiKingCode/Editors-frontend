import { utils } from "ethers";
import { config } from "../../config";

export const networkMap = {
  POLYGON_NET:
    //  config.isTestnet?
    {
      chainId: utils.hexValue(80001),
      chainName: "Mumbai",
      nativeCurrency: { name: "tMATIC", symbol: "tMATIC", decimals: 18 },
      rpcUrls: ["https://matic-mumbai.chainstacklabs.com/"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
  // : {
  //     chainId: utils.hexValue(137),
  //     chainName: "Polygon Mainnet",
  //     nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  //     rpcUrls: ["https://polygon-rpc.com/"],
  //     blockExplorerUrls: ["https://polygonscan.com"],
  //   },
};
