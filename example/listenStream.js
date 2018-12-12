const { WhatsApp } = require("whalesong-js");

(async() => {
    const whatsappClient = new WhatsApp(true);

    await whatsappClient.build();
    const stream = whatsappClient.getSubManager("stream");

    (await stream.monitorField("stream")).getResult().on("message", async (result) => {
        const { value } = result;

        console.log(`Status: ${value}`);
    });
})();
