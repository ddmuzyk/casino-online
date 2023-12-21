import { NextApiRequest, NextApiResponse } from 'next';
import * as PokerEvaluator from 'poker-evaluator-ts'

// export default function handler(req: any, res: any) {
//   const {cards} = req.body;
//   res.status(200).json(PokerEvaluator.evalHand(cards))
// }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cards = req.body;
  const evaluations = [];
  for (let i = 0; i < cards.length; i++) {
    evaluations.push(PokerEvaluator.evalHand(cards[i]));
  }
  res.status(200).json(evaluations)
}