import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from '@clerk/nextjs';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  );
}
