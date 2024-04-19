import net, { Socket, Server } from "net";
import axios, { AxiosRequestConfig } from "axios";
import { TextProcessor } from "./TextProcessor";
let llmResponseText = ""


// This file needs to be converted to a well structured typescript Class



// Store clients using a Map (key: clientId, value: socket)
const clients = new Map();

// Function to generate a unique ID for each client


let textProcessor = new TextProcessor(24, 40)

let userInput = "";

let selectedMode: 0 | 1 | 2 = 0


export type LlamaClient = {
  clientId: string,
  socket: Socket,
  clientMode: 0 | 1 | 2,
  inputBuffer: string,
}

export class LlamaServer {

public readonly server1: Server
public readonly clients: Map<string, LlamaClient> = new Map()


  constructor() {
    this.server1 = await this.initServer(6400)
  }

  public connectionHandler(socket: Socket) {

    const getClientId = (socket) => `${socket.remoteAddress}:${socket.remotePort}`;

    const newClient: LlamaClient = {
      clientId: getClientId(socket),
      socket: socket,
      clientMode: 0,
      inputBuffer: "",
    }

    this.clients.set(newClient.clientId, newClient)

socket.on("data", (data) => {
  const clientId = getClientId(socket);
  console.log(`Data from ${clientId}: ${data}`);
  
  for (let i = 0; i < data.length; i++) {
    console.log(
      `Byte ${i}: ${data[i]} (ASCII ${data.toString(
        "ascii",
        i,
        i + 1
      )} - Value ${data[i]})`
    );

    // Echo
    (selectedMode === 1) && writeToClient(socket, selectedMode, data.toString())

    if (selectedMode === 0) {
      if (data.toString() === "1") {
        selectedMode = 1
      }
      if (data.toString() === "2") {
        selectedMode = 2
        textProcessor = new TextProcessor(25, 80)
      }
      if (selectedMode) {
        commandToClient(socket, selectedMode, "CLR")
        writeToClient(socket, selectedMode, `Mode ${selectedMode} selected.`)
        commandToClient(socket, selectedMode, "CR", 2)
        writeToClient(socket, selectedMode, `Enter your prompt`)
        commandToClient(socket, selectedMode, "CR", 2)
      }
    }

    if (selectedMode) {
      if (data[i] !== 13) {
        try {
          userInput += data.toString("ascii", i, i + 1);
        } catch { }
      } else {
        console.log(`${userInput}`);

        callLLM(userInput, socket);

        userInput = "";
      }
    }
  }

})

  }

  public async initServer(port:number):Promise<Server> {

const server:Server = net.createServer(this.connectionHandler.bind(this));

return new Promise((resolve, reject) => {
// Listen on port 6400
server.listen(6400, () => {
  console.log("Server listening on port 6400");
  resolve(server);
});

// Handling server errors
server.on("error", (err) => {
  console.error(`Server error: ${err.message}`);
  reject(err);
})
})}




