App = {
  web3Provider : null,
  contracts : {},
  account : '0x0',

  init: function(){
    return App.initWeb3();
  },

  initWeb3: function(){
   
    if(typeof web3 !== 'undefined'){
      //if a web3 instance is already provided by metamask
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else{
   
      //specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  //loads out contract into the front end application, so that we can use it
  initContract: function(){
     //we have a browser sync package and it is configured to read json files in the build directory
  //  console.log('hello');
     $.getJSON("Election.json", function(election){
      //Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      //connect proivder to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      // App.listenForEvents();
      return App.render();
    });
  },

  //listen for events emitted from the contract
  // listenForEvents : function(){
  //   App.contracts.Election.deployed().then(function(instance){
  //     instance.votedEvent({},{
  //       fromBlock : 0,
  //       toBlock : 'latest'
  //     }).watch(function(error,event){
  //       console.log("event triggered",event);
  //       //Reload whenever new vote is recorded
  //       App.render();
  //     })
  //   })
  // },
  //laysout all the content on the page
  render: function(){
    console.log('hi')
      let electionInstance;
      let loader = $("#loader");
      let content = $("#content");

      //as we will be doing asynchronous execution
      loader.show();
      content.hide();

      //load account data
      web3.eth.getAccounts(function(err, account){
        if(err===null){
            App.account = account;
            $("#accountAddress").html("Your account: "+account);
        }
      });
      //load contracts data
      App.contracts.Election.deployed().then(function(instance){
          electionInstance = instance;
          return electionInstance.candidatesCount();
      }).then(function(candidatesCount){
        let candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        let candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();

        for(let i=1; i<=candidatesCount; i++){
          electionInstance.candidates(i).then(function(candidate){
            let id = candidate[0];
            let name = candidate[1];
            let voteCount = candidate[2];

            //render candidate result
            let candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
            candidatesResults.append(candidateTemplate);

            //render candidate ballot option
            let candidateOption = "<option value= '" + id + "'>" + name + "</option>"
            candidatesSelect.append(candidateOption);
          });
        }
        return electionInstance.voters(App.account);
      }).then(function(hasVoted){
        //do not allow the user to vote
        if(hasVoted){
          $('form').hide();
        }
        loader.hide();
        content.show();
      }).catch(function(err){
        console.warn(err);
      })

  },

  // castVote : function(){
  //   let candidateId = $('#candidatesSelect').val();
  //   App.contracts.Election.deployed().then(function(instance){
  //     console.log("hello")
  //     return instance.vote(candidateId,{from:App.account});
  //   }).then(function(result){
  //     //wait for votes to update
  //     console.log("hello");
  //     $('#content').hide();
  //     $('#loader').show();
  //   }).catch(function(err){
  //     console.error(err);
  //   })

  // },

  castVote: function() {
    let candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, {from:App.account});
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
