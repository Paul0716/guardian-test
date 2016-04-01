angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $emergency, settings, $cordovaGeolocation, $userLocation, $interval) {

	// $emergency.init(settings.kinvey).then(function(activeUser){
	// 	console.log("activeUser: ", JSON.stringify(activeUser) );
	// 	$emergency.send({
	// 		"name": "Paul Ku",
	// 		"type": {
	// 			"sms": true,
	// 			"email": false
	// 		},
	// 		"sms":	{
	// 			"from"	: "886912994172",
	// 			"to"	: ["886912994172"],
	// 			"text"	: "Come on baby. 12345678."
	// 		},
	// 		"email": {
	// 			"from"	: "paul@donz.tw",
	// 			"to"	: ["justlove0714@hotmail.com"],
	// 			"text"	: "Come on baby. 12345678."
	// 		}
	// 	});
	// }, function(error){
	// 	console.log("error: ", error);
	// });



	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {

		// $emergency.init(settings.kinvey).then(function(activeUser){
			
		// 	if( activeUser ){
		// 		console.log("activeUser: ", JSON.stringify(activeUser) );		
		// 	} else {
		// 		$emergency.login({
		// 			username: "paulku",
		// 			password: "justlove0738"
		// 		}).then(function(activeUser){
		// 			console.log("Login success activeUser: ", JSON.stringify(activeUser) );		
		// 		}, function(error){
		// 			console.log("Login error:", JSON.stringify(error) );		
		// 		});
		// 	}
		// }, function(error){
		// 	console.log("error: ", error);
		// });

		// var posOptions = {timeout: 10000, enableHighAccuracy: false};
		// $scope.coords = {};
		// stop = $interval(function() {
		// 	$cordovaGeolocation
		// 		.getCurrentPosition(posOptions)
		// 		.then(function (position) {

		// 			if( $scope.coords === position.coords ) {
		// 				// do nothing
		// 			} else {
		// 				$scope.coords = position.coords;
		// 				$userLocation
		// 					.init(settings.kinvey)
		// 					.then(function(){
		// 						$userLocation.send({
		// 							username	: 	"Paul Ku",
		// 							latitude	: 	position.coords.latitude,
		// 							longitude	: 	position.coords.longitude,
		// 							speed		: 	position.coords.speed,
		// 							timestamp	: 	moment().unix()
		// 						}).then(function(entity){
		// 							console.log(JSON.stringify(entity));	
		// 						}, function(error){
		// 							console.log("-------> error: ", JSON.stringify(error) );
		// 						});	
		// 					});
		// 			}
					
					
		// 		}, function(err) {
		// 			// error
		// 		});	
		// }, 1000);


		navigator.geolocation.getCurrentPosition(function(position){
			console.log( "navigator: " +JSON.stringify(position) );
		});


		var bgLocationServices =  window.plugins.backgroundLocationServices;

		//Congfigure Plugin
		bgLocationServices.configure({
			//Both
			desiredAccuracy: 45, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
			distanceFilter: 5, // (Meters) How far you must move from the last point to trigger a location update
			debug: true, // <-- Enable to show visual indications when you receive a background location update
			interval: 5000, // (Milliseconds) Requested Interval in between location updates.
			//Android Only
			// notificationTitle: 'BG Plugin', // customize the title of the notification
			// notificationText: 'Tracking', //customize the text of the notification
			// fastestInterval: 5000, // <-- (Milliseconds) Fastest interval your app / server can handle updates
			// useActivityDetection: true // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)
		});

		$scope.lastLocation = {};
		//Register a callback for location updates, this is where location objects will be sent in the background
		bgLocationServices.registerForLocationUpdates(function(location) {
			console.log("We got an BG Update" + JSON.stringify(location), "lastLocation: "+ JSON.stringify($scope.lastLocation) );
			$emergency.init(settings.kinvey).then(function(activeUser){
				if( activeUser ){
					console.log("activeUser: ", JSON.stringify(activeUser) );		
				} else {
					$emergency.login({
						username: "paulku",
						password: "justlove0738"
					}).then(function(activeUser){
						console.log("Login success activeUser: ", JSON.stringify(activeUser) );		
					}, function(error){
						console.log("Login error:", JSON.stringify(error) );		
					});
					$userLocation
						.init(settings.kinvey)
						.then(function(){
							$userLocation.send({
								username	: 	"Paul Ku",
								latitude	: 	location.latitude,
								longitude	: 	location.longitude,
								speed		: 	location.speed,
								timestamp	: 	moment().unix()
							}).then(function(entity){
								$scope.lastLocation = location;
								console.log("Kinvey save data success:" + JSON.stringify(entity));	
							}, function(error){
								console.log("Kinvey save data failed:" + JSON.stringify(error) );
							});	
						});
				}
			}, function(error){
				console.log("error: ", error);
			});

			// if( $scope.lastLocation.latitude === location.latitude && $scope.lastLocation.longitude === location.longitude ){
			// 	return;
			// } else {
				
			// }
			
		}, function(err) {
			console.log("Error: Didnt get an update", err);
		});

		//Register for Activity Updates (ANDROID ONLY)
		//Uses the Detected Activies API to send back an array of activities and their confidence levels
		//See here for more information: //https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity
		// bgLocationServices.registerForActivityUpdates(function(acitivites) {
		// 	console.log("We got an BG Update" + activities);
		// }, function(err) {
		// 	console.log("Error: Something went wrong", err);
		// });

		//Start the Background Tracker. When you enter the background tracking will start, and stop when you enter the foreground.
		bgLocationServices.start();
		
	}
})

.controller('ChatsCtrl', function($scope, Chats) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	$scope.chats = Chats.all();
	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	$scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
