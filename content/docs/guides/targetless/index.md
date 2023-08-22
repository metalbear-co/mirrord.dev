---
title: "Targetless"
description: "How to steal traffic using mirrord"
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
menu:
  docs:
    parent: "guides"
weight: 1200
toc: true
---

The common use case for mirrord is testing out modifications to an existing application. In this case, the stable version of the service is running in the cloud, and the new code runs locally, using the stable cloud version as its remote target.
However, sometimes you want to test a brand new application that has never been deployed to the cloud. Or you might not want to run an application at all - maybe you just want to run a tool, like Postman or pgAdmin, in the context of your cluster.

This is where targetless mode comes in. When running in targetless mode, mirrord doesn't impersonate a remote target. There's no incoming traffic functionality in this mode, since there's no remote target receiving traffic, but everything else works exactly the same.

To run mirrord in targetless mode, just don't specify a target! For example:
```bash
mirrord exec /bin/my-tool
```

## What's next?
1. If you'd like to intercept traffic rather than mirror it so that your local process is the one answering the remote requests, check out [this guide](/docs/guides/steal/). Note that you can even filter which traffic you intercept!
2. If your local process reads from a queue, you might want to test out the [pause feature](/docs/guides/pause/), which temporarily pauses the remote target so it doesn't compete with your local process for queue messages.
3. If you just want to learn more about mirrord, why not checkout our [architecture](/docs/overview/architecture/) or [configuration](/docs/overview/configuration/) sections?