"use client"

import { PrivyProvider as Privy } from "@privy-io/react-auth"

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Privy
      appId="cmkyyrsbj04bck40bidlscndo"
      config={{
        loginMethods: ["google", "email"],
        appearance: {
          theme: "light",
          accentColor: "#4a9eff",
          logo: undefined,
        },
        embeddedWallets: {
          createOnLogin: "off",
        },
      }}
    >
      {children}
    </Privy>
  )
}
