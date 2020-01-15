pragma solidity >=0.4.21 <0.6.0;
contract Election {
    /*
    1. smoke testing
    //Constructor will run whenever we deploy our smart contract
    //a variable without an _ before it is called state variable
    //it is accessible inside a contract and represents data
    //that belongs to entire contract
    //solidity gives a getter function for this public variable without we writing it
    //_variable implies ist's a local variable

    string public candidate;

    constructor() public{
        candidate = "Candidate_1";
    }
*/
    
  //  2: list candidates:
  //  Model a candidate
  struct Candidate {
      uint id;
      string name;
      uint voteCount;
  }
   constructor() public{
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    // store a candidate
    //mapping in solidity is like a hashtable with key-value pairs. mapping(key=>value)
    //in solidity, there is no way to get the size of hash table
    //or to iterate the mapping. if there is an invalid id as key, blank is returned, thus we cannot
    //know how big is the mapping. 
    // fetch candidates
    mapping(uint=>Candidate) public candidates; // solidity gives a getter function
    // store candidates count
    uint public candidatesCount;
    
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}