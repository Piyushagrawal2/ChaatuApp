import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chaatu AI</title>
      </Head>
      <main className={styles.main}>
        <h1>Chaatu AI Platform</h1>
        <p>Phase 1 setup complete. Frontend scaffolding is ready for chat UI.</p>
      </main>
    </div>
  );
}
