const { WhatsApp } = require("whalesong-js");

(async () => {
    const whatsappClient = new WhatsApp(false);
    await whatsappClient.build();

    let connected = false;

    const stream = await whatsappClient.getSubManager("stream").monitorField("stream");
    const messages = await whatsappClient.getSubManager("messages");
    const chats = whatsappClient.getSubManager("chats");
    const chatStore = new Map();

    stream.getResult().on("message", async (result) => {
        const { value } = result;

        if (value === "CONNECTED" && !connected) {
            console.log("Phone connected");
            connected = true;

            const messageStream = await messages.monitorNew();

            messageStream.getResult().on("message", async (message) => {
                const { item } = message;
                if (!item.isNotification) {
                    if (!chatStore.has(item.chat.id)) {
                        const chat = await chats.getItemById(item.chat.id);
                        chatStore.set(item.chat.id, chat);
                    }

                    const chat = chatStore.get(item.chat.id);

                    (await chat.sendSeen());

                    if (item.isMedia || item.isMMS) {
                        const model = (await messages.getItemById(item.id));
                        const media = await model.downloadMedia(item);
                        
                        console.log(`New ${item.type} message from ${item.chat.contact.pushname}`);

                        await chat.sendMedia(media.toString("base64"), item.mimetype, "", "", item.id);
                    } else {
                        console.log(`New message: [${item.body}] from [${item.chat.contact.pushname}]`);
                        (await chat.sendText(item.body, item.id));
                    }
                }
            }).on("error", (error) => {
                console.error(`Error listening new messages: ${error.stack}`);
            });
        }
    }).on("error", (error) => {
        console.error(`Error on stream: ${error.stack}`);
    });
})();
