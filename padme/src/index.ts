import express from "express";
import { Server } from "http";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { OpenAIClient, AzureKeyCredential, ChatMessage } from "@azure/openai";

dotenv.config();
const app = express();

// You will need to set these environment variables or edit the following values
const endpoint = process.env["ENDPOINT"] || "<endpoint>";
const azureApiKey = process.env["AZURE_API_KEY"] || "<api key>";

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

app.get("/", async (req: express.Request, res: express.Response) => {
    res.redirect(200,'/generate');
});
/**
 * Home URI
 */
app.get("/generate", async (req: express.Request, res: express.Response) => {
    console.log("redirected here");
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentId = "gpt-4"
    const eventResponse = await fetch('https://app-yoda-5d5ibv73eacuc.azurewebsites.net/events');
    const body = await eventResponse.json();
    if(body){
        for await (const event of body.events) {
            // Do something with each "chunk"
              let eventQs = `I have an event named ${event.title} where ${event.description} on ${event.dateTime}. Provide me ideas to make this event better.`    
              //Tell me something important that happens on this day.
              let messages: ChatMessage[] = [
                  { role: "user", content: eventQs },
              ]
          const result = await client.getChatCompletions(deploymentId,messages)
              for (const choice of result.choices) {
                  messages.push(choice.message!)
                }
                listOfEventsWithChat.push({...event,"conversation":messages})
                
          }  
    }
        res.send(JSON.stringify(listOfEventsWithChat));
});

app.get("/feed",async(req: express.Request, res: express.Response) =>{

})


let server: Server | undefined = undefined;
server = app.listen(8080, () => {
  console.log(`Server listening on port 8080`);
});
