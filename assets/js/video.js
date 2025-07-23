let nextPageToken = '';
let prevPageToken = '';

function loadVideos(pageToken = '') {
	document.getElementById('spinner').style.display = 'block';
	document.getElementById('videoContainer').innerHTML = '';
	fetch('youtube-feed.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'pageToken=' + encodeURIComponent(pageToken)
	}).then(res => res.json()).then(data => {
		const container = document.getElementById('videoContainer');
		container.innerHTML = '';
		document.getElementById('spinner').style.display = 'none';
		data.videos.forEach(video => {
			container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card video-card h-100">
                    <div class="video-embed">
                        <iframe src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title">${video.title}</h6>
                    </div>
                </div>
            </div>`;
		});
		// Update tokens
		nextPageToken = data.nextPageToken || '';
		prevPageToken = data.prevPageToken || '';
		document.getElementById('nextBtn').style.display = nextPageToken ? 'inline-block' : 'none';
		document.getElementById('prevBtn').style.display = prevPageToken ? 'inline-block' : 'none';
	}).catch(err => {
		document.getElementById('spinner').style.display = 'none';
		alert('Failed to load videos.');
		console.error(err);
	});
}
document.getElementById('nextBtn').onclick = () => loadVideos(nextPageToken);
document.getElementById('prevBtn').onclick = () => loadVideos(prevPageToken);
// Initial load
loadVideos();