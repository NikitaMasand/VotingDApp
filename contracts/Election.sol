pragma solidity >=0.4.21 <0.6.0;
contract Election {
    //Constructor will run whenever we deploy our smart contract
    //a variable without an _ before it is called state variable
    //it is accessible inside a contract and represents data
    //that belongs to entire contract
    //solidity gives a getter function for this public variable without we writing it

    string public candidate;

    constructor () public{
        candidate = "Candidate_1";
    }
}