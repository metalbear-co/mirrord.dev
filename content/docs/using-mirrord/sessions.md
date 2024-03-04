---
title: "Sessions"
description: "Session management for the mirrord Operator"
date: 2024-03-04T00:00:00+00:00
lastmod: 2024-03-04T00:00:00+00:00
draft: false
images: []
menu:
  docs:
    parent: "using-mirrord"
weight: 130
toc: true
tags: ["team", "enterprise"]
---

## Stop active Operator sessions

Whenever a user starts mirrord with the `operator` feature enabled, the Operator assigns a
session to this user, until they stop running mirrord, at which point the session is closed
in the Operator automatically. Users may also forcefully stop a session with the
`mirrord operator session` CLI commands. These allow users to manually close Operator sessions
while they're still alive (user is still running mirrord).

The session management commands are:

- `mirrord operator session kill-all` which will forcefully stop **ALL** sessions!
- `mirrord operator session kill --id {id}` which will forcefully stop a session with `id`,
  where you may obtain the session id through `mirrord operator status`;

### `sessions` RBAC

Every `mirrord-operator-user` has access to **all** session operations by **default**, as they come
with `deletecollection` and `delete` privileges for the `sessions` resource. You may limit
this by changing the RBAC configuration. Here is a sample `role.yaml` with the other Operator
rules omitted:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: mirrord-operator-user
rules:
- apiGroups:
  - operator.metalbear.co
  resources:
  - sessions
  verbs:
  - deletecollection
  - delete
```

- `mirrord operator session kill-all` requires the `deletecollection` verb;
- `mirrord operator session kill --id {id}` requires the `delete` verb;
