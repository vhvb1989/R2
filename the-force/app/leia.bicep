param name string
param location string = resourceGroup().location
param tags object = {}
param serviceName string = 'leia'
param appCommandLine string = 'pm2 serve /home/site/wwwroot --no-daemon --spa'
param appServicePlanId string

module leia '../core/host/appservice.bicep' = {
  name: '${name}-deployment'
  params: {
    name: name
    location: location
    appCommandLine: appCommandLine
    appServicePlanId: appServicePlanId
    runtimeName: 'node'
    runtimeVersion: '18-lts'
    tags: union(tags, { 'azd-service-name': serviceName })
  }
}

output SERVICE_WEB_IDENTITY_PRINCIPAL_ID string = leia.outputs.identityPrincipalId
output SERVICE_WEB_NAME string = leia.outputs.name
output SERVICE_WEB_URI string = leia.outputs.uri
