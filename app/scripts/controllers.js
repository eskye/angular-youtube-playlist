/*! Controllers */
var youtubeApp = angular.module('youtubeApp', ['ngAnimate']);


youtubeApp.factory('videoData', ['$http', '$rootScope', function($http, $rootScope){
    // https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLkkY7rUh56sKCgtAeu0A0zXku1EbkTGNP&maxResults=50&key=AIzaSyBYf4TUvpSkmuAi0QvfzxxwV9bUXZjDx2E
    var apiKey      = 'AIzaSyBYf4TUvpSkmuAi0QvfzxxwV9bUXZjDx2E',
    videoData       = {};

    videoData.getVideos = function(id, maxResults) {
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


youtubeApp.controller('PlaylistController', ['$scope', '$http', '$sce', '$filter', 'videoData', '$element', function($scope, $http, $sce, $filter, videoData, $element) {
    var plistid = $element[0].attributes.plistid.value,
        maxResults = $element[0].attributes.maxResults;

    maxResults = (maxResults === undefined) ? 25 : maxResults.value;

    videoData.getVideos(plistid, maxResults)
    .success(function(data, status, headers, config) {
        /* Variables : https://developers.google.com/youtube/player_parameters */
        var embedURL    = 'http://www.youtube.com/embed/',
        autohide        = ($scope.autohide === undefined)       ? 1 : $scope.autohide,          // Auto hide the controls
        autoplay        = ($scope.autoplay === undefined)       ? 0 : $scope.autoplay,          // Auto play the video on page load
        showinfo        = ($scope.showinfo === undefined)       ? 0 : $scope.showinfo,          // Player will not display information like the video title and uploader
        controls        = ($scope.controls === undefined)       ? 2 : $scope.controls,          // Indicates whether the video player controls will display
        modestbranding  = ($scope.modestbranding === undefined) ? 0 : $scope.modestbranding,    // Do not show a YouTube logo
        rel             = ($scope.rel === undefined)            ? 0 : $scope.rel,               // Indicates whether the player should show related videos when playback of the initial video ends.
        fs              = ($scope.fs === undefined)             ? 1 : $scope.fs,                // Display fullscreen button
        playsinline     = ($scope.playsinline === undefined)    ? 1 : $scope.playsinline,       // Controls whether videos play inline or fullscreen in an HTML5 player on iOS.
        cc_load_policy  = ($scope.cc_load_policy === undefined) ? 0 : $scope.cc_load_policy,    // Show closed captions even if user has it disabled
        loop            = ($scope.loop === undefined)           ? 1 : $scope.loop,              // Loop the video, limited to AS3 player
        videoOptions = '?autohide='+autohide+'&autoplay='+autoplay+'&cc_load_policy='+cc_load_policy+'&controls='+controls+'&fs='+fs+'&loop='+loop+'&modestbranding='+modestbranding+'&playsinline='+playsinline+'&rel='+rel+'&showinfo='+showinfo;
        /* End Variables */

        $scope.playlistItems = data.items;                                                  // Get Data
        $scope.initSort = $filter('orderBy')($scope.playlistItems, 'snippet.title');        // Set an initial sort for array of data from URI

        $scope.sortField = '-snippet.title';                                                // Sort Order for the ng-repeat on the frontend
        $scope.reverse = true;

        $scope.firstID = $scope.initSort[0].snippet.resourceId.videoId;                     // Get first video ID based on the modified sort order
        $scope.itemURL = $sce.trustAsResourceUrl(embedURL + $scope.firstID + videoOptions); // Set first video ID and trust the resource URL

        $scope.selected = $scope.firstID;                                                   // Set selected item based on its video id

        // ng-click function for itemID, create URL and set as trusted
        $scope.itemID = function(videoId, event){
            event.preventDefault();
            $scope.itemURL = $sce.trustAsResourceUrl(embedURL + videoId + videoOptions);
            $scope.selected = videoId; // index, for ng-click we set the class active by its id
        };
    })
    .error(function(data, status, headers, config) {
        console.log('Dear Developer, An Error Occured: ' + status);
        $scope.errorMessage = 'An Error has occured, please try again later. Status ' + status + '.';
    });
}]);


youtubeApp.directive('ytplaylist', function(){
    var linkFunction = function(scope, element, attributes) {
        scope.autohide          = attributes['autohide'];
        scope.autoplay          = attributes['autoplay'];
        scope.showinfo          = attributes['showinfo'];
        scope.controls          = attributes['controls'];
        scope.modestbranding    = attributes['modestbranding'];
        scope.rel               = attributes['rel'];
        scope.fs                = attributes['fs'];
        scope.playsinline       = attributes['playsinline'];
        scope.cc_load_policy    = attributes['cc_load_policy'];
        scope.loop              = attributes['loop'];
        scope.videoOptions      = attributes['videoOptions'];
    };

    return{
        restrict: 'E',
        scope: {},
        link: linkFunction,
        controller: 'PlaylistController',
        templateUrl: 'ng-templates/ytplaylist.html'
    }
});