module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,          // 👈 not 7545 now, because Ganache CLI defaults to 8545
      network_id: "1337",  // 👈 fixed to match Ganache
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};
