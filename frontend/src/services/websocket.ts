import mitt from 'mitt';

const DEFAULT_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 8000;

const httpBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const wsBase =
	process.env.NEXT_PUBLIC_WS_URL ??
	httpBase.replace(/^http(s?)/, 'ws$1'); // fixes the wsBase bug

export type OutboundSocketMessage = {
	event: 'user_message';
	content: string;
	metadata?: Record<string, unknown>;
};

export type InboundSocketMessage =
	| { event: 'connected'; conversation_id: string }
	| { event: 'assistant_message_started'; message_id: string }
	| { event: 'assistant_message_chunk'; message_id: string; delta: string }
	| { event: 'assistant_message_completed'; message_id: string; content: string; sources?: unknown[] }
	| { event: 'error'; detail: string };

type SocketEvents = {
	open: void;
	close: CloseEvent;
	reconnect: number;
	error: Event;
	message: InboundSocketMessage;
};

class ChatWebSocketClient {
	private socket: WebSocket | null = null;
	private conversationId: string | null = null;
	private shouldReconnect = true;
	private backoff = DEFAULT_BACKOFF_MS;
	private emitter = mitt<SocketEvents>();

	connect(conversationId: string) {
		if (this.conversationId === conversationId && this.socket) {
			return;
		}
		this.shouldReconnect = true;
		this.conversationId = conversationId;

		if (this.socket) {
			this.socket.onclose = null; // prevent reconnection loop
			this.socket.close();
		}

		this.initSocket();
	}

	private initSocket() {
		if (!this.conversationId) return;

		const url = `${wsBase.replace(/\/$/, '')}/ws/chat/${this.conversationId}`;
		this.socket = new WebSocket(url);

		this.socket.onopen = () => {
			this.backoff = DEFAULT_BACKOFF_MS;
			this.emitter.emit('open');
		};

		this.socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data) as InboundSocketMessage;
				this.emitter.emit('message', data);
			} catch (err) {
				console.error('Failed to parse WS message:', err, 'data:', event.data);
			}
		};

		this.socket.onerror = (event) => {
			this.emitter.emit('error', event);
		};

		this.socket.onclose = (event) => {
			this.emitter.emit('close', event);

			if (this.shouldReconnect) {
				const timeout = Math.min(this.backoff, MAX_BACKOFF_MS);

				setTimeout(() => {
					this.emitter.emit('reconnect', timeout);
					this.backoff *= 2;
					this.initSocket();
				}, timeout);
			}
		};
	}

	send(message: OutboundSocketMessage) {
		if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
			console.warn('Tried to send message while socket not open:', message);
			return;
		}
		this.socket.send(JSON.stringify(message));
	}

	close() {
		this.shouldReconnect = false;

		if (this.socket) {
			this.socket.onclose = null; // prevent reconnection
			this.socket.close();
		}

		this.socket = null;
	}
	
	on<EventName extends keyof SocketEvents>(
		event: EventName,
		handler: (evt: SocketEvents[EventName]) => void
	) {
		this.emitter.on(event, handler as any);
		return () => this.emitter.off(event, handler as any);
	}
}

let client: ChatWebSocketClient | null = null;

export const getChatWebSocketClient = () => {
	if (!client) client = new ChatWebSocketClient();
	return client;
};
