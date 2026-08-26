export const rpc = {
  Server: jest.fn().mockImplementation(() => ({
    getEvents: jest.fn().mockResolvedValue({ events: [] }),
    getAccount: jest.fn().mockResolvedValue({}),
    simulateTransaction: jest.fn().mockResolvedValue({}),
    sendTransaction: jest.fn().mockResolvedValue({ status: "SUCCESS", hash: "mock-tx-hash" }),
  })),
  Api: {
    isSimulationSuccess: jest.fn().mockReturnValue(true),
  },
  assembleTransaction: jest.fn().mockReturnValue({
    build: jest.fn().mockReturnValue({
      toXDR: jest.fn().mockReturnValue("mock-xdr"),
    }),
  }),
};

export const Horizon = {
  Server: jest.fn().mockImplementation(() => ({
    loadAccount: jest.fn().mockResolvedValue({
      balances: [{ asset_type: "native", balance: "100.00" }],
    }),
  })),
};

export const Contract = jest.fn().mockImplementation(() => ({
  call: jest.fn(),
}));

export const TransactionBuilder = jest.fn().mockImplementation(() => ({
  addOperation: jest.fn().mockReturnThis(),
  setTimeout: jest.fn().mockReturnThis(),
  build: jest.fn().mockReturnThis(),
  toXDR: jest.fn().mockReturnValue("mock-xdr"),
}));

TransactionBuilder.fromXDR = jest.fn().mockReturnValue({});

export const Networks = {
  TESTNET: "Test SDF Network ; September 2015",
  PUBLIC: "Public Global Stellar Network ; September 2015",
};

export const nativeToScVal = jest.fn();
export const scValToNative = jest.fn((val) => val);
export const Address = jest.fn().mockImplementation(() => ({
  toScVal: jest.fn(),
}));
export const xdr = {};
