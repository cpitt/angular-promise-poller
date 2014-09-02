'use strict'

describe('Promise Poller', function(){

  var pollerFunction, pollerPromise, $q, callback

  beforeEach(function(){
    module('cpitt.promisePoller');

    inject(function(_$q_){
       $q = _$q_
    })

    pollerFunction = function(){ return 'ABC'}
    pollerPromise  = function () {
      $q(function(resolve, reject){
        resolve(pollerFunction())
      })
    }

    callback = function(result){
      return result
    }
  });

  describe('PollerFactory', function(){
    var PollerFactory;

    beforeEach(function(){
      inject(function(_PollerFactory_){
        PollerFactory = _PollerFactory_;
      })
    })

    it('should instantiate and return a single poller', function(){
      var poller = PollerFactory.newPoller(pollerFunction, 500)
      expect(poller).toBeDefined();
    })

    describe('Poller', function(){
      var poller, $interval
      beforeEach(function(){
        poller = PollerFactory.newPoller(pollerFunction, 500, callback)
        inject(function(_$interval_){
          $interval = _$interval_;
        })
      })

      it('should have pollerFunction', function(){
        expect(poller.pollerFunction).toEqual(jasmine.any(Function))
      })

      it('should have freq', function(){
        expect(poller.freq).toEqual(jasmine.any(Number))
      })

      it('should have pollerPromise', function(){
        expect(poller.pollerPromise.then).toBeDefined()
      })

      it('should execute its callback', function(){
       var called = 0
       var response;
       var counterCallback = function(resp){
         called++
         response = resp
       }
       var poller = PollerFactory.newPoller(pollerFunction, 500, counterCallback)
       poller.start()

       $interval.flush(1000)
       expect(called).toEqual(2)
       expect(response).toEqual(pollerFunction())
      })

      it('should stop itself', function(){
        poller.stop()
        expect(poller.intervalPromise).not.toBeDefined();
      })

      it('should start itself', function(){
        poller.stop();
        poller.start();
        expect(poller.intervalPromise).toBeDefined();
      })

      it('should restart itself', function(){
        spyOn(poller, 'stop');
        spyOn(poller, 'start');
        poller.restart();
        expect(poller.stop).toHaveBeenCalled();
        expect(poller.start).toHaveBeenCalled();
      })


    })
  });

  describe('PollerService', function(){
    var PollerService;

    beforeEach(function(){
      inject(function(_PollerService_){
        PollerService = _PollerService_;
      });
    })

    it('should have the correct number of pollers', function(){
      PollerService.create(pollerFunction, 500 , callback)
      PollerService.create(pollerFunction, 500, callback)
      expect(PollerService.pollers.length).toEqual(2)
    })

    it('should stop all pollers', function(){
      var p1 = PollerService.create(pollerFunction, 500 , callback)
      var p2 = PollerService.create(pollerFunction, 500, callback)

      spyOn(p1, 'stop')
      spyOn(p2, 'stop')

      PollerService.stopAll();

      expect(p1.stop).toHaveBeenCalled();
      expect(p2.stop).toHaveBeenCalled();
    })

    it('should restart all pollers', function(){
      var p1 = PollerService.create(pollerFunction, 500 , callback)
      var p2 = PollerService.create(pollerFunction, 500, callback)

      spyOn(p1, 'restart')
      spyOn(p2, 'restart')

      PollerService.restartAll();

      expect(p1.restart).toHaveBeenCalled();
      expect(p2.restart).toHaveBeenCalled();
    })
  })

});
