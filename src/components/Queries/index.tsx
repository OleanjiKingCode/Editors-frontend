export const GET_PAYOUTS_LISTS = `
query {
    payoutsRecords(orderBy:Rewards orderDirection:desc){
        id
        Sender
        Receiver
        Date
        Rewards
        TokenAddress
    }
}
`;

export const GET_PAYERS_LISTS = `
query {
    payers {
        id
        Deleted
        Address 
    }
}
`;

export const GET_EDITORS_LIST = `
query {
 editors(orderBy:TotalRewards orderDirection:desc){
    id
    Address
    TotalRewards
  }
}`;


export const GET_OWNER = `
query {
    owners (first:1) {
        id
        Address
      }
}`;
