targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@minLength(1)
@description('OpenAI endpoint')
param openAIEndpoint string

@minLength(1)
@description('OpenAI endpoint')
param azureApiKey string

@description('Id of the user or app to assign application roles')
param principalId string = ''

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

// Organize resources in a resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

module leia './app/leia.bicep' = {
  name: 'leia'
  scope: rg
  params: {
    name: '${abbrs.webSitesAppService}leia-${resourceToken}'
    location: location
    tags: tags
    appServicePlanId: appServicePlan.outputs.id
  }
}

module leiaAppSettings './core/host/appservice-appsettings.bicep' = {
  name: 'leia-appsettings'
  scope: rg
  params: {
    name: leia.outputs.SERVICE_WEB_NAME
    appSettings: {
      REACT_APP_API_BASE_URL: yoda.outputs.SERVICE_API_URI
    }
  }
}

module yoda './app/yoda.bicep' = {
  name: 'yoda'
  scope: rg
  params: {
    name: '${abbrs.webSitesAppService}yoda-${resourceToken}'
    location: location
    tags: tags
    appServicePlanId: appServicePlan.outputs.id
    keyVaultName: keyVault.outputs.name
    appSettings: {
      AZURE_COSMOS_CONNECTION_STRING_KEY: cosmos.outputs.connectionStringKey
      AZURE_COSMOS_DATABASE_NAME: cosmos.outputs.databaseName
      AZURE_COSMOS_ENDPOINT: cosmos.outputs.endpoint
    }
  }
}

module padme './app/padme.bicep' = {
  name: 'padme'
  scope: rg
  params: {
    name: '${abbrs.webSitesAppService}padme-${resourceToken}'
    location: location
    tags: tags
    appServicePlanId: appServicePlan.outputs.id
    keyVaultName: keyVault.outputs.name
    appSettings: {
      AZURE_COSMOS_CONNECTION_STRING_KEY: cosmos.outputs.connectionStringKey
      AZURE_COSMOS_DATABASE_NAME: cosmos.outputs.databaseName
      AZURE_COSMOS_ENDPOINT: cosmos.outputs.endpoint
      R2_OPENAI_ENDPOINT: openAIEndpoint
      R2_AZURE_API_KEY: azureApiKey
    }
  }
}

// Give the API access to KeyVault
module apiKeyVaultAccess './core/security/keyvault-access.bicep' = {
  name: 'api-keyvault-access'
  scope: rg
  params: {
    keyVaultName: keyVault.outputs.name
    principalId: yoda.outputs.SERVICE_API_IDENTITY_PRINCIPAL_ID
  }
}

// The application database
module cosmos './app/db.bicep' = {
  name: 'cosmos'
  scope: rg
  params: {
    accountName: '${abbrs.documentDBDatabaseAccounts}${resourceToken}'
    location: location
    tags: tags
    keyVaultName: keyVault.outputs.name
  }
}

// Create an App Service Plan to group applications under the same payment plan and SKU
module appServicePlan './core/host/appserviceplan.bicep' = {
  name: 'appserviceplan'
  scope: rg
  params: {
    name: '${abbrs.webServerFarms}${resourceToken}'
    location: location
    tags: tags
    sku: {
      name: 'B3'
    }
  }
}

// Store secrets in a keyvault
module keyVault './core/security/keyvault.bicep' = {
  name: 'keyvault'
  scope: rg
  params: {
    name: '${abbrs.keyVaultVaults}${resourceToken}'
    location: location
    tags: tags
    principalId: principalId
  }
}


// Data outputs
output AZURE_COSMOS_CONNECTION_STRING_KEY string = cosmos.outputs.connectionStringKey
output AZURE_COSMOS_DATABASE_NAME string = cosmos.outputs.databaseName

// App outputs
output AZURE_KEY_VAULT_ENDPOINT string = keyVault.outputs.endpoint
output AZURE_KEY_VAULT_NAME string = keyVault.outputs.name
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output REACT_APP_LEIA string = yoda.outputs.SERVICE_API_URI
output REACT_APP_YODA string = leia.outputs.SERVICE_WEB_URI
output REACT_APP_PADME string = padme.outputs.SERVICE_API_URI
