import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header.jsx"
import {ThemeProvider} from "@/components/ui/theme-provider"
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
const inter=Inter({subsets:["latin"] });

export const metadata = {
  title: "CAREERNOVA - An AI Career Coach",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme:dark,
      }}
    >
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${inter.className}`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* header */}
            <Header/>
            <main className="min-h-screen">{children}</main>
            {/* header */}
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-grey-200 ">
                <p>Made with ❤️ from Vishal</p>
              </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
