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

For example, to forward traffic from localhost:8080 to py-serv on port 80 (in targetless mode):
```bash
mirrord port-forward -L 8080:py-serv:80
```

It also allows for reverse port forwarding, where traffic to a port on the target pod is forwarded to a local one, like so:
```bash
mirrord port-forward --target <target-path> -R <remote port>:<local port>
```

In addition, multiple ports can be forwarded in one direction or both directions simultaneously in the same command by providing each source and destination as a separate `-L` or `-R` argument.
### More details

- The local port component of the `-L` argument is optional, and without it the same port will be used locally as on the remote.
- The same is true of the `-R` argument: if one port number is provided, it will be used for both local and remote ports.
- Port-forwarding only supports TCP, not UDP.
- The remote address can be an IPv4 address or a hostname - hostnames are resolved in the cluster.
- Connections are made lazily, so a hostname may fail to resolve only after mirrord attempts to send it data.