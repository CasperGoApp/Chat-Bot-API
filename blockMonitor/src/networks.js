module.exports = {
  main: {
    btc: {
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bc',
      bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
      },
      pubKeyHash: 0x00,
      scriptHash: 0x05,
      wif: 0x80,
      paths: [44, 0, 0]
    },
    divi: {
      messagePrefix: '\x19Divi Signed Message:\n',
      bech32: 'divi',
      bip32: {
        public: 0x22d2533,
        private: 0x221312b
      },
      pubKeyHash: 0x1e,
      scriptHash: 0xd,
      wif: 0xd4,
      paths: [44, 301, 0]
    }
  },
  test: {
    btc: {
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x043587cf,
        private: 0x04358394
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef,
      paths: [44, 0, 0]
    },
    divi: {
      messagePrefix: '\u0018DarkNet Signed Message:\n',
      bech32: 'divi',
      bip32: {
        public: 0x3a8061a0,
        private: 0x3a805837
      },
      pubKeyHash: 0x8b,
      scriptHash: 0x13,
      wif: 0xef,
      paths: [44, 301, 0]
    }
  }
}
