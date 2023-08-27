const fs = require('fs');
const readline = require('readline');

class FiniteAutomaton {
  constructor() {
    this.states = new Set();
    this.alphabet = new Set();
    this.transitions = new Map();
    this.initialState = null;
    this.finalStates = new Set();
  }

  loadFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').split('\n').filter(line => line.trim() !== '');
    console.log("\n========================================");
    console.log(filePath + " carregado!");
    console.log("========================================");

    this.initialState = data[0].trim();

    const alphabetSymbols = data[1].trim().split(' ');
    this.alphabet = new Set(alphabetSymbols);

    const allStates = data[2].trim().split(' ');
    this.states = new Set(allStates);

    const finalStateSymbols = data[3].trim().split(' ');
    this.finalStates = new Set(finalStateSymbols);

    for (let i = 4; i < data.length; i++) {
      const [fromState, toState, symbol] = data[i].trim().split(' ');
      const transitionKey = `${fromState}-${symbol}`;
      this.transitions.set(transitionKey, toState);
    }

    console.log("Transições =>\n\n", this.transitions);
    console.log("\n========================================");
  }

  run(inputWord) {
    let currentState = this.initialState;

    for (const symbol of inputWord) {
      const transitionKey = `${currentState}-${symbol}`;
      if (!this.transitions.has(transitionKey)) {
        return 'Rejeitada';
      }
      currentState = this.transitions.get(transitionKey);
    }

    if (this.finalStates.has(currentState)) {
      console.log("Estado Final => " + state);
      return 'Aceita';
    } else {
      return 'Rejeitada';
    }
  }
}

function main() {
  const automaton = new FiniteAutomaton();
  const filePath = 'automatoAFD1.txt';

  automaton.loadFromFile(filePath);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Digite uma palavra: ', (inputWord) => {
    const result = automaton.run(inputWord);
    console.log(result);
    rl.close();
  });
}

main();