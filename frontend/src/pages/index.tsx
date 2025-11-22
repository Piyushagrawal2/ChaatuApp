import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';

export default function Home() {
  return (
    <>
      <Head>
        <title>Valerio.ai - Next Gen Chatbot</title>
        <meta name="description" content="Experience the future of AI with Valerio." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
        <Navbar />
        <Hero />
        <Features />
        <Pricing />

        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          <div className="container mx-auto px-6">
            <p>© {new Date().getFullYear()} Valerio.ai. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
