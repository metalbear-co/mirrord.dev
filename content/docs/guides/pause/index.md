---
title: "Guide: Target Pause"
linktitle: "Target Pause"
description: "How to steal traffic using mirrord"
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "guides"
weight: 90
toc: true
shallowToc: true
---



## Requirements

mirrord runs on your local machine and in your Kubernetes cluster.

### Local Requirements

- MacOS (Intel, Silicon) and Linux (x86_64) are supported for the local machine. Windows users can use mirrord using WSL (IDE plugins supported as well).
- kubectl needs to be configured on the local machine.

### Remote Requirements

- Docker or containerd runtime (containerd is the most common). If you'd like support for other runtimes to be added, please let us know by [opening an issue on GitHub](https://github.com/metalbear-co/mirrord/issues/new?assignees=&labels=enhancement&template=feature_request.md).
- Linux Kernel version 4.20+

mirrord can be used in three ways:

1. [CLI Tool](#cli-tool)
2. [VS Code Extension](#vs-code-extension)
3. [IntelliJ Plugin](#intellij-plugin)

## CLI Tool

### Installation

To install the CLI, run:

```bash
brew install metalbear-co/mirrord/mirrord
```
or
```bash
curl -fsSL https://raw.githubusercontent.com/metalbear-co/mirrord/main/scripts/install.sh | bash
```

### Usage

To use mirrord to plug a local process into a pod/deployment in the cluster configured with kubectl, run:

```bash
mirrord exec --target <target-path> <command used to run the local process>
```

For example:

```bash
mirrord exec --target pod/app-pod-01 python main.py
```

Use `mirrord exec --help` to get all possible commands + arguments.


## VS Code Extension

### Installation

You can install the extension directly in the IDE (Extensions -> search for 'mirrord'), or download it from the marketplace [here](https://marketplace.visualstudio.com/items?itemName=MetalBear.mirrord).

### Usage

To use extension, click the 'Enable mirrord' button in the status bar at the bottom of the window. When you next run a debug session, you'll be prompted with a dropdown listing pods in the namespace you've configured (or the 'default' namespace, if you haven't). Select the pod you want to impersonate, and the debugged process will be plugged into that pod by mirrord.

### Configuration

The VS Code extension reads its configuration from the following file: `<project-path>/.mirrord/mirrord.json`. You can also prepend a prefix, e.g. `my-config.mirrord.json`, or use .toml or .yaml format.
Configuration options are listed [here]({{< ref "/docs/overview/configuration" >}} "configuration"). The configuration file also supports autocomplete when edited in VS Code when the extension is installed.

## IntelliJ Plugin

### Installation

You can install the plugin directly in the IDE (Preferences -> Plugins, search for 'mirrord'), or download it from the marketplace [here](https://plugins.jetbrains.com/plugin/19772-mirrord).

### Usage

To use extension, click the mirrord icon in the Navigation Toolbar at the top right of the window. When you next run a debug session, you'll be prompted with a dropdown listing namespaces in your cluster, and then another with pods in the namespace you selected. Select the pod you want to impersonate, and the debugged process will be plugged into that pod by mirrord.

### Configuration

The IntelliJ plugin reads its configuration from the following file: `<project-path>/.mirrord/mirrord.json`. You can also prepend a prefix, e.g. `my-config.mirrord.json`, or use .toml or .yaml format.
Configuration options are listed [here]({{< ref "/docs/overview/configuration" >}} "configuration").


## Test it out!
Now that you've installed the CLI tool or one of the extensions, lets see mirrord at work. By default, mirrord will mirror incoming traffic to the remote target (this can be changed in the [configuration](/docs/overview/configuration/#feature-network-incoming-mode)), sending a duplicate to the same port on your local process. So if your remote target receives traffic on port 80, your local process will receive a copy of that traffic on that same port (this can also be [configured](/docs/overview/configuration/#feature-network-incoming-port_mapping)). 

To test this out, enable mirrord in your IDE plugin and start debugging your process (or execute your process with the mirrord CLI). Send a request to your remote target, and you should see that request arriving at your local process as well!

Note that, by default, the following features are also enabled: 
1. Environment variables from the remote target will be imported into your local process
2. When reading files, your local process will read them from the remote target
3. DNS resolution for your local process will happen on the remote target
4. Outgoing traffic sent by your local process will be sent out from the remote target instead, and the response will be sent back to your locall process

We find that this configuration works for a lot of use cases, but if you'd like to change it, please read about available options in the [configuration](/docs/overview/configuration/).

## What's next?
Now that you've tried out mirrord, it's time to get acquainted with its different configuration options and tailor it to your needs:
1. If you'd like to intercept traffic rather than mirror it so that your local process is the one answering the remote requests, check out this guide. Note that you can even filter which traffic you intercept!
2. If your local process reads from a queue, you might want to test out the pause feature, which temporarily pauses the remote target so it doesn't compete with your local process for queue messages.
3. If you don't want to impersonate a remote target - for example, if you want to run a tool in the context of your cluster - check out our guide on the targetless mode.
4. If you just want to learn more about mirrord, why not checkout our [architecture](/docs/architecture/) or configuration(/docs/configuration/) sections?
