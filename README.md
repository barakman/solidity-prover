## Abstract

Storage access is generally the most expensive operation:
- Storage write is the 1st most expensive operation
- Storage read is the 3rd most expensive operation

At the time of writing this:
```
+-----------------------------------------+-----------------+
| Storage Operation                       | Gas Consumption |
+-----------------------------------------+-----------------+
| read zero                               |  2100           |
| read non-zero                           |  2100           |
| update zero to zero                     |  2200           |
| update zero to non-zero                 | 22100           |
| update non-zero to zero                 |  5000           |
| update non-zero to the same non-zero    |  2200           |
| update non-zero to a different non-zero |  5000           |
| invoke external function                |  3000           |
+-----------------------------------------+-----------------+
```

Consider a system with a storage requirement too expensive to execute onchain.
For example, updating 500 storage slots can cost more than 10 million gas units.
Ideally, we would want to somehow store the information offchain in a trustless manner.

The `Prover` contract supports this L2-like implementation in the following way:
- The entire state of the system is emitted by an event every time it changes
- The user needs to provide this state in order to interact with the contract
- The contract, which stores only a hash of this state, verifies the user input

Note that this scheme bares a fundamental tradeoff - while providing an alternative for one specific system requirement which cannot be implemented otherwise (see example above), it limits the overall scalability of the system, since the cost of authenticating the data at the beginning of every transaction and emitting it at the end of every transaction is by itself proportional to the size of the data.

Hence, this module is mostly suitable for a rather small set of system types, namely, systems which require updating a large number of storage slots in a single transaction, but do not require maintaining a much larger number of storage slots altogether.

<br/><br/>

---

<br/><br/>

## Prover Contract

In every contract which derives from the `Prover` contract, every function which needs to access the state of the contract, should receive that state as an array of 256-bit values, and validate its authenticity before using it further.

The offchain caller of such function can obtain that state by fetching the most recent `Updated` event.

### Function `authenticate(uint256[] calldata array) internal view returns (bool)`

This function returns true if and only if the input state is authentic.

### Function `generalUpdate(uint256[] memory array) internal`

This function updates the state of the contract and emits it in an event.

### Function `appendAndUpdate(uint256[] calldata array, uint256 value) internal`

This function appends a single 256-bit value to the state of the contract and emits it in an event.

### Function `removeAndUpdate(uint256[] calldata array, uint256 index) internal`

This function removes a single 256-bit value from the state of the contract and emits it in an event.

<br/><br/>

---

<br/><br/>

## Testing

### Prerequisites

- `node 16.13.0`
- `yarn 1.22.10` or `npm 8.1.0`

### Installation

- `yarn install` or `npm install`

### Compilation

- `yarn build` or `npm run build`

### Execution

- `yarn test` or `npm run test`

### Verification

- `yarn verify` or `npm run verify`
