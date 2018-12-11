import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "components/App";

ReactDOM.render(<App />, document.getElementById("root"));

if ("serviceWorker" in navigator && location.protocol === "https:") {
    /*tslint:disable no-console*/
    window.addEventListener("load", async () => {
        try {
            const registration = await navigator.serviceWorker.register("/service-worker.js");
            console.log("SW registered", registration);
        } catch (registrationError) {
            console.log("SW registration failed: ", registrationError);
        }
    });
    /*tslint:enable no-console*/
}
