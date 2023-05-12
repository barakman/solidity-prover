const Prover = artifacts.require("TestProver");

const toBN = web3.utils.toBN;

contract("Prover", () => {
    let prover;

    let actual = [];
    let expected = [];

    function appendOne(value) {
        it(`appendOne(${value})`, async () => {
            actual = await execute(prover.appendOne(actual, value));
            expected.push(toBN(value));
            assert.deepEqual(actual, expected);
        });
    }

    function removeOne(index) {
        it(`removeOne(${index})`, async () => {
            actual = await execute(prover.removeOne(actual, index));
            expected.splice(index, 1);
            assert.deepEqual(actual, expected);
        });
    }

    function updateAll(delta) {
        it(`updateAll(${delta})`, async () => {
            actual = await execute(prover.updateAll(actual, delta));
            expected.forEach(value => value.iaddn(delta));
            assert.deepEqual(actual, expected);
        });
    }

    async function execute(transaction) {
        const response = await transaction;
        console.log(response.receipt.gasUsed);
        const data = response.logs[0].args.state ? response.logs[0].args.state.slice(2) : "";
        return [...Array(data.length / 64).keys()].map(i => toBN("0x" + data.substr(i * 64, 64)));
    }

    function repeat(n, func) {
        for (let i = 0; i < n; i++)
            func(i);
    }

    before(async () => {
        prover = await Prover.new();
    });

    repeat(20, i => appendOne(i));
    updateAll(1);
    repeat(10, i => removeOne(0));
    updateAll(2);
    repeat(20, i => appendOne(i));
    updateAll(3);
    repeat(10, i => removeOne((30 - i) - 1));
    updateAll(4);
    repeat(20, i => appendOne(i));
    updateAll(5);
    repeat(10, i => removeOne((40 - i) >> 1));
    updateAll(6);
    repeat(1000, i => appendOne(i));
    updateAll(7);
});
