import "./styles/index.scss";
import {Workbox} from 'workbox-window';

/*
* Connect your service worker here
*/

if ('serviceWorker' in navigator) {
    const wb = new Workbox('./service-worker.js');

    wb.register().then(registration => {
        console.log('SW registered: ', registration);
    }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
    });
}
