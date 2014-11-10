/*! Controllers */
var YouTubeController = angular.module('youtubeApp', ['ngAnimate']);

YouTubeController.controller('PlaylistController', ['$scope', '$http', '$sce', '$filter', function($scope, $http, $sce, $filter) {

    // https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLkkY7rUh56sKCgtAeu0A0zXku1EbkTGNP&maxResults=50&key=key

    var playlistID      = 'PLkkY7rUh56sKCgtAeu0A0zXku1EbkTGNP',
        apiKey          = '',
        maxResults      = 50,
        embedURL        = 'http://www.youtube.com/embed/',
        /* Video Embed Options */
        /* https://developers.google.com/youtube/player_parameters */
        autohide        = 1, // Auto hide the controls
        autoplay        = 0, // Auto play the video on page load
        showinfo        = 0, // Player will not display information like the video title and uploader
        controls        = 2, // Indicates whether the video player controls will display
        modestbranding  = 0, // Do not show a YouTube logo
        rel             = 0, // Indicates whether the player should show related videos when playback of the initial video ends.
        fs              = 1, // Display fullscreen button
        playsinline     = 1, // Controls whether videos play inline or fullscreen in an HTML5 player on iOS.
        cc_load_policy  = 0, // Show closed captions even if user has it disabled
        loop            = 1, // Loop the video, limited to AS3 player
        videoOptions = '?autohide='+autohide+'&autoplay='+autoplay+'&cc_load_policy='+cc_load_policy+'&controls='+controls+'&fs='+fs+'&loop='+loop+'&modestbranding='+modestbranding+'&playsinline='+playsinline+'&rel='+rel+'&showinfo='+showinfo;

    $http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + playlistID + '&maxResults=' + maxResults + '&key=' + apiKey)
        .success(function(data, status, headers, config) {
            // Get all data
            $scope.playlistItems = data.items;

            // Get first video ID
            $scope.firstID = data.items[0].snippet.resourceId.videoId;
            // Set first video ID and trust the resource URL
            $scope.itemURL = $sce.trustAsResourceUrl(embedURL + $scope.firstID + videoOptions);

            // Set first item in array as selected
            $scope.selected = 0;

            // ng-click function for itemID, create URL and set as trusted
            $scope.itemID = function(id, event, index){
                event.preventDefault();

                $scope.itemURL = $sce.trustAsResourceUrl(embedURL + id + videoOptions);

                // index, for ng-click we set the class active
                $scope.selected = index;
            };
        })
        .error(function(data, status, headers, config) {
            console.log('Dear Developer, An Error Occured :p');
            $scope.errorMessage = 'An Error has occured, please try again later. Status ' + status + '.';
        });
}]);