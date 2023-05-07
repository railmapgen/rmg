type MessageEventHandler = (event: MessageEvent) => void;
const channels: MockBroadcastChannel[] = [];

export class MockBroadcastChannel {
    name: string;
    eventHandlers: MessageEventHandler[] = [];

    constructor(channelName: string) {
        this.name = channelName;
        channels.push(this);
    }

    postMessage(message: any) {
        channels.forEach(channel => {
            if (channel !== this && channel.name === this.name) {
                channel.eventHandlers.forEach(handler => handler({ data: message } as any));
            }
        });
    }

    set onmessage(handler: MessageEventHandler) {
        this.eventHandlers = [handler];
    }

    addEventHandler(type: string, handler: MessageEventHandler) {
        if (type === 'message') {
            this.eventHandlers.push(handler);
        }
    }

    close() {
        const channelIndex = channels.findIndex(channel => channel === this);
        if (channelIndex >= 0) {
            channels.splice(channelIndex, 1);
        }
    }
}
