var circle;

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic', 
  'ngCordova',
  'starter.controllers', 
  'starter.services', 
  'starter.database'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.run(function($ionicPlatform, $cordovaSplashscreen, DB) {
  circle = new ProgressBar.Circle('#progress-bar', {
    color: '#000000',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 10,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 2500,

    from: { color: '#aaa', width: 1 },
    to: { color: '#666', width: 10 },
    // Set default step function for all animate calls
    step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
    }, 
    step: function(state, bar){
      bar.setText((bar.value() * 100).toFixed(0))
    }
  });

  DB.init().then(function() {
    circle.animate(1, function() {
      $('#progress-bar').hide();
      $('.app').show();
    });
  }, function(err) {
    console.log(err);
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.input', {
    url: '/input',
    views: {
      'tab-input': {
        templateUrl: 'templates/tab-input.html',
        controller: 'InputCtrl'
      }
    }
  })
  
  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('tab.search-detail', {
      url: '/search/:range',
      views: {
        'tab-search': {
          templateUrl: 'templates/search-detail.html',
          controller: 'SearchDetailCtrl'
        }
      }
  })

  .state('tab.information', {
    url: '/information',
    views: {
      'tab-information': {
        templateUrl: 'templates/tab-information.html',
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/input');

});
