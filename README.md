# Angular Promise Poller

Polls promises (or functions) on a given interval

# Usage 
```javascript
angular.module('myApp',['cpitt.poller']);
angular.module('myApp')
  .controller('MyCtrl',
    [          'PollerService', '$q',
     function( PollerService,    $q ){
       //With a promise
       var derpPromise = function(){
          var deferred = $q.defer()
          setTimeout(function(){
            deferred.resolve(Math.random())
          }, 1000)
          return deferred.promise
       }
      
      var poller = PollerService.create(derpPromise, 
                                        500, 
                                        function(derp){ $scope.derp = derp });

      //with function
      var herpFunction = function(){
          setTimeout(function(){
            deferred.resolve(Math.random())
          }, 1000)
      }
      var poller2 = PollerService.create(herpFunction, 
                                         5000,
                                         function(herp){ $scope.herp = herp });

     }]
  )
  
```

# TODO
* Tests
* Complete Documentation
* Bowerize