    // Create a TCP server
    const server = net.createServer((socket) => {
      const clientId = getClientId(socket);
      console.log(`Client connected: ${clientId}`);
      clients.set(clientId, socket);

      // Send a byte with decimal value 147 before the greeting message CLR screen
      const initialByte = Buffer.from([147]);
      socket.write(initialByte);

      // Send greeting message to the new client
      socket.write("welcome to llama");

      socket.write(Buffer.from([13, 13]))

      socket.write("1 = petscii, 40 chars/line, echo on\r")
      socket.write("2 = ascii, 80 chars/line, echo off\r\r")
      // Handle incoming data from clients
      socket.on("data", (data) => {
        console.log(`Data from ${clientId}: ${data}`);

        for (let i = 0; i < data.length; i++) {
          console.log(
            `Byte ${i}: ${data[i]} (ASCII ${data.toString(
              "ascii",
              i,
              i + 1
            )} - Value ${data[i]})`
          );

          // Echo
          (selectedMode === 1) && writeToClient(socket, selectedMode, data.toString())

          if (selectedMode === 0) {
            if (data.toString() === "1") {
              selectedMode = 1
            }
            if (data.toString() === "2") {
              selectedMode = 2
              textProcessor = new TextProcessor(25, 80)
            }
            if (selectedMode) {
              commandToClient(socket, selectedMode, "CLR")
              writeToClient(socket, selectedMode, `Mode ${selectedMode} selected.`)
              commandToClient(socket, selectedMode, "CR", 2)
              writeToClient(socket, selectedMode, `Enter your prompt`)
              commandToClient(socket, selectedMode, "CR", 2)
            }
          }

          if (selectedMode) {
            if (data[i] !== 13) {
              try {
                userInput += data.toString("ascii", i, i + 1);
              } catch { }
            } else {
              console.log(`${userInput}`);

              callLLM(userInput, socket);

              userInput = "";
            }
          }
        }
      });

      // Handle client disconnection
      socket.on("

// Create a TCP server
const server = net.createServer((socket) => {
  const clientId = getClientId(socket);
  console.log(`Client connected: ${clientId}`);
  clients.set(clientId, socket);

  // Send a byte with decimal value 147 before the greeting message CLR screen
  const initialByte = Buffer.from([147]);
  socket.write(initialByte);

  // Send greeting message to the new client
  socket.write("welcome to llama");

  socket.write(Buffer.from([13, 13]))

  socket.write("1 = petscii, 40 chars/line, echo on\r")
  socket.write("2 = ascii, 80 chars/line, echo off\r\r")
  // Handle incoming data from clients
  socket.on("data", (data) => {
    console.log(`Data from ${clientId}: ${data}`);

    for (let i = 0; i < data.length; i++) {
      console.log(
        `Byte ${i}: ${data[i]} (ASCII ${data.toString(
          "ascii",
          i,
          i + 1
        )} - Value ${data[i]})`
      );

      // Echo
      (selectedMode === 1) && writeToClient(socket, selectedMode, data.toString())

      if (selectedMode === 0) {
        if (data.toString() === "1") {
          selectedMode = 1
        }
        if (data.toString() === "2") {
          selectedMode = 2
          textProcessor = new TextProcessor(25, 80)
        }
        if (selectedMode) {
          commandToClient(socket, selectedMode, "CLR")
          writeToClient(socket, selectedMode, `Mode ${selectedMode} selected.`)
          commandToClient(socket, selectedMode, "CR", 2)
          writeToClient(socket, selectedMode, `Enter your prompt`)
          commandToClient(socket, selectedMode, "CR", 2)
        }
      }

      if (selectedMode) {
        if (data[i] !== 13) {
          try {
            userInput += data.toString("ascii", i, i + 1);
          } catch { }
        } else {
          console.log(`${userInput}`);

          callLLM(userInput, socket);

          userInput = "";
        }
      }
    }
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.delete(clientId);
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error(`Error with client ${clientId}: ${err.message}`);
    clients.delete(clientId);
  });
});

async function callLLM(prompt = "", responseStream) {

  // const model="llama2:latest"
  // const model="llama2:13b"
  const model = "mistral:latest"

  const options: AxiosRequestConfig = {
    method: "POST",
    url: "http://localhost:11434/api/generate",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": '"application/json"',
    },
    data: { model: "llama2", prompt },
    responseType: "stream",
  };

  llmResponseText = ""

  try {
    const llmStream = (await axios(options)).data;

    llmStream.on("data", (data) => {
      const dec = new TextDecoder().decode(data).split("\n");

      for (const lin of dec) {
        //console.log(lin)

        try {
          if (lin === "") {
            continue
          }

          const deltaJSON = JSON.parse(lin);

          const deltaText = deltaJSON?.response;

          if (deltaText && deltaText !== "") {

            llmResponseText += deltaText

            //const textProcessor = new TextProcessor();
            const formattedDelta = textProcessor.addText(deltaText);

            /* if (textProcessor.pages.length === 1) {
               responseStream.write(
                 convertStringToByteArray(textProcessor.flipCase(deltaText.toString()))
               );
             }*/

            writeToClient(responseStream, selectedMode, formattedDelta)
          }
        } catch (e) {
          console.log(e);
        }
      }
    });

    llmStream.on("close", () => { console.log(llmResponseText) })

  } catch (e) {
    console.log(e);
  }

}

function writeToClient(socket: Socket, mode: 0 | 1 | 2, payload: string) {

  if (mode === 1) {
    const flipCase = textProcessor.flipCase(payload)

    const newLinesReplaced = flipCase.replaceAll(/\\N/g, "\r")

    socket.write(newLinesReplaced)
  }
  if (mode === 2) {
    socket.write(payload)
  }
}

function commandToClient(socket: Socket, mode: 1 | 2, command: "CLR" | "CR", count = 1) {

  let byte = 0

  if (mode === 1) {
    switch (command) {
      case "CLR":
        byte = 147
        break;
      case "CR":
        byte = 13
        break;


      default:
        break;
    }
    for (let i = 0; i < count; i++) { socket.write(Buffer.from([byte])) }
  }
  if (mode === 2) {
    //socket.write(payload)
  }
}




function convertStringToByteArray(input: string): Uint8Array {
  // Replace all newline characters with the character for byte 13 (carriage return)
  const modifiedString = input.replace(/\n/g, '\r');

  // Use TextEncoder to convert the modified string to a Uint8Array (byte array)
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(modifiedString);

  return byteArray;
}