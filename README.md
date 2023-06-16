# R2

R2 is a service that pulls events from different sources and use each event as context to start a GTP-4 chat and generate ideas, recommendations and information which might be relevant.
Responses are persisted and displayed from a web app.

Demo wep app: https://app-leia-4vzghxfo4t7t2.azurewebsites.net/
Demo video:

https://github.com/vhvb1989/R2/assets/24213737/d86b7568-4e20-42d7-82e9-441e87eabba2

Demo notes:
- A collection of events were used as input for R2 to generate each response displayed within the demo.

## Deploying your own R2 instance

R2 uses the [Azure Developer CLI](https://github.com/Azure/azure-dev) to deploy the entire solution from a few steps.

  1. Install [azd](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
  
  2. If you have alredy cloned the repository, run `azd init` from the root. Otherwise, you can run `azd init -t vhvb1989/R2` and azd will pull the repo. To complete the init step, select a name for your environment.
  
  3. Configure your Azure OpenAI connection by running:
  ```
  azd env set R2_OPENAI_ENDPOINT paste-open-ai-url-here
  azd env set R2_AZURE_API_KEY paste-azure-api-key
  ```

  4. Run `azd up`. azd will create the next required Azure services:
  - Azure Key Vault: Holds connection to DB
  - Azure Cosmos DB: For the data persistance
  - Azure Web Apps:
    - padme: micro-service that interacts with OpenAI.
    - yoda: micro-service to handle DB and event sources.
    - leia: static front-end application.

  5. The final step is to inject persist the first events. This is because the `yoda` service is still learning how to automatically pull events from external sources. Hence, it provides the endpoit `/reset/naboo/events` where a collection of events can be pushed by you. All you need to do is do an HTTP POST call to the yoda url like:
  ```
    http post yoda-url/reset/naboo/events
    payload = [{event},{event}, ...]
  ```
  You can find an example of a collection of events [here]().

  6. Now call padme service like:
  ```
    http get padme-url/generate
  ```
  This will make `padme` to ask `yoda` for the list of events and start creating chats with OpenAI. 

  7. Open `leia` front end to see the responses that are generated.


To run the demo again and generate new responses, repeate from step 5 ahead.

