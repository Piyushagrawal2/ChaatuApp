import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </ThemeProvider>
    </ClerkProvider>
  );
}
