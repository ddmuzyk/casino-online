import { NextApiRequest, NextApiResponse } from 'next';
import * as PokerEvaluator from 'poker-evaluator-ts';
import { readFileSync } from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const cards = req.body;
  const evaluations: Array<any> = [];
  for (let i = 0; i < cards.length; i++) {
    evaluations.push(PokerEvaluator.evalHand(cards[i]));
  }
  res.status(200).json(evaluations)
  
}