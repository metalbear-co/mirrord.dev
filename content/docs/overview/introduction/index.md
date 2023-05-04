---
title: "Introduction"
description: "mirrord 101"
date: 2022-05-26T08:48:57+00:00
lastmod: 2022-05-26T08:48:57+00:00
draft: false
# resources: ["diagram.jpeg"]
images: []
menu:
  docs:
    parent: "overview"
weight: 100
toc: true
---

mirrord is an open-source tool that lets developers run local processes in the context of their cloud environment. It’s meant to provide the benefits of running your service on a cloud environment (e.g. staging) without actually going through the hassle of deploying it there, and without disrupting the environment by deploying untested code.

## Why?

Traditionally, software development happens in loops. Developers write and test their code locally, then deploy it to a staging/pre-production environment in the cloud, where they perform additional tests. These tests often fail, because the code is meeting a production-like environment for the first time, and encounters new conditions. The code must then be fixed/rewritten, tested locally again, deployed to staging again, and so on, until the tests on staging pass.

{{<figure src="loop.png" class="bg-white center">}}

Deployment to staging can be costly for several reasons:

1. It often involves a CI process, which may be slow (because of e.g. a long automated test suite having to pass in order to progress) and sometimes broken.
2. Since staging environments are shared, the environment is occasionally broken when an engineer deploys unstable code.

With *mirrord*, we're trying to remove the costs associated with deployment to staging, by taking 'deployment' out of the process completely. By plugging your local process directly into the staging environment, you can test your code in cloud conditions without having to go through a long CI process, and without the risk of breaking the environment for other developers.

## How It Works

mirrord runs in two places - in the memory of your local process (`mirrord-layer`), and as a pod in your cloud environment (`mirrord-agent`).

{{<figure src="../architecture/architecture.svg" alt="mirrord - Basic Architecture" class="bg-white center large-width" style="overflow:hidden; width:795px" >}}

When you start your local process with mirrord, it creates a pod in your cloud environment, which listens in on the pod you've passed as an argument. `mirrord-layer` then does the following:
* Override the process' syscalls to:
  * Listen to incoming traffic from the agent, instead of local sockets.
  * Intercept outgoing traffic and send it out from the remote pod, instead of locally.
  * Read and write files to the remote file system.
* Merge the process' environment variables with those of the remote pod.

The remote part of this logic is handled by the agent, which runs in the network namespace of the remote pod, and can access its file system and environment variables.

For further details, see the [architecture](../architecture) section.
