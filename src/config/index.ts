export const config = {
  alchemyApiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
  alchemyChain: process.env.isOnTestnet ? "mumbai" : "polygon",
  chainId: process.env.isOnTestnet ? 80001 : 137,
  chainName: process.env.isOnTestnet ? "mumbai" : "Polygon Mainnet",
  payoutsContractAddress: process.env.isOnTestnet
    ? process.env.TEST_PAYOUTS_CONTRACT_ADDRERSS ||
      "0xCca2C72a79e4F3307caa469F12085Be6Fca2E15f"
    : process.env.MAIN_PAYOUTS_CONTRACT_ADDRERSS ||
      "0x24d6D640D36F45D65F289774B986a6c61C95E02F",
  payoutsGraphApi: process.env.isOnTestnet ?
    process.env.TEST_PAYOUTS_GRAPH_API ||
    "https://api.thegraph.com/subgraphs/name/oleanjikingcode/payout" :process.env.MAIN_PAYOUTS_GRAPH_API ||
    "https://thegraph.com/hosted-service/subgraph/oleanjikingcode/editors-payout",
  iqPolygonAddress: "0xB9638272aD6998708de56BBC0A290a1dE534a578",
  Scan:  process.env.isOnTestnet ? "https://mumbai.polygonscan.com/" : "https://polygon-rpc.com/",
};

// export const config = {

//   iqPolygonAddress: "0xB9638272aD6998708de56BBC0A290a1dE534a578",
//   isOnTestnet: process.env.isOnTestnet,

//   //TESTNET
//   testApiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
//   testChain: "mumbai",
//   testChainId: 80001,
//   testChainName: "mumbai",

//   testPayoutsContractAddress:
//     process.env.TEST_PAYOUTS_CONTRACT_ADDRERSS ||
//     "0xCca2C72a79e4F3307caa469F12085Be6Fca2E15f",
//   testPayoutsGraphApi:
//     process.env.TEST_PAYOUTS_GRAPH_API ||
//     "https://api.thegraph.com/subgraphs/name/oleanjikingcode/payout",

//   mumbaiScan: "https://mumbai.polygonscan.com/",

//   //MAINNET
//   mainApiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
//   mainChain: "Polygon",
//   mainChainId: 137,
//   mainChainName: "Polygon Mainnet",

//   mainPayoutsContractAddress:
//     process.env.MAIN_PAYOUTS_CONTRACT_ADDRERSS ||
//     "0x24d6D640D36F45D65F289774B986a6c61C95E02F",
//   mainPayoutsGraphApi:
//     process.env.PAYOUTS_GRAPH_API ||
//     "https://thegraph.com/hosted-service/subgraph/oleanjikingcode/editors-payout",

//   polygonScan:  "https://polygon-rpc.com/",
// };
