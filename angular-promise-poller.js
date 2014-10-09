'use strict';
angular.module('cpitt.promisePoller', [])
  .run(
    [        '$rootScope', 'PollerService',
    function( $rootScope,   PollerService){

      $rootScope.$on('$routeChangeStart', function(){
        PollerService.stopAll();
      });

      $rootScope.$on('$stateChangeStart', function(){
        PollerService.stopAll();
      });

    }])

  .factory('PollerFactory',
    [        '$interval', '$q',
    function( $interval,   $q ){
      var Poller = function (pollerFunction, freq, callback){
        this.pollerFunction = pollerFunction;
        this.freq = freq;
        this.callback = callback;

        this.createPollerPromise = function(){
          return typeof pollerFunction === 'function' ? $q.when(pollerFunction()) : $q.when(pollerFunction);
        };

        this.pollerPromise = this.createPollerPromise();
      };


      Poller.prototype.start = function() {
        var that = this,
            run  = true;
        var tick = function(){
          if(run){
              run = false;
              that.pollerPromise.then(function(result){
                run = true;
                if(that.callback){ that.callback(result);}
                that.pollerPromise = that.createPollerPromise();
              });
          }
        };
        this.intervalPromise = $interval(tick, this.freq);
      };

      Poller.prototype.stop = function(){
        if(angular.isDefined(this.intervalPromise)){
          $interval.cancel(this.intervalPromise);
          this.interval = undefined;
        }
      };

      Poller.prototype.restart = function(){
        this.stop();
        this.start();
      };

      return {
         newPoller: function(pollerFunction, freq, callback){
           return new Poller(pollerFunction, freq, callback);
         }
      };
    }]
  )

  .service('PollerService',
    [        'PollerFactory',
    function( PollerFactory ){
      this.pollers = [];

      this.create = function(pollerFunction, freq, callback){
        var poller = PollerFactory.newPoller(pollerFunction, freq, callback);
        this.pollers.push(poller);
        poller.start();
        return poller;
      };

      this.restartAll = function(){
        angular.forEach(this.pollers, function(poller){
          poller.restart();
        });
      };

      this.stopAll = function(){
        angular.forEach(this.pollers, function(poller){
          poller.stop();
        });
      };
    }]
  );
