---
title: "License Server - mirrord for Teams"
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

License server allows you manage the license in a single place but for multiple operators installed on different or ephemeral clusters whilst keeping all commuications internal. This is usefull for Air-Gapped clusters or ones with restricted networking.

## Basic Setup

License server is currently bundled with the operator image just under `license-server` command.

For example:
```bash
# will launch the operator
docker run ghcr.io/metalbear-co/operator:3.107.2
```

```bash
# will launch the license-server
docker run ghcr.io/metalbear-co/operator:3.107.2 license-server
``` 

Though they do use some distinct configuration args and env, and thus we recommend using the helm chart.


### Helm Chart

Simplest deployment is with chart `mirrord-license-server`
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
*NOTE: default value for `service.type` is `ClusterIP`, this service should be accesible to the operator so you might concider using `NodePort` or `LoadBalancer` types*

Keep in mind that the `license.key` can be any value and should be used as `--license-key` in operator setup.

<br />

With this `values.yaml` we can install the license server on a kubernetes cluster.

```bash
helm repo add metalbear-co https://metalbear-co.github.io/charts
 helm install metalbear-co/mirrord-operator-license-server -f ./values.yaml --generate-name
```

Once it's installed and running now you can connect the operator.

Depending if installed the operator via helm or cli you can specify the following properties.

```bash
mirrord operator setup --accept-tos --license-key secret --license-server http://<license-server-addr> | kubectl apply -f -
```

or if using with Helm chart
```yaml
# ./values.yaml
license:
  key: secret
  licenseServer: http://<license-server-addr>
```
and then use the install or upgrade to set these parameters
```bash
helm install metalbear-co/mirrord-operator -f ./values.yaml --generate-name
```

The `<license-server-addr>` should be an acceible endpoint of the `mirrord-operator-license-server` service meaning if you have it installed under `LoadBalancer` confuguration it will be the relevant `<external-ip>:<node-port>`

If you have an ingress installed on the cluster please do expose the `mirrord-operator-license-server` service via http or https to license server http/https endpoint (depends on `tls` and `service.port` values in license-server chart)

## License

License server must have both a license key and the license file (either via chart or `LICENSE_KEY` and `LICENSE_PATH` env variables).

Where the license key can be any value and will later be used in connected operators and to manually fetch any statistic and license file must be a valid operator license that will be served to the connecting operators and should be mounted to the license server (when using chart can either be mounted from secret with license under `license.pem` key and possibly create said secret from `license.file.data` value).

## Tls

License server is able to self expose a https endpoint if needed by providing the relevant certifcate and private key or via `certManager` integration.

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

## Ingress

Operator will use `OPERATOR_LICENSE_KEY` and `OPERATOR_LICENSE_SERVER` (or `license.key` and `license.licenseServer` value in operator chart). The server value must contain the protocol and the prefix for any ingress that the license server can be behind.

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
