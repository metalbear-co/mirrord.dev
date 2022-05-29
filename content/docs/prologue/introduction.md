---
title: "Introduction"
description: "mirrord is an open-source tool that lets developers run local processes in the context of their cloud environment. It’s meant to provide the benefits of running your service on a cloud environment (e.g. staging) without actually going through the hassle of deploying it there, and without disrupting the environment by deploying untested code."
lead: "mirrord is an open-source tool that lets developers run local processes in the context of their cloud environment. It’s meant to provide the benefits of running your service on a cloud environment (e.g. staging) without actually going through the hassle of deploying it there, and without disrupting the environment by deploying untested code."
date: 2022-05-26T08:48:57+00:00
lastmod: 2022-05-26T08:48:57+00:00
draft: false
# resources: ["diagram.jpeg"]
images: []
menu:
  docs:
    parent: "prologue"
weight: 100
toc: true
---


## Quick Start

### Requirements
mirrord runs on your local machine and in your cluster.
- MacOS (Intel, Silicon) and Linux (x86_64) are supported for the local machine.
- Kubernetes is supported for the cloud cluster.
- kubectl needs to be configured on the local machine.


### Installation
mirrord can be used as a CLI tool or an extension for VS Code. 


#### CLI

To install the CLI, run the following command:

```bash
curl -fsSL https://raw.githubusercontent.com/metalbear-co/mirrord/main/scripts/install.sh | bash
```

#### VS Code Extension
You can install the extension directly in the IDE, or download it from the marketplace [here](https://marketplace.visualstudio.com/items?itemName=MetalBear.mirrord).

### Running

#### CLI
You can use `mirrord --help` to get all possible commands + arguments.
Example command:
```bash
mirrord exec --pod-name app-pod-01 python main.py
```



##### Advanced Configuration
Most configurations can be set by env and/or by passing a command line flag.
- `--pod-name`  - Name of the pod to impersonate
- `-n` | `--pod-namespace` | `MIRRORD_AGENT_IMPERSONATED_POD_NAMESPACE` - Namespace that the impersonated pod exists in (Defaults to “default”)
- `-a` | `--agent-namespace` | `MIRRORD_AGENT_NAMESPACE` - Namespace to spawn our agent in, (Defaults to “default”).
- `-l` | `--agent_log_level` | `MIRRRD_AGENT_RUST_LOG` - `RUST_LOG` to set for the agent. See EnvFilter docs



## Contributing

Contributing has many forms, and we welcome any feedback/help.
Those are the common ways:
- Report a bug you found to our [issue tracker](https://github.com/metalbear-co/mirrord/issues).
- Suggest a feature/improvement in a discussion on our [GitHub discussions](https://github.com/metalbear-co/mirrord/discussions).
- Write a blog post about your experience with mirrord. We will love to share it!
- Fix/implement an issue from our [issue tracker](https://github.com/metalbear-co/mirrord/issues), please let us know that you're working on an issue beforehand so we can provide help and reduce double-work.
- Help our docs and website by sending a PR with improvements.


## Help

Need Help? Open a [discussion](https://github.com/metalbear-co/mirrord/discussions) or join our Discord server [here](https://discord.gg/pSKEdmNZcK).