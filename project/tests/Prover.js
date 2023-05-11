const Prover = artifacts.require("TestProver");
const Token = artifacts.require("TestToken");

const toBN = web3.utils.toBN;

contract("Prover", () => {
    let prover;
    let token;

    let actual = [];
    let expected = [];

    function deposit(value) {
        it(`deposit ${value}`, async () => {
            const response = await prover.deposit(actual, value);
            actual = readState(response);
            expected.push(toBN(value));
            assert.deepEqual(actual, expected);
        });
    }

    function withdrawAll(index) {
        it(`withdrawAll ${index}`, async () => {
            const response = await prover.withdrawAll(actual, index);
            actual = readState(response);
            expected.splice(index, 1);
            assert.deepEqual(actual, expected);
        });
    }

    function withdrawSome(index) {
        it(`withdrawSome ${index}`, async () => {
            const value = actual[index].divn(10);
            const response = await prover.withdrawSome(actual, index, value);
            actual = readState(response);
            expected[index].isub(value);
            assert.deepEqual(actual, expected);
        });
    }

    function readState(response) {
        console.log(response.receipt.gasUsed);
        const data = response.logs[0].args.state ? response.logs[0].args.state.slice(2) : "";
        return [...Array(data.length / 64).keys()].map(i => toBN("0x" + data.substr(i * 64, 64)));
    }

    before(async () => {
        token = await Token.new("name", "symbol", 1_000_000_000_000);
        prover = await Prover.new(token.address);
        await token.approve(prover.address, 1_000_000_000_000);
    });

    for (let i = 0; i < 10; i++)
        deposit(1_000_000 + 250_000 * i);

    for (let i = 0; i < 5; i++)
        withdrawAll(0);

    for (let i = 0; i < 10; i++)
        deposit(1_000_000 + 250_000 * i);

    for (let i = 0; i < 5; i++)
        withdrawAll((15 - i) - 1);

    for (let i = 0; i < 10; i++)
        deposit(1_000_000 + 250_000 * i);

    for (let i = 0; i < 5; i++)
        withdrawAll((20 - i) >> 1);

    for (let i = 0; i < 15; i++)
        withdrawSome(i);

    for (let i = 0; i < 15; i++)
        withdrawAll(0);

    for (let i = 0; i < 1000; i++)
        deposit(1_000_000 + 250_000 * i);

    for (let i = 0; i < 1000; i += 100)
        withdrawSome(i);
});
