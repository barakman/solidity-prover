const Prover = artifacts.require("TestProver");

const toBN = web3.utils.toBN;

contract("Prover", () => {
    let prover;

    let actual = [];
    let expected = [];

    function appendOne(value) {
        it(`appendOne(${value})`, async () => {
            const response = await prover.appendOne(actual, value);
            actual = readState(response);
            expected.push(toBN(value));
            assert.deepEqual(actual, expected);
        });
    }

    function removeOne(index) {
        it(`removeOne(${index})`, async () => {
            const response = await prover.removeOne(actual, index);
            actual = readState(response);
            expected.splice(index, 1);
            assert.deepEqual(actual, expected);
        });
    }

    function updateAll(delta) {
        it(`updateAll(${delta})`, async () => {
            const response = await prover.updateAll(actual, delta);
            actual = readState(response);
            expected.forEach(value => value.iaddn(delta));
            assert.deepEqual(actual, expected);
        });
    }

    function readState(response) {
        console.log(response.receipt.gasUsed);
        const data = response.logs[0].args.state ? response.logs[0].args.state.slice(2) : "";
        return [...Array(data.length / 64).keys()].map(i => toBN("0x" + data.substr(i * 64, 64)));
    }

    before(async () => {
        prover = await Prover.new();
    });

    for (let i = 0; i < 10; i++)
        appendOne(i);

    updateAll(1);

    for (let i = 0; i < 5; i++)
        removeOne(0);

    updateAll(2);

    for (let i = 0; i < 10; i++)
        appendOne(i);

    updateAll(3);

    for (let i = 0; i < 5; i++)
        removeOne((15 - i) - 1);

    updateAll(4);

    for (let i = 0; i < 10; i++)
        appendOne(i);

    updateAll(5);

    for (let i = 0; i < 5; i++)
        removeOne((20 - i) >> 1);

    updateAll(6);

    for (let i = 0; i < 1000; i++)
        appendOne(i);

    updateAll(7);
});
