---
title: "Quick Start"
description: "How to (very) quickly start using mirrord."
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
mirrord runs on your local machine and in your cluster.
- MacOS (Intel, Silicon) and Linux (x86_64) are supported for the local machine.
- Kubernetes is supported for the cloud cluster.
- kubectl needs to be configured on the local machine.


mirrord can be used in two ways:
1. [CLI Tool](#cli-tool)
2. [VS Code Extension](#vs-code-extension)


### CLI Tool
#### Installation

To install the CLI, run the following command:

```bash
curl -fsSL https://raw.githubusercontent.com/metalbear-co/mirrord/main/scripts/install.sh | bash
```

#### Usage

To use mirrord to plug a local process into a pod in the cluster configured with kubectl, run:
```bash
mirrord exec --pod-name <pod-name> <command used to run the local process>`
```
For example:
```bash
mirrord exec --pod-name app-pod-01 python main.py
```

Use `mirrord --help` to get all possible commands + arguments.



#### Configuration
Most configurations can be set by env and/or by passing a command line flag.
- `--pod-name`  - Name of the pod to impersonate
- `-n` | `--pod-namespace` | `MIRRORD_AGENT_IMPERSONATED_POD_NAMESPACE` - Namespace that the impersonated pod exists in (Defaults to “default”)
- `-a` | `--agent-namespace` | `MIRRORD_AGENT_NAMESPACE` - Namespace to spawn our agent in, (Defaults to “default”).
- `-l` | `--agent-log-level` | `MIRRORD_AGENT_RUST_LOG` - `RUST_LOG` to set for the agent. See EnvFilter docs



### VS Code Extension
#### Installation
You can install the extension directly in the IDE, or download it from the marketplace [here](https://marketplace.visualstudio.com/items?itemName=MetalBear.mirrord).

#### Usage
To use extension, click the 'Enable mirrord' button in the status bar at the bottom of the window. When you next run a debug session, you'll be prompted with a dropdown listing pods in the namespace you've configured (or the 'default' namespace, if you haven't). Select the pod you want to impersonate, and the debugged process will be plugged into that pod by mirrord.

#### Configuration
Use the Settings button in the status bar to open the settings menu. You can change the following parameters:
- `Pod Namespace` - The namespace that the pod you want to impersonate exists in.
- `Agent Namespace` - The namespace to spawn the mirrord agent in.