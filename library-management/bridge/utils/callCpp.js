const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

// We configure binary extension for Windows where needed
const BINARY = path.resolve(__dirname, '../../backend/build/library_backend' + (process.platform === 'win32' ? '.exe' : ''));
const DATA_PATH = path.resolve(__dirname, '../../backend/data');

function callCpp(operation, data = {}) {
  return new Promise((resolve, reject) => {
    // Basic pre-check in case user hasn't built C++ backend
    if (!fs.existsSync(BINARY)) {
      console.warn(`WARNING: C++ binary not found at ${BINARY}. Simulating response. Ensure you build the backend.`);
      // Return mocked response for UI dev purposes if C++ part isn't built
      resolve({ success: true, message: "Simulated C++ response. Backend binary not compiled.", mock: true });
      return;
    }

    execFile(BINARY, ['--op', operation, '--data', JSON.stringify(data), '--datapath', DATA_PATH], (err, stdout, stderr) => {
      // Print stderr for logging
      if (stderr) {
        console.error(`[C++ STDERR] ${stderr}`);
      }
      
      let parsed = null;
      try {
        parsed = JSON.parse(stdout.trim());
      } catch (e) {
        return reject(new Error('Invalid JSON from C++ binary: ' + stdout + ' | err: ' + (err?.message || '')));
      }

      if (parsed) {
        resolve(parsed);
      } else if (err) {
        reject(new Error(stderr || err.message));
      } else {
        reject(new Error("Unknown error"));
      }
    });
  });
}

module.exports = { callCpp, DATA_PATH };
