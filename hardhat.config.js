require("@nomiclabs/hardhat-truffle5");
require("solidity-coverage");

module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            viaIR: true,
            optimizer: {
                enabled: true,
                runs: 20000
            }
        }
    },
    paths: {
        sources: "./project/contracts",
        tests: "./project/tests",
        cache: "./project/cache",
        artifacts: "./project/artifacts"
    },
    mocha: {
        useColors: true,
        enableTimeouts: false,
        reporter: "list" // https://mochajs.org/#reporters
    }
};
