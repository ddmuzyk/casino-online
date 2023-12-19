import * as PokerEvaluator from 'poker-evaluator-ts'

// export default function handler(req: any, res: any) {
//   const {cards} = req.body;
//   res.status(200).json(PokerEvaluator.evalHand(cards))
// }

export default function handler(req: any, res: any) {
  const {cards} = req.body;
  res.status(200).json(PokerEvaluator.evalHand(cards))
}