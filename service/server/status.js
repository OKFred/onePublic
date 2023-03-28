import os from "os";
console.log(`how are you? Now is ${new Date()}\nTime to serve the public!\n`);

let internalIPAddress = "";

function getInternalIPAddress() {
    let ifaces = os.networkInterfaces();
    for (let dev in ifaces) {
        let iface = ifaces[dev].filter(
            (details) => details.family === "IPv4" && details.internal === false,
        );
        if (iface.length > 0) {
            internalIPAddress = iface[0].address;
            globalThis.internalIPAddress = internalIPAddress;
            console.log("局域网IP：", internalIPAddress);
            break;
        }
    }
}

getInternalIPAddress();
