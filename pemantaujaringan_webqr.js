// pemantaujaringan_webqr.js

document.getElementById('reload').addEventListener('click', function() {
    startScanning();
});

function startScanning() {
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('qr-canvas');
    const context = canvas.getContext('2d');
    const resultElement = document.getElementById('qr-result');
    
    // Stop existing video stream if any
    if (video.srcObject) {
        let stream = video.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }

    const constraints = {
        video: {
            facingMode: 'environment'
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.play();

            // Start scanning loop
            requestAnimationFrame(scan);

            function scan() {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    // Set canvas dimensions to match video
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    // Draw video frame to canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Get image data from canvas
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                    // Decode QR code
                    const code = jsQR(imageData.data, canvas.width, canvas.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        resultElement.textContent = code.data;
                    } else {
                        resultElement.textContent = "Scanning...";
                    }
                }

                // Continue scanning
                requestAnimationFrame(scan);
            }
        })
        .catch(err => {
            console.error('Error accessing camera: ', err);
            resultElement.textContent = 'Error accessing camera. Please check your permissions.';
        });
}

// Start scanning when the page loads
startScanning();
