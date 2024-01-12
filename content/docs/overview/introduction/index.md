---
title: "Introduction"
description: "mirrord 101"
date: 2022-05-26T08:48:57+00:00
lastmod: 2022-05-26T08:48:57+00:00
draft: false
# resources: ["diagram.jpeg"]
images: []
tags:
  - open source
  - teams
  - enterprise
menu:
  docs:
    parent: "overview"
weight: 100
toc: true
---

mirrord is an open-source tool that lets developers run local processes in the context of their cloud environment. It makes it incredibly easy to test your code on a cloud environment (e.g. staging) without actually going through the hassle of Dockerization, CI, or deployment, and without disrupting the environment by deploying untested code. Instead of saving it for the last step, now you can shift-left on cloud testing you can test your code in the cloud from the very beginning of your development process.

Want to see mirrord in action? Check out our <a target="_blank" href="https://www.youtube.com/watch?v=ZR7A7cqQcFM)">demo</a>.


## Why?

Traditionally, software development happens in loops. Developers write and test their code locally, then deploy it to a staging/pre-production environment in the cloud, where they perform additional tests. These tests often fail, because the code is meeting a production-like environment for the first time, and encounters new conditions. The code must then be fixed/rewritten, tested locally again, deployed to staging again, and so on, until the tests on staging pass.

{{<figure src="loop.png" class="bg-white center" alt="The Traditional Dev Loop">}}

Deployment to staging can be costly for several reasons:

1. It often involves a CI process, which may be slow (because of e.g. a long automated test suite having to pass in order to progress) and sometimes broken.
2. Since staging environments are shared, the environment is occasionally broken when an engineer deploys unstable code.

mirrord removes the costs associated with deployment to staging, by taking 'deployment' out of the process completely. By plugging your local process directly into the staging environment, you can test your code in cloud conditions without having to go through a long CI process, and without the risk of breaking the environment for other developers. 

However, the point of mirrord is not just to make that final step in the dev loop of testing in staging quicker. mirrord makes running your code in the cloud easy, fast and safe, so you can **shift left on cloud testing**, and test your code in the cloud from the very beginning of your development process. Instead of spending your time running local environments, writing mocks, test fixtures, and so on - why not just test your code on staging itself?

## How It Works

mirrord runs in two places - in the memory of your local process (`mirrord-layer`), and as a pod in your cloud environment (`mirrord-agent`).

{{<figure src="../architecture/architecture.svg" alt="mirrord - Basic Architecture" class="bg-white center large-width zoomable" style="overflow:hidden; width:795px" >}}

When you start your local process with mirrord, it creates a pod in your cloud environment, which listens in on the pod you've passed as an argument. `mirrord-layer` then does the following:
* Override the process' syscalls to:
  * Listen to incoming traffic from the agent, instead of local sockets.
  * Intercept outgoing traffic and send it out from the remote pod, instead of locally.
  * Read and write files to the remote file system.
* Merge the process' environment variables with those of the remote pod.

The remote part of this logic is handled by the agent, which runs in the network namespace of the remote pod, and can access its file system and environment variables.

For further details, see the [architecture](../architecture) section.
