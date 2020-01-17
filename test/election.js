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

    });

    it("allows a voter to cast a vote", function(){
        return Election.deployed().then(function(instance){
            electionInstance=instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, {from: accounts[0]});
        }).then(function(receipt){
            // assert.equal(receipt.logs.length,1,"an event is triggered")
            // assert.equal(receipt.logs[0].event,"votedEvent","the event type is correct")
            // assert.equal(receipt.logs[0].args._candidateId.toNumber(),candidateId,"candidateId is correct")
            return electionInstance.voters(accounts[0])
        }).then(function(voted){
            assert(voted,"the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            let voteCount = candidate[2];
            assert.equal(voteCount,1,"increments the candidate's vote count")
        })
    });

    it("throws an exception for invalid candidates", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.vote(99,{from:accounts[1]});
        }).then(assert.fail)
        .catch(function(error){
            assert(error.message.indexOf('revert')>=0,"error message must contain revert");
            return electionInstance.candidates(1);
        })
        .then(function(candidate1){
            let voteCount = candidate1[2];
            assert.equal(voteCount,1,"candidate1 did not recieve any votes");
            return electionInstance.candidates(2);
        })
        .then(function(candidate2){
            let voteCount = candidate2[2];
            assert.equal(voteCount,0,"candidate2 did not recieve any votes");
        })
    });

    it("throws an exception for double voting", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId,{from:accounts[1]});
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            let voteCount = candidate[2];
            assert.equal(voteCount,1,"accepts first vote");
            //trying to vote again
            return electionInstance.vote(candidateId,{from : accounts[1]});
        }).then(assert.fail)
        .catch(function(error){
            assert(error.message.indexOf('revert')>=0,"error message must contain revert");
            return electionInstance.candidates(1);
        })
        .then(function(candidate1){
            let voteCount = candidate1[2];
            assert.equal(voteCount,1,"candidate1 did not receive any votes")
            return electionInstance.candidates(2);
        })
        .then(function(candidate2){
            let voteCount = candidate2[2];
            assert.equal(voteCount,1,"candidate2 did not receive any votes")
        })

    })

});

