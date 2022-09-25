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
Traditionally, software development happens in loops, where developers write and test their code locally, then deploy it to a staging/pre-production environment in the cloud, where they perform additional tests. These tests often fail, because the code is meeting a near-production environment for the first time, and encounters new conditions. The code must then be fixed/rewritten, tested locally again, deployed to staging again, and so on, until the tests pass.
{{<figure src="loop.png" class="white-background center">}}

The deployment to staging stage is expensive for several reasons:
1. It often goes through a CI process, which is often slow (because of e.g. a long automated test suite having to pass in order to progress) and sometimes broken
2. Since staging environments are usually shared, the environment is occasionally broken when an engineer deploys unstable code.

With *mirrord*, we're trying to remove the costs associated with deployment to staging, by taking 'deployment' out of the process completely. By plugging your local process directly into the staging environment, you can test your code in cloud conditions without having to go through a long CI process, and without the risk of breaking the environment for other developers.

## How It Works

mirrord runs in two places - in the memory of your local process (the mirrord-layer), and as a pod in your cloud environment (the mirrord-agent).
{{<figure src="../architecture/architecture.svg" alt="mirrord - Basic Architecture" class="white-background center large-width">}}

When you start your local process with mirrord, it creates a pod in your cloud environment, which listens in on the pod you've passed as an argument. The mirrord-layer then hooks syscalls for your process, overriding its network behavior to listen to incoming traffic from the agent, instead of local sockets. It then subscribes to incoming traffic from the agent (whatever was sniffed by the agent on the port that's being listened to locally), and whatever traffic reaches the remote pod is then duplicated by the agent, sent to the layer, and routed to the local process. Outgoing TCP traffic from the local process is intercepted by the mirrord-layer and forwarded to the agent, which in turn sends it out as if originating from the remote pod.
