import { config } from "../config";
import { StaticJsonRpcProvider, BaseProvider } from "@ethersproject/providers";

export const provider: BaseProvider = new StaticJsonRpcProvider(
  "https://eth-mainnet.alchemyapi.io/v2/USXiwKZRaqmXAxK9BZW3UyKltWY6PjU8"
);
