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
   console.log('hello');
     $.getJSON("Election.json", function(election){
      //Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      //connect proivder to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      return App.render();
    });
  },

  //laysout all the content on the page
  render: function(){
      var electionInstance;
      var loader = $("#loader");
      var content = $("#content");

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
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        for(var i=1; i<=candidatesCount; i++){
          electionInstance.candidates(i).then(function(candidate){
            var id = candidate[0];
            var name = candidate[1];
            var voteCount = candidate[2];

            //render candidate result
            var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
            candidatesResults.append(candidateTemplate);
          });
        }
        loader.hide();
        content.show();
      }).catch(function(err){
        console.warn(err);
      })

  }
};
$(function() {
  $(window).load(function() {
    App.init();
  });
});
