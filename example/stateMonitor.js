const { WhatsApp } = require("whalesong-js");

(async() => {
    async function checkStream(whatsappClient) {
        console.log("STREAM:");
        const stream = await whatsappClient.getSubManager("stream").getModel();

        console.log(`Stream: ${JSON.stringify(stream.stream, null, 2)}`);
        console.log(`State: ${JSON.stringify(stream.state, null, 2)}`);
    }

    async function checkConn(whatsappClient) {
        console.log("CONNECTION [only have values when an event in WhatsApp is triggered]:")
        const connection = await whatsappClient.getSubManager("conn").getModel();
        
        console.log(`REF: ${JSON.stringify(connection.ref, null, 2)}`);
        console.log(`Battery: ${JSON.stringify(connection.battery, null, 2)}`);
    }

    async function checkStorage(whatsappClient) {
        console.log("STORAGE:");
        const { result } = await whatsappClient.getSubManager("storage").getModel();

        console.log(JSON.stringify(result, null, 2));
    }

    async function monitorStream(stream) {
        const streamEvent = await stream.monitorField("stream");
        streamEvent.getResult().on("message", (result) => {
                console.log(`MONITORING_STREAM: ${JSON.stringify(result, null, 2)}`);
            }).on("error", (error) => {
                console.error(`ERROR: ${error}`);
            });
    }

    async function monitorState(whatsappClient, stream) {
        const stateEvent = await stream.monitorField("state");
        stateEvent.getResult().on("message", async (result) => {
                console.log(`MONITORING_STATE_FOR_QR: ${JSON.stringify(result, null, 2)}`);

                if (result.value === "UNPAIRED_IDLE") {
                    console.log("Refresh QR code.");

                    await stream.poke();

                    const qr = await whatsappClient.qrCode();
                    console.log(`QR B64: ${qr}`);
                }
            }).on("error", (error) => {
                console.error(`ERROR: ${error}`);
            });
    }

    const whatsappClient = new WhatsApp(false);

    await whatsappClient.build();

    await checkStream(whatsappClient);
    await checkConn(whatsappClient);
    await checkStorage(whatsappClient);

    const stream = whatsappClient.getSubManager("stream");

    await Promise.all([monitorStream(stream), monitorState(whatsappClient, stream)]);
})();