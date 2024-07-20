document.addEventListener('DOMContentLoaded', () => {
  const qrResult = document.getElementById('qr-result');
  const qrReader = new Html5Qrcode("qr-reader");

  function onScanSuccess(decodedText, decodedResult) {
    qrResult.textContent = `QR Code Result: ${decodedText}`;
    qrReader.stop().catch((err) => {
      console.error("Failed to stop the scanner", err);
    });
  }

  function onScanError(errorMessage) {
    console.error(`QR Code Scan Error: ${errorMessage}`);
  }

  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  function startScanner() {
    qrReader.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanError
    ).catch((err) => {
      console.error("Failed to start the scanner", err);
      qrResult.textContent = 'Failed to start QR Code scanner. Check your permissions.';
    });
  }

  document.getElementById('reload').addEventListener('click', () => {
    qrReader.stop().then(() => {
      startScanner();
    }).catch((err) => {
      console.error("Failed to stop the scanner", err);
      qrResult.textContent = 'Failed to reload the scanner. Check console for errors.';
    });
  });

  startScanner();
});
