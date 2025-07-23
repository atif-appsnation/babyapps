<?php
header('Content-Type: application/json');

$API_KEY = 'AIzaSyAQF6LxBn2Ft9JpvJlbXtZmlXiilNjMeuI';
$CHANNEL_ID = 'UCQpfMyDLzbzgeOyLPzLNAgQ';
$maxResults = 12;

$pageToken = $_POST['pageToken'] ?? '';

// Step 1: Get uploads playlist
$channel_api = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=$CHANNEL_ID&key=$API_KEY";
$channel_data = json_decode(file_get_contents($channel_api), true);

if (!isset($channel_data['items'][0]['contentDetails']['relatedPlaylists']['uploads'])) {
    echo json_encode(['error' => 'Failed to fetch channel data']);
    exit;
}

$playlist_id = $channel_data['items'][0]['contentDetails']['relatedPlaylists']['uploads'];

// Step 2: Get videos
$videos_api = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=$playlist_id&maxResults=$maxResults&key=$API_KEY";
if ($pageToken) {
    $videos_api .= "&pageToken=" . urlencode($pageToken);
}

$videos_data = json_decode(file_get_contents($videos_api), true);

$response = [
    'videos' => [],
    'nextPageToken' => $videos_data['nextPageToken'] ?? null,
    'prevPageToken' => $videos_data['prevPageToken'] ?? null
];

foreach ($videos_data['items'] as $video) {
    $response['videos'][] = [
        'id' => $video['snippet']['resourceId']['videoId'],
        'title' => $video['snippet']['title']
    ];
}

echo json_encode($response);
?>