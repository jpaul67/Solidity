(function (Contract) {
    var web3_instance;
    var instance;
    var accounts;

    function init(cb) {
        web3_instance = new Web3(
            (window.web3 && window.web3.currentProvider) ||
            new Web3.providers.HttpProvider(Contract.endpoint));

        accounts = web3.eth.accounts;

        var contract_interface = web3_instance.eth.contract(Contract.abi);
        instance = contract_interface.at(Contract.address);
        cb();
    }

    function getBalance() {
        instance.getBalance(function (error, result) {
            if(error){
              alert(error);
            }
            else{
              $("#balance").html(result.toString());
            }
        });
    }

    function waitForReceipt(txHash, cb){
      web3_instance.eth.getTransactionReceipt(txHash, function(err, receipt){
        if(error){
          alert(err);
        }
        else if(receipt !== null){
          cb(receipt);
        }
        else{
          window.setTimeout(function(){
            waitForReceipt(txHash, cb);
          }, 5000);
        }
      })
    }

    function flip(){
      let val = parseInt($("#bet").val());
      instance.flip.sendTransaction({from: accounts[0], gas:100000, val}, function(error, txHash){
        if(error){
          alert(error);
        }
        else{
            waitForReceipt(txHash, function(receipt){
              if(receipt.status === "0x1"){
                alert(JSON.stringify(receipt));
              }
              else{
                alert("receipt status fail");
              }
            });
        }
      })
    }

    $(document).ready(function () {
          init(function () {
              getBalance();
          });
          $("#submit").click(function(){
            flip();
          })
      });
})(Contracts['Coinflip']);
