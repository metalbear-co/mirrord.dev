---
title: "See Active Sessions"
description: "How to see active sessions"
date: 2024-02-20T11:59:39+01:00
lastmod: 2024-02-20T11:59:39+01:00
draft: false
weight: 150
toc: true
tags: ["team", "enterprise"]
---

When the operator is installed as part of mirrord for Teams, users can use the command `mirrord operator status` to see active sessions in the cluster.
For example, in the following output we can see the session ID, the target used, the namespace of the target, the session duration and the User running that session. We can also see that `Ports` is empty meaning the user doesn't steal or mirror any traffic at the moment.
```
+------------------+-----------------------------+-----------+---------------------------------------------------------------+-------+------------------+
| Session ID       | Target                      | Namespace | User                                                          | Ports | Session Duration |
+------------------+-----------------------------+-----------+---------------------------------------------------------------+-------+------------------+
| 487F4F2B6D2376AD | deployment/ip-visit-counter | default   | Aviram Hassan/aviram@metalbear.co@avirams-macbook-pro-2.local |       | 4s               |
+------------------+-----------------------------+-----------+---------------------------------------------------------------+-------+------------------+
```

The User field is generated in the following format - whoami/k8s-user/hostname. whoami is from the local machine, and the hotname, while k8s user is the user we see from the operator side.


In this example, we can see that the session has an active steal on port 80, filtering http traffic with the following filter: `X-PG-Tenant: Avi.+`

```
+------------------+-----------------------------+-----------+---------------------------------------------------------------+----------------------------------------------------------+------------------+
| Session ID       | Target                      | Namespace | User                                                          | Ports                                                    | Session Duration |
+------------------+-----------------------------+-----------+---------------------------------------------------------------+----------------------------------------------------------+------------------+
| C527FE7D9C30979E | deployment/ip-visit-counter | default   | Aviram Hassan/aviram@metalbear.co@avirams-macbook-pro-2.local | Port: 80, Type: steal, Filter: header=X-PG-Tenant: Avi.+ | 13s              |
+------------------+-----------------------------+-----------+---------------------------------------------------------------+----------------------------------------------------------+------------------+
```