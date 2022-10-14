export type PAYOUTS_LIST = {
  id: string;
  Receiver: string;
  Sender: string;
  Date: string;
  Rewards: number;
  tokenAddress: string;
  transactionHash: string;
};

export type EDITORS_LIST = {
  id: string;
  totalRewards: number;
};

export type OWNER = {
  id: string;
  Address: string;
  TotalRewards: number;
};

export type PAYERS_LIST = {
  id: string;
  Deleted: boolean;
  Date: string;
};

export type TableType = {
  address: string;
  amount: string;
};
