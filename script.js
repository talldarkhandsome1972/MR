// script.js ---------------------------------------------------------
const startBtn = document.getElementById('startBtn');
const stopBtn  = document.getElementById('stopBtn');
const output   = document.getElementById('output');

let watchId = null; // will hold the ID returned by watchPosition

/**
 * Success callback – receives a Position object.
 */
function success(pos) {
    const { latitude, longitude } = pos.coords;

    // Build a friendly message
    const msg = `📍 You are at:<br>
        Latitude: ${latitude.toFixed(6)}°<br>
        Longitude: ${longitude.toFixed(6)}°`;

    output.innerHTML = msg;
}

/**
 * Error callback – runs when the user denies permission or another error occurs.
 */
function error(err) {
    console.error(`Geolocation error (${err.code}): ${err.message}`);

    // Show a short warning, but keep the button enabled so they can try again
    output.innerHTML = `<p style="color:red;">❗️ Unable to get location: ${err.message}</p>`;
}

/**
 * Starts watching the device's position.
 */
function startTracking() {
    if ('geolocation' in navigator) {
        // Ask for permission – this is the only time the browser asks the user.
        navigator.geolocation.watchPosition(
            success,
            error,
            {
                enableHighAccuracy: true,   // try to get GPS level precision
                timeout: 10_000,           // max wait (ms) before it gives up
                maximumAge: 0               // never use a cached position
            }
        );

        startBtn.disabled = true;
        stopBtn.disabled  = false;

        output.innerHTML = '🔄 Getting your location…';
    } else {
        output.innerHTML = `<p>❗️ Geolocation API is not supported by this browser.</p>`;
    }
}

/**
 * Stops the continuous watch.
 */
function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;

        startBtn.disabled = false;
        stopBtn.disabled  = true;

        output.innerHTML = '✅ Stopped. You can now go back to the main page.';
    }
}

/* ------------------------------------------------------------------ */
startBtn.addEventListener('click', startTracking);
stopBtn.addEventListener('click', stopTracking);
