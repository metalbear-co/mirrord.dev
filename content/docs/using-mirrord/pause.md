---
title: "Pause (reading from queues)"
description: "How to pause the remote target when running mirrord"
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
weight: 140
toc: true
---

mirrord strives to have as little effect on the remote environment as possible, so when you select a remote target, it does nothing to affect its operation. However, this can be problematic when the application reads from a queue or message broker - both your local process and the remote target will be competing for the same messages, a competition that your remote target, with the advantage of being in the cluster, will most often win.
For this purpose, mirrord supports the pause feature. When enabled, mirrord will pause the remote target when it starts running, and unpause it when it stops. This way, your local process will be the only one reading from the queue, and you can test out how it handles messages without worrying about the remote target interfering.

To enable the pause feature, simply change the `pause` configuration to `true`:

```json
{
  "pause": true
}
```

If the remote target also receives incoming traffic, you might want to use [traffic stealing](/docs/guides/steal) as well, so that your local process answers any incoming requests instead of the (paused) remote target. This is especially important if the remote target receives health checks, because pausing it without the local process answering those healthchecks for it might cause it to be restarted by Kubernetes.

[mirrord for Teams](/docs/teams/introduction/) offers a new, improved way to effectively pause whole deployments,
check out [Copy Target](/docs/teams/copy-target/) for more information.

## What's next?
1. If you'd like to intercept traffic rather than mirror it so that your local process is the one answering the remote requests, check out [this guide](/docs/guides/steal/). Note that you can even filter which traffic you intercept!
2. If you don't want to impersonate a remote target - for example, if you want to run a tool in the context of your cluster - check out our [guide on the targetless mode](/docs/guides/targetless/).
3. If you just want to learn more about mirrord, why not checkout our [architecture](/docs/overview/architecture/) or [configuration](/docs/overview/configuration/) sections?