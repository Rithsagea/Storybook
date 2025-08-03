import { Axiom, Model } from "./Model";

class Sheet extends Model {}

class Score {}
const ScoreAxiom = new Axiom(Score, Sheet);

const sheet = new Sheet();
console.log(sheet.suppose(ScoreAxiom));
console.log(sheet.assume(ScoreAxiom));
console.log(sheet.suppose(ScoreAxiom));
