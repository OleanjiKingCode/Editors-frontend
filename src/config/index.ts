export const config = {
  alchemyChain: String(process.env.TEST_ALCHEMY_CHAIN),
  isTestnet: true,
  chainId: process.env.TEST_CHAIN_ID,
  chainName: String(process.env.MAIN_CHAIN_NAME),
  payoutsContractAddress:
    process.env.TEST_PAYOUTS_CONTRACT_ADDRERSS ||
    "0xCca2C72a79e4F3307caa469F12085Be6Fca2E15f",
  payoutsGraphApi:
    process.env.TEST_PAYOUTS_GRAPH_API ||
    "https://api.thegraph.com/subgraphs/name/oleanjikingcode/payout",
  iqPolygonAddress: "0xB9638272aD6998708de56BBC0A290a1dE534a578",
  Scan: String(process.env.TEST_SCAN_LINK),
};
