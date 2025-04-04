# MooveDAO

MooveDAO è un contratto intelligente basato su Ethereum che implementa un'organizzazione autonoma decentralizzata (DAO). Gli utenti possono acquistare azioni della DAO utilizzando token ERC-20 e partecipare al processo decisionale attraverso votazioni su proposte.

## Tecnologie Utilizzate
- **Solidity**: Linguaggio di programmazione per smart contract su Ethereum.
- **Hardhat**: Ambiente di sviluppo per testare e distribuire smart contract.
- **OpenZeppelin**: Libreria per contratti sicuri e standardizzati.
- **TypeScript**: Per scrivere test più robusti e leggibili.
- **Chai**: Libreria di asserzioni per i test.

## Funzionalità Principali
### 1. Acquisto di Azioni
Gli utenti possono acquistare azioni della DAO utilizzando un token ERC-20. Il prezzo per azione è fisso e definito nel contratto.

### 2. Creazione di Proposte
Solo i membri della DAO (chi possiede azioni) possono creare proposte per migliorare il progetto.

### 3. Votazione sulle Proposte
I membri possono votare sulle proposte in base al numero di azioni possedute. È possibile anche delegare il voto ad altri membri.

### 4. Esecuzione delle Proposte
Se una proposta ottiene più voti favorevoli che contrari, viene approvata ed eseguita.

### 5. Interruzione della Vendita
Il proprietario del contratto può interrompere la vendita delle azioni in qualsiasi momento.

## Installazione
Assicurati di avere [Node.js](https://nodejs.org/) e [Hardhat](https://hardhat.org/) installati.

1. Clona il repository:
   ```bash
   git clone https://github.com/tuo-username/MooveDAO.git
   cd MooveDAO
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```

## Testing
Per eseguire i test, usa il comando:
```bash
npx hardhat test
```

## Distribuzione
Puoi distribuire il contratto su una blockchain Ethereum o una testnet come segue:
```bash
npx hardhat run scripts/deploy.ts --network rinkeby
```

## Autori
- **Nome Cognome** - [GitHub](https://github.com/tuo-username)

## Licenza
Questo progetto è distribuito sotto la licenza MIT.

