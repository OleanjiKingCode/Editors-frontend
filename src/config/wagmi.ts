import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { chain, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from 'wagmi/providers/public'
import { config } from "./index";

type Connector = MetaMaskConnector | WalletConnectConnector;
const chainArray =
  config.alchemyChain === "mumbai" ? [chain.polygonMumbai] : [chain.polygon];
export const { chains, provider } = configureChains(chainArray, [publicProvider()],);

export const connectors: Connector[] = [
  new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  }),
];
