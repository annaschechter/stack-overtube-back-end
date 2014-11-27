
$(document).ready(function() {

	var socket = io.connect();
//-------------------------------------------------------------------------
	$('#youtube-channel').submit(function() {
		socket.emit('channel provided', $('#channel').val());
		$('#').val('');
		return false;
	});

	socket.on('channel provided', function(channel) {
		var channelName = channel;
		$.get(
			"https://www.googleapis.com/youtube/v3/channels", {
				part: "contentDetails",
				forUsername: channelName,
				key: 'AIzaSyCqULam0VSTR41fYSe0FrPgqIaclGR2qc4'},
				function(data) {
					$.each(data.items, function(i, item) {
						console.log(item);
						var playlistId = item.contentDetails.relatedPlaylists.uploads;
						getVideos(playlistId);
					});
			}
		);

		function getVideos(playlistId) {
			$.get(
				"https://www.googleapis.com/youtube/v3/playlistItems", {
					part: 'snippet',
					maxResults: 10,
					playlistId: playlistId,
					key: 'AIzaSyCqULam0VSTR41fYSe0FrPgqIaclGR2qc4'},
					function(data) {
						var output;
						$.each(data.items, function(i, item) {
							console.log(item);
							var videoTitle = item.snippet.title;
							var videoId = item.snippet.resourceId.videoId;
							output = '<li><iframe src=\"//www.youtube.com/embed/'+videoId+'\"></iframe></li>';
							$('#results').append(output);
						});
				}
			);

		};
	});

//--------------------------------------------------------------------------------------------------

	$('#video-upload').submit(function() {
		socket.emit('video upload', $('#newupload').val());
			$('#').val('');
			return false;
	});

});
