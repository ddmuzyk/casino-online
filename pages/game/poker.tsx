import Link from "next/link";
import { ReactComponentElement } from "react";
import styles from './poker.module.scss';
import Layout from "@/components/layout";

const Poker = (): JSX.Element => {
  return (
    <Layout siteTitle="Poker">
      <div className={styles.game}>
        <div className={styles.tableContainer}>
          <div className={styles.table}></div>
        </div>
      </div>
    </Layout>
  )
}

export default Poker;