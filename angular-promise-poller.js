angular.module('cpitt.promisePoller', [])

  .factory('PollerFactory',
    [        '$interval', '$q',
    function( $interval,   $q ){
      var Poller = function (pollerFunction, freq, callback){
        this.pollerFunction = pollerFunction;
        this.freq = freq;
        this.callback = callback;
        //wrap the function or promise in a new promise
        this.pollerPromise = $q.when(pollerFunction);
      }

      Poller.prototype.start = function() {
        var self = this,
            run  = true;
        var tick = function(){
          if(run){
              run = false
              self.pollerPromise.then(function(result){
                run = true;
                self.callback(result);
                self.pollerPromise = $q.when(self.pollerFunction()); //reset the promise
              })
          }
        }
        this.intervalPromise = $interval(tick, this.freq);
      }

      Poller.prototype.stop = function(){
        if(angular.isDefined(this.intervalPromise)){
          $interval.cancel(this.intervalPromise);
          this.interval = undefined;
        }
      }

      Poller.prototype.restart = function(){
        this.stop();
        this.start();
      }

      return {
         newPoller: function(pollerFunction, freq, callback){return new Poller(pollerFunction, freq, callback)}
      }
    }]
  )

  .service('PollerService',
    [        'PollerFactory',
    function( PollerFactory ){
      this.pollers = [];

      this.create = function(pollerFunction, freq, callback){
        poller = PollerFactory.newPoller(pollerFunction, freq, callback)
        this.pollers.push(poller)
        poller.start()
        return poller;
      }

      this.restartAll = function(){
        angular.forEach(this.pollers, function(poller){
          poller.restart();
        })
      }

      this.stopAll = function(){
        angular.forEach(this.pollers, function(poller){
          poller.stop();
        })
      }
    }]
  )
