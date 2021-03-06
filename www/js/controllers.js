angular.module('starter.controllers', [])

.controller('InputCtrl', function($ionicPlatform, $cordovaToast, $scope, Category, Expense) {
	$scope.min = 1;
	$scope.max = 1000000;
	$scope.categories = {};
	$scope.expense = {};
	
	Category.all().then(function(result) {
		$scope.categories = result;
	}, function(err) {
		console.log(err);
	});

	$scope.insert = function(expense) {
    	Expense.insert(expense).then(function(result) {
      		$cordovaToast.show('Se ha agregado correctamente', 'short', 'center');
    	}, function(err) {
      		$cordovaToast.show(err, 'short', 'center');
    	});
	};
})

.controller('SearchCtrl', function($state, $scope, Timestamp, Expense) {
	$scope.filter = function(data) {
		range = [Timestamp.convert(data.start_date), Timestamp.convert(data.end_date)];

		$state.go('tab.search-detail', { range: JSON.stringify(range) });
	}
})

.controller('SearchDetailCtrl', function($state, $scope, $stateParams, Timestamp, Expense, Category) {
	var range = JSON.parse($stateParams.range);

	Expense.filter(range).then(function(result) {
		$scope.expenses = result;
	});

	$scope.convert = function(timestamp) {
		var date = Timestamp.parse(timestamp);

		return date.toDateString();
	};

	$scope.currency = function(quantity) {
		return '$ ' + quantity.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}
})