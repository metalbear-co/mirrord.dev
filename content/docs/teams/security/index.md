---
title: "Security - mirrord for Teams"
description: "Security in mirrord for Teams"
date: 2022-07-10T08:48:57+00:00
lastmod: 2022-07-10T08:48:57+00:00
draft: false
images: []
linktitle: "Security"
menu:
  docs:
    teams:
weight: 1
toc: true
---

## I'm a Security Engineer evaluating mirrord for Teams, what do I need to know?

- mirrord for Teams is completely on-prem. The only data sent to our cloud is analytics and license verification which can be customized or disabled upon request.
- The analytics don't contain PII or any sensitive information.
- mirrord for Teams uses Kubernetes RBAC, meaning it doesn't add a new attack vector to your cluster.
- The Kubernetes operator installed in the cluster as part of mirrord for Teams is licensed as Source Available (but not yet public) and we'll be happy to share the code if needed for review.
- mirrord for Teams defines a new CRD that can be used to limit access and use of mirrord, with plans of more fine-grained permissions in the future.
- The operator requires permissions to create a job with the following capabilities in its Kubernetes namespace:
    - `CAP_NET_ADMIN` - for modifying routing tables
    - `CAP_SYS_PTRACE` - for reading the target pod's environment variables
    - `CAP_SYS_ADMIN` - for joining the target pod's network namespace
- Missing anything? Feel free to ask us on Discord or hi@metalbear.co