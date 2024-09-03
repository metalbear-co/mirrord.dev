---
title: "Port Forwarding"
description: "How to use mirrord for port forwarding"
date: 2024-09-03T15:39:44+01:00
lastmod: 2024-09-03T15:39:44+01:00
draft: false
menu:
  docs:
    parent: "using-mirrord"
weight: 140
toc: true
tags: ["open source", "team", "enterprise"]
---

The port-forward command allows you to forward traffic from a local port to a destination in the cluster, in a similar way to `kubectl port-forward`. However, it uses the existing permissions on the target pod, allowing you to port-forward to destinations only accessible from the target. This includes locations outside the cluster like third-party APIs.

You can use the command like so:
```bash
mirrord port-forward --target <target-path> -L <local port>:<remote address>:<remote port>
```

For example, to forward traffic from localhost:8080 to py-serv on port 80 in targetless mode:
```bash
mirrord port-forward -L 8080:py-serv:80
```

### More details

- The local port part of the argument is optional, with out the same port will be used locally as on the remote.
- Port-forwarding only supports TCP, not UDP.
- The remote address can be an IPv4 address or a hostname - hostnames are resolved in the cluster.
- Connections are made lazily, so a hostname may fail to resolve only after mirrord attempts to send it data.

In the future, mirrord will also support reverse port-forwarding ([tracked by this issue](https://github.com/metalbear-co/mirrord/issues/2609)).