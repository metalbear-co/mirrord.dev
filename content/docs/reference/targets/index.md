---
title: "Targets"
description: "Possible targets for mirrord and how to set them"
date: 2023-05-08T07:50:11+02:00
lastmod: 2023-05-08T07:50:11+02:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 110
toc: true
---

## Overview

You can specify a target on your cluster for mirrord, giving your local application
access to the remote target's network environment, file system and environment variables, according to the
[configuration](https://mirrord.dev/docs/overview/configuration/).
When a target is specified, a [mirrord-agent](/docs/overview/architecture/#mirrord-agent) pod will be created on the same
node as the target pod.
The several kinds of supported targets are detailed below. There are also multiple ways to specify a
target for mirrord: you can do it in a configuration file, in an IDE dialog, or in the CLI with an argument or an
environment variable.

### Running without a target

When no target is specified, mirrord will start a *targetless* agent. That can be useful when you want to connect to
services from within the cluster, but you don't have any target that you want to "impersonate" - like when running an external utility or a new microservice. When running
targetless, mirrord will forward any connections initiated by your application to be sent out of the cluster, but it
will not mirror or steal incoming traffic, as a targetless agent is not connected to any Kubernetes service and does not
expose any ports. This means that if your application binds a port and listens on it, that will all happen locally,
on your machine. You can use this fact to run management programs (like e.g. pgAdmin) and have them listen for
connections on `localhost`, but connect to remote services in the cluster.

In order to run targetless, you need to not specify a target in the configuration file, in case you are using one.
In your IDE you can pick the `No Target ("targetless")` option in the target selection dialog (or just not make a
selection).
Moreover, the [environment variable used to specify a target](#using-an-environment-variable) has to be unset
(or set to an empty value) if you want to run targetless.

> **Note:** In order to set the namespace the agent is going to be created in, set the agent namespace, not the
> target namespace. That value can be set via the `agent.namespace` configuration file field, the -a CLI argument,
> or the `MIRRORD_AGENT_NAMESPACE` environment variable.

## Possible targets

You can either target a pod or a deployment, and you can also name a specific container in that deployment or pod to
target. When targeting a pod without specifying a container, the first container found in that pod will be targeted.
When targeting a deployment without specifying a container, the first container of the first pod found in the
deployment will be used (impersonating all pods in a deployment is supported in [mirrord for teams](https://metalbear.co/#waitlist-form)).

You can specify a target namespace if the target should be found in that namespace instead of the namespace that is
currently used by `kubectl`. See the different interfaces below for possible ways of specifying the target and its
namespace.

## Specifying a target

There are multiple ways to specify a target.
In all the possible interfaces for specifying a target, the basic format is `<resource-type>/<resource-name>`
optionally followed by `/container/<container-name>`. So for specifying a target without specifying a container you
can pass

```
deploy/<YOUR-DEPLOYMENT-NAME>
```
e.g. `deploy/lolz`,

or
```
pod/<YOUR-POD-NAME>
```
e.g. `pod/lolz-64698df9b7-6plq8`,


And for also specifying a container, you just add `/container/<CONTAINER-NAME>` at the end, e.g.
`pod/lolz-64698df9b7-6plq8/container/main-container`.

### Using a configuration file

The target path from the last section is set under the `target.path` field. The target's namespace can be set under
`target.namespace`. By default, the namespace currently specified in the local `kubeconfig` is used.

```json
{
  "target": {
    "path": "pod/lolz-64698df9b7-6plq8/container/main-container",
    "namespace": "lolzspace"
  }
}
```

### Using an IDE's dialog

If you are running one of mirrord's IDE extensions and you didn't specify a target via a
configuration file, a dialog will pop up for you to pick a target. If you want to choose a target from a different
namespace you can set a target namespace in the
[configuration file](#using-a-configuration-file), and the dialog will then contain targets in that
namespace.
Choose the `No Target ("targetless")` option in the dialog in order to run without a target.

### Using a command line argument

If you are running mirrord from the command line, you can specify the target via `-t` and its namespace via `-n`,
e.g. `mirrord exec -t deploy/lolz -n lolzspace my-app`. Values specified by command line arguments will be used even
if other values are set in a configuration file or in environment variables.

### Using an environment variable

You can set the target using the environment variable `MIRRORD_IMPERSONATED_TARGET` and the target's namespace using
the environment variable `MIRRORD_TARGET_NAMESPACE`. Values specified by environment variables will be used even if
other values are set in a configuration file.
