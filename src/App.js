import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";

import { goerli, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import LandingPage from "./pages/LandingPage";

function App() {
  const { chains, provider } = configureChains(
    [goerli, polygonMumbai],
    [
      alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        coolMode
        chains={chains}
        theme={lightTheme({
          accentColor: "#10bb35",
          accentColorForeground: "white",
          borderRadius: "medium",
          fontStack: "system",
          overlayBlur: "small",
        })}
      >
        <div className="App">
          <LandingPage />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
