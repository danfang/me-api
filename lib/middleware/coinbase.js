var coinbase = require('coinbase');
var cache = require('memory-cache');
var handleError = require('../util/util').handleError;

var DEFAULT_CACHE_MSEC = 1000 * 60 * 60; // 1 hour

var Coinbase = {
  source: 'coinbase',
  routes: [
    {
      method: 'GET',
      path: '',
      handler: function(req, res) {
        var cachedResult = cache.get('coinbase');
        if (cachedResult) return res.json(cachedResult);

        this.client.getAccounts({}, function(err, accounts) {
          if (err) return handleError(err, res);

          // Pick the specified account
          var account = accounts.filter(function(account) {
            return account.name == this.accountName;
          }.bind(this))[0];

          if (!account) return handleError('No account found: ' + this.accountName, res);

          // Get txns
          account.getTransactions(null, function(err, txns) {
            if (err) return handleError(err, res);

            // Filter sensitive info
            txns.forEach(function(txn) {
              delete txn.client;
              delete txn.sender;
              delete txn.account;
              delete txn.sender_account;
            });

            // Get addresses people can pay to
            account.getAddresses(null, function(err, addrs) {
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
