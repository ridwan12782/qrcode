document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('qr-canvas');
    const context = canvas.getContext('2d');
    const resultContainer = document.getElementById('qr-result');

    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            requestAnimationFrame(scanQRCode);
        })
        .catch((error) => {
            console.error('Error accessing camera: ', error);
        });
    }

    function scanQRCode() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height, { 
                inversionAttempts: "dontInvert" 
            });
            if (code) {
                resultContainer.textContent = `QR Code Data: ${code.data}`;
            }
        }
        requestAnimationFrame(scanQRCode);
    }

    document.getElementById('reload').addEventListener('click', () => {
        startCamera();
    });

    startCamera();
});
