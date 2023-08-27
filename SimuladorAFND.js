const fs = require('fs');
const readline = require('readline');

class NonDeterministicFiniteAutomaton 
{
  constructor() 
  {
    this.states = new Set();
    this.alphabet = new Set();
    this.transitions = new Map();
    this.initialState = null;
    this.finalStates = new Set();
  }

  loadFromFile(filePath) 
  {
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

    for (let i = 4; i < data.length; i++) 
    {
      const [fromState, toStates, symbol] = data[i].trim().split(' ');
      const transitionKey = `${fromState}-${symbol}`;
      const toStateArray = toStates.split(',');
      this.transitions.set(transitionKey, toStateArray);
    }

    console.log("Transições =>\n\n", this.transitions);
    console.log("\n========================================");
  }

  run(inputWord) 
  {
    const initialStates = new Set([this.initialState]);
    const statesToProcess = new Set([this.initialState]);

    for (const symbol of inputWord) 
    {
      const newStates = new Set();
      for (const state of statesToProcess) 
      {
        const transitionKey = `${state}-${symbol}`;
        if (this.transitions.has(transitionKey)) 
        {
          const transitionStates = this.transitions.get(transitionKey);
          
          for (const state of transitionStates) 
          {
            newStates.add(state);
          }
        }
        
        if(this.transitions.has(`${state}-&`))
        {
          const transitionStates = this.transitions.get(`${state}-&`);
          for (const state of transitionStates) 
          {
            newStates.add(state);
          }
        }
      }
      statesToProcess.clear();

      for (const state of newStates) 
      {
        statesToProcess.add(state);
      }
    }

    for (const state of statesToProcess) 
    {
      if (this.finalStates.has(state)) 
      {
        console.log("Estado Final => " + state);
        return 'Aceita';
      }
    }

    return 'Rejeitada';
  }
}

function main() 
{
  const automaton = new NonDeterministicFiniteAutomaton();
  const filePath = 'automatoAFND.txt';

  automaton.loadFromFile(filePath);

  const rl = readline.createInterface
  ({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Digite uma palavra: ', (inputWord) => 
  {
    const result = automaton.run(inputWord);
    console.log(result);
    rl.close();
  });
}

main();