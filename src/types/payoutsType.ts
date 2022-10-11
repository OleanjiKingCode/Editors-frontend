export type PAYOUTS_LIST = {
  id: string;
  Receiver: string;
  Sender: string;
  Date: string;
  Rewards: number;
  TokenAddress: string;
};

export type EDITORS_LIST = {
  id: string;
  Address: string;
  TotalRewards: number;
};


export type OWNER = {
  id: string;
  Address: string;
  TotalRewards: number;
};

export type PAYERS_LIST = {
  id: string;
  Deleted: boolean;
  Address: string;
};
