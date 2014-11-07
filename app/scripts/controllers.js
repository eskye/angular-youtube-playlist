/*! Controllers */
var YouTubeController = angular.module('youtubeApp', ['ngAnimate']);

YouTubeController.controller('PlaylistController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {

    var playlistID = 'PLYNJbyJdEK4wsCDt3Tp4MRvX6qqLWT9H5',
        embedURL = 'http://www.youtube.com/embed/',
        /* Video Embed Options */
        /* https://developers.google.com/youtube/player_parameters */
        autohide        = 1, // Auto hide the controls
        autoplay        = 1, // Auto play the video on page load
        showinfo        = 0, // Player will not display information like the video title and uploader
        controls        = 2, // Indicates whether the video player controls will display
        modestbranding  = 0, // Do not show a YouTube logo
        rel             = 0, // Indicates whether the player should show related videos when playback of the initial video ends.
        fs              = 1, // Display fullscreen button
        playsinline     = 1, // Controls whether videos play inline or fullscreen in an HTML5 player on iOS.
        cc_load_policy  = 0, // Show closed captions even if user has it disabled
        loop            = 1, // Loop the video, limited to AS3 player
        videoOptions = '?autohide='+autohide+'&autoplay='+autoplay+'&cc_load_policy='+cc_load_policy+'&controls='+controls+'&fs='+fs+'&loop='+loop+'&modestbranding='+modestbranding+'&playsinline='+playsinline+'&rel='+rel+'&showinfo='+showinfo;

    $http.get('http://gdata.youtube.com/feeds/api/playlists/' + playlistID + '?v=2&alt=jsonc')
        .success(function(data, status, headers, config) {
            // Get all data
            $scope.playlist = data;

            // Get first video ID 
            $scope.firstID = data.data.items[0].video.id;
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