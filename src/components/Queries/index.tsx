export const GET_PAYOUTS_LISTS = `
query($skip:Int){
    payoutsRecords(first:5 skip:$skip orderBy:rewards orderDirection:desc){
        id
        sender
        receiver
        date
        rewards
        tokenAddress
        transactionHash
    }
}
`;

export const GET_PAYERS_LISTS = `
query ($skip:Int){
    payers(first:5 skip:$skip orderBy:date orderDirection:desc){
        id
        deleted
        date 
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
        address
      }
}`;
