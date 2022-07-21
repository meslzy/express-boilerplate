import SocketIo from "socket.io";

interface ServerToClientEvents {
	message: (message: string) => void;
}

interface ClientToServerEvents {
	message: (message: string) => void;
}

interface InterServerEvents {
	ping: () => void;
}

interface SocketData {
	name: string;
}

export type IServer = SocketIo.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type ISocket = SocketIo.Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

class Socket {
	server: IServer;

	constructor() {
		this.server = new SocketIo.Server(server);
	}

	init = async () => {
		this.server.on("connect", this.connect);
	};

	connect = (socket: ISocket) => {
		logger.info(socket.id, "connected");

		socket.on("disconnect", () => {
			logger.info(socket.id, "disconnect");
		});
	};
}

export default Socket;
