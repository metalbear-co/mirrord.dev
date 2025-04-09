---
title: "License Server"
description: "License Server"
date: 2025-04-07T00:00:00+00:00
lastmod: 2025-04-07T00:00:00+00:00
draft: false
images: []
linktitle: "License Server"
menu:
  docs:
    teams:
weight: 540
toc: true
tags: ["enterprise"]
---

The license server enables you to manage your organization’s seats without sending any data to mirrord’s servers. It can aggregate license metrics from multiple operators (useful if you’re running mirrord across multiple clusters) and provides visibility into seat usage across your organization.

## Basic Setup

The license server is currently bundled with the operator image just under `license-server` command. It's possible to deploy the license-server or any container runtime or orchistration we recommend installing via helm for simplicity.

### Helm Chart

The license server is installable via Helm. First, add the MetalBear Helm repository:

```bash
helm repo add metalbear-co https://metalbear-co.github.io/charts
```

Next, save the following yaml as `values.yaml` on your machine. 

```yaml
# ./values.yaml
createNamespace: true

service:
  type: ClusterIP

license:
  key: secret
  file:
    data:
      license.pem: |
        ----- ... 
        MIRRORD-LICENSE 
        ... -----
```

Then fill in the `license.key` and `license.file.data."license.pem"` with a license key value of your choosing and the contents of your operator license and/or customise the deployment to your choosing. (all values.yaml configuration options can found [here](https://raw.githubusercontent.com/metalbear-co/charts/main/mirrord-license-server/values.yaml))

*NOTE: The default value for `service.type` is `ClusterIP`. This service needs to be accessible to any mirrord operators you want to track, so you can also use `NodePort` or `LoadBalancer`*

Next, install the license server on your cluster:

```bash
helm install metalbear-co/mirrord-operator-license-server -f ./values.yaml --generate-name --wait
```

To make sure it's been installed successfully and is running:

```bash
kubectl get deployment -n mirrord mirrord-license-server
```

If you have an ingress installed on the cluster please do expose the `mirrord-operator-license-server` service via http or https to the license server http/https endpoint (depends on `tls` and `service.port` values in license-server chart)

### Connecting Operators to the License Server

Add the license server address to the operator configuration. If you've installed the operator using the mirrord CLI:

```bash
mirrord operator setup --accept-tos --license-key secret --license-server http://<license-server-addr> | kubectl apply -f -
```

Or if you installed it using Helm, first update your `values.yaml` file:
```yaml
# ./values.yaml
license:
  key: secret
  licenseServer: http://<license-server-addr>
```
*NOTE: The server value must contain the protocol and the prefix for any ingress that the the license server can be behind.*

Then run:
```bash
helm install metalbear-co/mirrord-operator -f ./values.yaml --generate-name --wait
```


## Ingress

Operator will use `license.key` and `license.licenseServer` (or `OPERATOR_LICENSE_KEY` and `OPERATOR_LICENSE_SERVER` env variables).

For example value of<br/>
`https://operator-license-server.internal-ingress.managment-cluster`<br/>
assumes that<br/>
`https://operator-license-server.internal-ingress.managment-cluster/api/v1/license`<br/>
will result in a request to `$ADDRESS/api/v1/license` in license-server container.

If there is some path prefix it will assume it will be trimmed by ingress, meaning value of<br/>
`https://internal-ingress.managment-cluster/operator-license-server`<br/>
will expect<br/>
`https://internal-ingress.managment-cluster/operator-license-server/api/v1/license`<br/>
to also result in a request to `$ADDRESS/api/v1/license` in license-server container (the ingress will need to strip the prefix)

The `<license-server-addr>` should be an acceible endpoint of the `mirrord-operator-license-server` service meaning if you have it installed under `LoadBalancer` confuguration it will be the relevant `<external-ip>:<node-port>`

## License

The license server must have both a license key and the license file (either via chart or `LICENSE_KEY` and `LICENSE_PATH` env variables).

* License key - Can be any string of your choosing and will later be used in connected operators and to manually fetch any statistic.
* License file -  Must be a valid operator license that will be served to the connecting operators and should be mounted to the the license server (when using chart can either be mounted from secret with license under `license.pem` key and possibly create said secret from `license.file.data` value).

## Tls

The license server is able to self expose a https endpoint if needed by providing the relevant certifcate and private key or via `certManager` integration.

```yaml
# ./values.yaml
...

service:
  port: 433

tls:
  data:
    tls.key: |
      -----BEGIN PRIVATE KEY-----
      ...
      -----END PRIVATE KEY-----
    tls.crt: |
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
  # or
  certManager:
    enabled: true
```

*NOTE: If enabled certManager does create only certificates for internal dns names like `mirrord-operator-license-server` or `mirrord-operator-license-server.mirrord.svc` under a newly created `cert-manager.io/v1.Issuer` and does require `cert-manager.io` to be installed on the cluster*
