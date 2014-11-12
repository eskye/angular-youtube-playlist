/*! Controllers */
var youtubeApp = angular.module('youtubeApp', ['ngAnimate']);


youtubeApp.factory('videoData', ['$http', '$rootScope', function($http, $rootScope){
    // https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLkkY7rUh56sKCgtAeu0A0zXku1EbkTGNP&maxResults=50&key=AIzaSyBYf4TUvpSkmuAi0QvfzxxwV9bUXZjDx2E
    var apiKey      = 'AIzaSyBYf4TUvpSkmuAi0QvfzxxwV9bUXZjDx2E',
    maxResults      = 50,
    videoData       = {};

    videoData.getVideos = function(id) {
        return $http({
            method: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/playlistItems',
            cache: true,
            params: {
                part : 'snippet',
                playlistId : id,
                maxResults : maxResults,
                key : apiKey
            }
        });
    };
    
    return videoData;
}]);


youtubeApp.controller('PlaylistController', ['$scope', '$http', '$sce', '$filter', 'videoData', '$rootScope', function($scope, $http, $sce, $filter, videoData, $rootScope) {
    videoData.getVideos($rootScope.plistid)
    .success(function(data, status, headers, config) {
        /* Video Embed Options */
        /* https://developers.google.com/youtube/player_parameters */
        var embedURL    = 'http://www.youtube.com/embed/',
        autohide        = 1, // Auto hide the controls
        autoplay        = $scope.autoplay, // Auto play the video on page load
        showinfo        = 0, // Player will not display information like the video title and uploader
        controls        = 2, // Indicates whether the video player controls will display
        modestbranding  = 0, // Do not show a YouTube logo
        rel             = 0, // Indicates whether the player should show related videos when playback of the initial video ends.
        fs              = 1, // Display fullscreen button
        playsinline     = 1, // Controls whether videos play inline or fullscreen in an HTML5 player on iOS.
        cc_load_policy  = 0, // Show closed captions even if user has it disabled
        loop            = 1, // Loop the video, limited to AS3 player
        videoOptions = '?autohide='+autohide+'&autoplay='+autoplay+'&cc_load_policy='+cc_load_policy+'&controls='+controls+'&fs='+fs+'&loop='+loop+'&modestbranding='+modestbranding+'&playsinline='+playsinline+'&rel='+rel+'&showinfo='+showinfo;

        $scope.playlistItems = data.items;                                                  // Get Data
        $scope.initSort = $filter('orderBy')($scope.playlistItems, 'snippet.title');        // Set an initial sort for array of data from URI

        $scope.sortField = '-snippet.title';                                                // Sort Order for the ng-repeat on the frontend
        $scope.reverse = true;

        $scope.firstID = $scope.initSort[0].snippet.resourceId.videoId;                     // Get first video ID based on the modified sort order
        $scope.itemURL = $sce.trustAsResourceUrl(embedURL + $scope.firstID + videoOptions); // Set first video ID and trust the resource URL

        $scope.selected = $scope.firstID;                                                   // Set selected item based on its video id

        // ng-click function for itemID, create URL and set as trusted
        $scope.itemID = function(id, event){
            event.preventDefault();
            $scope.itemURL = $sce.trustAsResourceUrl(embedURL + id + videoOptions);
            $scope.selected = id; // index, for ng-click we set the class active by its id
        };
    })
    .error(function(data, status, headers, config) {
        console.log('Dear Developer, An Error Occured: ' + status);
        $scope.errorMessage = 'An Error has occured, please try again later. Status ' + status + '.';
    });
}]);


youtubeApp.directive('ytplaylist', ['$rootScope', function($rootScope){
    var linkFunction = function(scope, element, attributes) {
        $rootScope.plistid = attributes['plistid'];
        scope.autoplay = attributes['autoplay'];
    };

    return{
        restrict: 'E',
        scope: {
            plistid: '&plistid',
            autoplay: '&autoplay'
        },
        templateUrl: 'ytplaylist.html',
        link: linkFunction
    }
}]);