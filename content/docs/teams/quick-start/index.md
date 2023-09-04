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

> mirrord for Teams is currently in closed beta. Go [here](https://metalbear.co/#waitlist-form) to join the waitlist.

mirrord for Teams adds a new component to the mirrord architecture: the mirrord Operator. The mirrord Operator is a Kubernetes Operator that runs on your cluster and manages mirrord clients running against the cluster. To start using mirrord for Teams on a Kubernetes cluster, all you need to do is install the Operator - once it's installed, all mirrord clients will use it automatically when impersonating targets on the cluster.

## Installing the mirrord Operator
NOTE: This has to be performed by a user with elevated permissions to the cluster.

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