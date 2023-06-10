import express from "express";
import { Server } from "http";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { OpenAIClient, AzureKeyCredential, ChatMessage } from "@azure/openai";

dotenv.config();
const app = express();

// You will need to set these environment variables or edit the following values
const endpoint = process.env["R2_OPENAI_ENDPOINT"] || "<endpoint>";
const azureApiKey = process.env["R2_AZURE_API_KEY"] || "<api key>";
const yodaUrl = process.env["REACT_APP_YODA"] || "<yoda url>";

let listOfEventsWithChat: {
  conversation: ChatMessage[]; title: string; description: string; dateTime:
  /**
   * Demonstrates how to get suggestions for the events.
   *
   * @summary get completions.
   */
  string;
}[] = [];

app.use(bodyParser.json())

//logs every request
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Server:", req.url);
    next();
  }
);

// Open CORS - for demo purpose only
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", async (req: express.Request, res: express.Response) => {
  res.send(JSON.stringify({ "ping": "ok" }));
});

/**
 * Home URI
 */
app.get("/generate", async (req: express.Request, res: express.Response) => {
  console.log("redirected here");
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "gpt-4"
  const eventResponse = await fetch(yodaUrl + '/events');
  const body = await eventResponse.json();
  if (body) {
    for await (const event of body.events) {
      // Do something with each "chunk"
      let eventQs = `I have an event named ${event.title} where ${event.description} on ${event.dateTime}. Provide me ideas to make this event better.`
      let messages: ChatMessage[] = [
        { role: "user", content: eventQs },
      ]
      const result = await client.getChatCompletions(deploymentId, messages)
      for (const choice of result.choices) {
        messages.push(choice.message!)
      }
      listOfEventsWithChat.push({ ...event, "conversation": messages })
    }
  }

  // todo - call 
  // const eventResponse = await POST (yodaUrl + '/create/feed'); -> use paylod = JSON.stringify(listOfEventsWithChat)
  res.send(JSON.stringify(listOfEventsWithChat));
});

let server: Server | undefined = undefined;
server = app.listen(8080, () => {
  console.log(`Server listening on port 8080`);
});
