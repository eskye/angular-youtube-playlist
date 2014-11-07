/*! Controllers */
var YouTubeController = angular.module('youtubeApp', ['ngAnimate']);

YouTubeController.controller('PlaylistController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {

    var playlistID = 'PLYNJbyJdEK4wsCDt3Tp4MRvX6qqLWT9H5';

    $http.get('http://gdata.youtube.com/feeds/api/playlists/' + playlistID + '?v=2&alt=jsonc')
        .success(function(data, status, headers, config) {
            // Get all data
            $scope.playlist = data;

            // Get first video ID 
            $scope.defaultItem = data.data.items[0].video.id;
            // Set first video ID and trust the resource URL
            $scope.itemURL = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + $scope.defaultItem);

            // Set first item in array as selected
            $scope.selected = 0;

            // ng-click function for itemID, create URL and set as trusted
            $scope.itemID = function(id, $event, index){
                $event.preventDefault();
                $scope.itemURL = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + id);

                // index, for ng-click we set the class active
                $scope.selected = index;
            };
        })
        .error(function(data, status, headers, config) {
            console.log('Dear Developer, An Error Occured :p');
            $scope.errorMessage = 'An Error has occured, please try again later. Status ' + status + '.';
        });
}]);
