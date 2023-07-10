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
weight: 100
toc: true
---

## I'm a Security Engineer evaluating mirrord for Teams, what do I need to know?

- mirrord for Teams is completely on-prem solution. The only data sent to our cloud is analytics/billing which can be customized/disabled upon request.
- The analytics don't contain PII or any sensitive information.
- mirrord for Teams uses k8s RBAC and access, meaning it doesn't add or expose a new vector to your cluster.
- the operator installed in the cluster is defined as Source Available (but not yet public) and we'll be happy to share the code if needed for review.
- mirrord for Teams defines a new CRD that can be used to limit access and use of mirrord, with plans of more fine-grained permissions in planning.
- The operator requires permissions to create a job with the following capabilities in its k8s namespace:
    - `CAP_NET_ADMIN` - for modifying routing tables
    - `CAP_SYS_PTRACE` - for reading target pod environment
    - `CAP_SYS_ADMIN` - for joining target pod network namespace
- Missing anything? Feel free to ask us on Discord or hi@metalbear.co