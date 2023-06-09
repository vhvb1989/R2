# R2

R2 is a service that pulls events from different sources and use each event as context to start a GTP-4 chat. Once the chat is created, it ask GTP-4 to produce relevant and useful content about the event and produces a collection of ai-created-feeds.

Example: Considering a simple event-source like a calendar, R2 can set up a client-connection for a calendar like outlook/gmail/facebook/etc. Then R2 pulls all the events from the calendar for the next 7 days. Each event is parsed to get a datetime, title, subject and description and used to call OpenAI to create a new /chat. Then, R2 would use a list of common instructions/questions like `how can I make this event better`, or `historical events about the event date`, or etc. All these instructions/queries should be configurable per user.
For each response, R2 will create a feed thar is displayed in a front-end client.
From the R2-front-end client, a customer can add event-sources (like multiple calendars), configure what instructions/questions to run for each event, and watch the collection of feeds created for each event.
A feed should allow customers to jump into a chat-mode to continue to interact with GPT-4 after the produced output.

MVP:   
-	A Calendar source can be initially mocked, as it is not the most relevant part of the service.
-	R2 frontend app supporting:
o	Configure instructions/queries for each event
o	Add/List/Remove event-source
o	Show feed collection
o	Click a feed to continue GPT-4 chat from there
o	Delete feeds
-	R2 backend supporting:
o	Connection to OpenAI – GPT4 with support for /chat and /ask
o	Engine to produce feeds (pull event -> parse -> create chat -> ask -> save feed)
-	The project should be an azd template, so it can be deployed and demo.

Architecture design:
-	Micro-service
o	Backend services
	service app to set up event sources and to standardize an event payload. Use adapter pattern to support any source.
	service app to produce the feeds. This is the one which interacts with OpenAI and the one which can reach the feeds DB.
o	Frontend services
	Static web app client

# Build and deploy

R2 uses the Azure Developer CLI to created all the required cloud services and to deploy the code on them.
Run `azd up` from the root of the repo. That's all.
