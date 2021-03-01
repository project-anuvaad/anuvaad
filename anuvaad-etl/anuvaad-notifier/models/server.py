import json
import socket
import multiprocessing
from config import app_host, app_port, HEADER, FORMAT, DISCONNECT_MESSAGE
from anuvaad_auditor.loghandler import log_exception, log_info



class Server :
    def __init__(self):
        self.HOST = app_host
        self.PORT = app_port
        try:
            self.SERVER_SOCKET = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            print("[SOCKET CREATION] Socket creation successful.", self.SERVER_SOCKET)
            log_info("[SOCKET CREATION] Socket creation successful.", self.SERVER_SOCKET)
        except socket.error as err:
            log_exception("[EXCEPTION] Exception while Socket creation : " + str(err), None, err)

    def bind_server(self):
        ADDR = (self.HOST, self.PORT)
        print("ADDR: ", ADDR)
        print("SERVERSOCKET: ", self.SERVER_SOCKET)
        self.SERVER_SOCKET.bind(ADDR)
        print("[STARTING] Server is starting....", self.SERVER_SOCKET)
        log_info("[STARTING] Server is starting....", self.SERVER_SOCKET)


    def start_socket(self):
        self.SERVER_SOCKET.listen()
        print("[LISTENING] Server is listening on %s",self.HOST, self.SERVER_SOCKET)
        log_info("[LISTENING] Server is listening on %s" % self.HOST, self.SERVER_SOCKET)
        while True:
            print("ENTERED THE WHLE LOOP")
            conn, addr = self.SERVER_SOCKET.accept()
            print("SOCKET ACCEPT")
            process = multiprocessing.Process(target=self.handle_client, args=(conn, addr))
            process.start()
            print(f"[ACTIVE CONNECTIONS] {multiprocessing.active_children() }")
            # log_info("[ACTIVE CONNECTIONS] %s" % (multiprocessing.active_children() - 1), self.SERVER_SOCKET)


    def handle_client(self, conn, addr):
        print(f"[NEW CONNECTION] {addr} connected.")
        # log_info("[NEW CONNECTION] %s connected." % self.HOST, self.SERVER_SOCKET)

        connected = True
        while connected:
            msg_length = conn.recv(HEADER).decode(FORMAT)

            if msg_length:
                msg_length = int(msg_length)
                msg = conn.recv(msg_length).decode(FORMAT)


                input_json = json.loads(msg)
                print("TYPE DUMP:", type(input_json))
                print("getting the userid", input_json['userid'])



                if msg == DISCONNECT_MESSAGE:
                    connected = False

                print(f"[{addr}] {msg}")
                ack_msg = "[SERVER] bulk search response for userid: " + input_json['userid']
                conn.send(ack_msg.encode(FORMAT))

        conn.close()



