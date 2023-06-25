import * as PokerEvaluator from 'poker-evaluator-ts'


export default function handler(req: any, res: any) {
  res.status(200).json(PokerEvaluator.evalHand(['Ac', 'As', '2c']))
}