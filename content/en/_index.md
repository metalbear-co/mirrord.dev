---
title : "mirrord"
description: "mirrord lets you reflect your changes in local code to a k8s cluster without building or deploying"
lead: "mirrord lets you reflect your k8s cluster to your local code without interrupting it"
date: 2020-10-06T08:47:36+00:00
lastmod: 2020-10-06T08:47:36+00:00
draft: false
images: []
---
### with mirrord your local code can

- Receive duplicated incoming traffic of a remote service.
- Use the remote service's environment variables.
- Access the remote file system.
- Connect to network resources 

### All of that, as if you're running as a pod in the remote cluster.

<!-- ## Why deploy to staging when you can...
**not** deploy to staging?

By mirroring traffic to and from your machine, ***mirrord*** surrounds your local sergvice with a mirror image of its cloud environment.

### No more:
 - Mocking up databases/traffic/configuration
 - Waiting for the CI to run
 - Breaking the shared environment for everyone -->

<!-- ### Stop 🛑✋

- Mocking databases/traffic/configuration
- Waiting for the CI to run
- Breaking the shared environment for everyone

### Start ▶️
- Running your service locally, with remote service's context
- Receiving mirrored (duplicated) traffic in real time
- Having the same environment variables the remote service has
- Accessing resources available to the remote context such as databases, managed services, etc. -->