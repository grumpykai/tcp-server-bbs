import net from "net";
import axios, { AxiosRequestConfig } from "axios";
import { TextProcessor } from "./TextProcessor";
let llmResponseText = ""

// Store clients using a Map (key: clientId, value: socket)
const clients = new Map();

// Function to generate a unique ID for each client
const getClientId = (socket) => `${socket.remoteAddress}:${socket.remotePort}`;

let userInput = "";

// Create a TCP server
const server = net.createServer((socket) => {
  const clientId = getClientId(socket);
  console.log(`Client connected: ${clientId}`);
  clients.set(clientId, socket);

  // Send a byte with decimal value 147 before the greeting message CLR screen
  const initialByte = Buffer.from([147]);
  socket.write(initialByte);

  // Send greeting message to the new client
  socket.write("hELLO cLIENT");

  socket.write(Buffer.from([13, 13]))

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

      //  socket.write(`writing...`)

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

            const textProcessor = new TextProcessor();
            textProcessor.addText(llmResponseText);

            if (textProcessor.pages.length === 1) {
              responseStream.write(
                convertStringToByteArray(textProcessor.flipCase(deltaText.toString()))
              );
            }
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

// Listen on port 6400
server.listen(6400, () => {
  console.log("Server listening on port 6400");
});

// Handling server errors
server.on("error", (err) => {
  console.error(`Server error: ${err.message}`);
});

function convertStringToByteArray(input: string): Uint8Array {
  // Replace all newline characters with the character for byte 13 (carriage return)
  const modifiedString = input.replace(/\n/g, '\r');

  // Use TextEncoder to convert the modified string to a Uint8Array (byte array)
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(modifiedString);

  return byteArray;
}