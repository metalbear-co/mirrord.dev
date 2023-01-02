---
title: "Quick Start"
description: "How to (very) quickly start using mirrord"
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "overview"
weight: 110
toc: true
---

### Requirements

mirrord runs on your local machine and in your Kubernetes cluster.

- MacOS (Intel, Silicon) and Linux (x86_64) are supported for the local machine.
- kubectl needs to be configured on the local machine.

mirrord can be used in three ways:

1. [CLI Tool](#cli-tool)
2. [VS Code Extension](#vs-code-extension)
3. [IntelliJ Plugin](#intellij-plugin)

### CLI Tool

#### Installation

To install the CLI, run the following command:

```bash
curl -fsSL https://raw.githubusercontent.com/metalbear-co/mirrord/main/scripts/install.sh | bash
```

#### Usage

To use mirrord to plug a local process into a pod/deployment in the cluster configured with kubectl, run:

```bash
mirrord exec --target <target-path> <command used to run the local process>`
```

For example:

```bash
mirrord exec --target pod/app-pod-01 python main.py
```

Use `mirrord exec --help` to get all possible commands + arguments.


### VS Code Extension

#### Installation

You can install the extension directly in the IDE, or download it from the marketplace [here](https://marketplace.visualstudio.com/items?itemName=MetalBear.mirrord).

#### Usage

To use extension, click the 'Enable mirrord' button in the status bar at the bottom of the window. When you next run a debug session, you'll be prompted with a dropdown listing pods in the namespace you've configured (or the 'default' namespace, if you haven't). Select the pod you want to impersonate, and the debugged process will be plugged into that pod by mirrord.

#### Configuration

The VS Code extension reads its configuration from the following file: `<project-path>/.mirrord/mirrord.json`. You can also prepend a prefix, e.g. `my-config.mirrord.json`, or use .toml or .yaml format.
It's documented [here](https://mirrord.dev/docs/overview/configuration/). It also supports autocomplete when edited in VS Code when the extension is installed.

### IntelliJ Plugin

#### Installation

You can install the plugin directly in the IDE (Preferences -> Plugins, search for 'mirrord'), or download it from the marketplace [here](https://plugins.jetbrains.com/plugin/19772-mirrord).

#### Usage

To use extension, click the mirrord icon in the Navigation Toolbar at the top right of the window. When you next run a debug session, you'll be prompted with a dropdown listing namespaces in your cluster, and then another with pods in the namespace you selected. Select the pod you want to impersonate, and the debugged process will be plugged into that pod by mirrord.

#### Configuration

Some configuration is currently available when selecting the pod to impersonate:
- `Enable File Operations` - Enable to override your process' file reads and writes to use the pod's filesystem instead.
- `Enable Remote DNS` - Enable to override your process' DNS lookups to use the pod's DNS instead.
- `Enable Ephemeral Containers` - Enable to use ephemeral containers to run the mirrord agent, rather than a Job.
- `Agent Log Level` - The log level for the mirrord agent.
- `Layer Log Level` - The log level for the mirrord layer.

