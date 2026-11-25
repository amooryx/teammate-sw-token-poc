# teammate.indriver.io - Service Worker token exfiltration PoC

Authorized inDrive HackerOne research by d7a_44.

The live harness at index.html demonstrates that https://teammate.indriver.io/sw.js attaches the raw
Authorization token to any image request whose URL contains the string https://teammate.indriver.io.

The test uses a synthetic token only; it does not read or transmit real credentials.

Run the payload in the DevTools console on a **test account** at https://teammate.indriver.io/.
