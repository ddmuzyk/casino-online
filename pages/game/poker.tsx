import Link from "next/link";
import { ReactComponentElement } from "react";
import styles from './poker.module.scss';
import Layout from "@/components/layout";

const Poker = (): JSX.Element => {
  return (
    <Layout siteTitle="Poker">
      <div className={styles.game}>
        <h1 className={styles.title}>POKEREK</h1>
      </div>
    </Layout>
  )
}

export default Poker;