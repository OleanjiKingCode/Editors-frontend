const testnet = true;
export const config = {
  alchemyChain: testnet
    ? String(process.env.TEST_ALCHEMY_CHAIN)
    : String(process.env.MAIN_ALCHEMY_CHAIN),
  isTestnet: testnet,
  chainId: testnet ? process.env.TEST_CHAIN_ID : process.env.MAIN_CHAIN_ID,
  chainName: testnet
    ? String(process.env.TEST_CHAIN_NAME)
    : String(process.env.MAIN_CHAIN_NAME),
  payoutsContractAddress: testnet
    ? process.env.TEST_PAYOUTS_CONTRACT_ADDRERSS ||
      "0xCca2C72a79e4F3307caa469F12085Be6Fca2E15f"
    : process.env.MAIN_PAYOUTS_CONTRACT_ADDRERSS ||
      "0x24d6D640D36F45D65F289774B986a6c61C95E02F",
  payoutsGraphApi: testnet
    ? process.env.TEST_PAYOUTS_GRAPH_API ||
      "https://api.thegraph.com/subgraphs/name/oleanjikingcode/payout"
    : process.env.MAIN_PAYOUTS_GRAPH_API ||
      "https://thegraph.com/hosted-service/subgraph/oleanjikingcode/editors-payout",
  iqPolygonAddress: "0xB9638272aD6998708de56BBC0A290a1dE534a578",
  Scan: testnet
    ? String(process.env.TEST_SCAN_LINK)
    : String(process.env.MAIN_SCAN_LINK),
};
