let Election = artifacts.require('./Election.sol');
//accounts is going to inject all the acocuntsthat exist in the development environment
//and we can use these accounts for testing purpose
contract("Election",function(accounts){
    var electionInstance;
//testing if the account was initialised with the correct number of candidates
    it("initializes with two candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount()
        }).then(function(count){
            assert.equal(count,2);
        });
    });

    it("inititalizes the candidates with the correct values", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0],1,"contains the correct id");
            assert.equal(candidate[1],"Candidate 1","contains the correct name");
            assert.equal(candidate[2],0,"contains the correct vote count");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0],2,"contains the correct id");
            assert.equal(candidate[1],"Candidate 2","contains the correct name");
            assert.equal(candidate[2],0,"contains the correct vote count");
        })

    })
});

