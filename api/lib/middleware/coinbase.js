var coinbase = require('coinbase');
var cache = require('memory-cache');
var handleError = require('../util/util').handleError;

var DEFAULT_CACHE_MSEC = 1000 * 60 * 60; // 1 hour

var getTransactions = function(account, limit, callback) {
  account.getTransactions(null, limit, function(err, txns) {
    if (err) return callback(err, txns);

    // Filter sensitive info
    txns.forEach(function(txn) {
      delete txn.client;
      delete txn.sender;
      delete txn.account;
      delete txn.sender_account;
    });

    return callback(null, txns);
  });
};

var Coinbase = {
  source: 'coinbase',
  routes: [
    {
      method: 'GET',
      path: '',
      handler: function(req, res) {
        // Check cache first
        var cachedResult = cache.get('coinbase');
        if (cachedResult) return res.json(cachedResult);

        // client created in the pre() function
        this.client.getAccounts(function(err, accounts) {
          if (err) return handleError(err, res);

          // Pick the specified account
          var acct = accounts.filter(function(acct) {
            return acct.name == this.account;
          }.bind(this))[0];

          if (!acct) return handleError('No such account found: ' + this.account, res);

          var btcAccount = coinbase.model.Account(this.client, { id: acct.id });
          var addrLimit = this.addrLimit;

          // Get txns
          getTransactions(btcAccount, this.txnLimit, function(err, txns) {
            if (err) return handleError(err, res);

            // Get addresses people can pay to
            btcAccount.getAddresses(null, addrLimit, null, function(err, addrs) {
              if (err) return handleError(err, res);
              var data = { txns: txns, addrs: addrs.addresses };
              cache.put('coinbase', data, DEFAULT_CACHE_MSEC);
              res.json(data);
            });
          });
        }.bind(this));
      }
    }
  ],
  pre: function(data) {
    data.client = new coinbase.Client(data.secrets);
  }
};

module.exports = Coinbase;
