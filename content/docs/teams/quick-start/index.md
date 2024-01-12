---
title: "Quick Start - mirrord for Teams"
description: "Get started with mirrord for Teams"
date: 2022-05-26T08:48:57+00:00
lastmod: 2022-05-26T08:48:57+00:00
draft: false
images: []
linktitle: "Quick Start"
weight: 110
toc: true
---

You can register and start using mirrord for Teams [here](https://app.metalbear.co/).

mirrord for Teams adds a new component to the mirrord architecture: the mirrord Operator. The mirrord Operator is a Kubernetes Operator that runs on your cluster and manages mirrord clients running against the cluster. To start using mirrord for Teams on a Kubernetes cluster, all you need to do is install the Operator - once it's installed, all mirrord clients will use it automatically when impersonating targets on the cluster.

## Installing the mirrord Operator
NOTE: This has to be performed by a user with elevated permissions to the cluster.

### mirrord CLI
1. Install the [mirrord CLI](/docs/overview/quick-start/#cli-tool).
2. Run the `mirrord operator setup` command. The base of the command is:
​
`mirrord operator setup [OPTIONS] | kubectl apply -f -`
​
Options:
- `--accept-tos` 
        You accept terms of service for mirrord-operator
- `--license-key` 
        The license key for the operator
- (Optional) `-f, --file` 
        Output Kubernetes definitions to file and not to stdout (instead of piping to `kubectl apply -f -`)
- (Optional) `--namespace` 
        Set namespace of mirrord operator (default: mirrord)
​
So the final command should look like
​
`mirrord operator setup --accept-tos --license-key <license-key> | kubectl apply -f -`

You should now be able to see the `mirrord-operator` deployment when running `kubectl get deployments -n mirrord`. Also, when you run mirrord, you'll see the `connected to operator` step in its progress reports.

### Helm

To install the mirrord Operator with Helm, first add the MetalBear Helm repository:

```bash
helm repo add metalbear https://metalbear-co.github.io/charts
```

Then download the accompanying `values.yaml`:
```bash
curl https://raw.githubusercontent.com/metalbear-co/charts/main/mirrord-operator/values.yaml --output values.yaml
```

Set \`license.key\` to your key.

Finally, install the chart:
```bash
helm install -f values.yaml mirrord-operator metalbear/mirrord-operator 
```

## OpenShift

In order to make the operator work with OpenShift, you need to apply the following scc:

```yaml
kind: SecurityContextConstraints
apiVersion: security.openshift.io/v1
metadata:
  name: scc-mirrord
allowHostPID: true
allowPrivilegedContainer: false
allowHostDirVolumePlugin: true
allowedCapabilities: ["SYS_ADMIN", "SYS_PTRACE", "NET_RAW", "NET_ADMIN"]
runAsUser:
  type: RunAsAny
seLinuxContext:
  type: MustRunAs
users:
- system:serviceaccount:mirrord:mirrord-operator
- system:serviceaccount:mirrord:default
```