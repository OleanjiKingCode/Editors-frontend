export type PAYOUTS_LIST = {
  id: string;
  receiver: string;
  sender: string;
  date: string;
  rewards: number;
  tokenAddress: string;
  transactionHash: string;
};

export type EDITORS_LIST = {
  id: string;
  totalRewards: number;
};

export type OWNER = {
  id: string;
  address: string;
  totalrewards: number;
};

export type PAYERS_LIST = {
  id: string;
  deleted: boolean;
  date: string;
};

export type TableType = {
  address: string;
  amount: string;
};
