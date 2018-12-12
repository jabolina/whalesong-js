const { WhatsApp } = require("whalesong-js");

(async () => {
    const whatsappClient = new WhatsApp(true);
    await whatsappClient.build();

    let connected = false;

    const stream = await whatsappClient.getSubManager("stream").monitorField("stream");
    const messages = await whatsappClient.getSubManager("messages").monitorNew();
    const chats = whatsappClient.getSubManager("chats");
    const chatStore = new Map();

    stream.getResult().on("message", (result) => {
        const { value } = result;

        if (value === "CONNECTED" && !connected) {
            connected = true;

            messages.getResult().on("message", async (message) => {
                const { item } = message;
                if (!item.isNotification) {
                    console.log(`New message: [${item.body}] from [${item.chat.contact.pushname}]`);
                    
                    if (!chatStore.has(item.chat.id)) {
                        const chat = await chats.getItemById(item.chat.id);
                        chatStore.set(item.chat.id, chat);
                    }

                    (await chatStore.get(item.chat.id).sendSeen());
                    (await chatStore.get(item.chat.id).sendText(item.body, item.id));
                }
            }).on("error", (error) => {
                console.error(`Error listening new messages: ${error.stack}`);
            });
        }
    }).on("error", (error) => {
        console.error(`Error on stream: ${error.stack}`);
    })
})();
