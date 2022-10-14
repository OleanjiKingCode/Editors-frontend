export const GET_PAYOUTS_LISTS = `
query {
    payoutsRecords(orderBy:Rewards orderDirection:desc){
        id
        Sender
        Receiver
        Date
        Rewards
        tokenAddress
        transactionHash
    }
}
`;

export const GET_PAYERS_LISTS = `
query {
    payers {
        id
        Deleted
        Date 
    }
}
`;

export const GET_EDITORS_LIST = `
query {
 editors(orderBy:totalRewards orderDirection:desc){
    id
    totalRewards
  }
}`;

export const GET_OWNER = `
query {
    owners (first:1) {
        id
        Address
      }
}`;
