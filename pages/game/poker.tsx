import Link from "next/link";
import { ReactComponentElement, useState, useEffect } from "react";
import styles from './poker.module.scss';
import Layout from "@/components/layout";
import Player from "@/components/poker/Player";

interface Player {
  id: number,
  name: string,
  turn: boolean,
  money: number
}

const Poker = (): JSX.Element => {

  const [players, setPlayers] = useState<Array<Player>>([]);

  useEffect(() => {
    let newPlayers = [];
    for (let i = 1; i < 5; i++) {
      newPlayers.push({
        id: i,
        name: `Player${i}`,
        turn: false,
        money: 1000
      })
    }
    setPlayers(newPlayers);
  }, [])

  console.log(players)

  return (
    <Layout siteTitle="Poker">
      <div className={styles.game}>
        <div className={styles.tableContainer}>
          <div className={styles.table}>
            {players.map((player) => {
              return <Player key={player.name}/>
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Poker;