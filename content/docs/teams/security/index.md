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
weight: 500
toc: true
---

## I'm a Security Engineer evaluating mirrord for Teams, what do I need to know?

- mirrord for Teams is completely on-prem. The only data sent to our cloud is analytics and license verification which can be customized or disabled upon request. The analytics don't contain PII or any sensitive information.
- mirrord for Teams uses Kubernetes RBAC, meaning it doesn't add a new attack vector to your cluster.
- The Kubernetes operator installed in the cluster as part of mirrord for Teams is licensed as Source Available (but not yet public) and we'll be happy to share the code if needed for review.
- mirrord for Teams defines a new CRD that can be used to limit access and use of mirrord, with plans of more fine-grained permissions in the future.
- The operator requires permissions to create a job with the following capabilities in its Kubernetes namespace:
    - `CAP_NET_ADMIN` - for modifying routing tables
    - `CAP_SYS_PTRACE` - for reading the target pod's environment variables
    - `CAP_SYS_ADMIN` - for joining the target pod's network namespace
- Missing anything? Feel free to ask us on Discord or hi@metalbear.co

## How do I configure Role Based Access Control for mirrord for Teams?

mirrord for Teams works on top of Kubernetes' built-in RBAC with the following resources, `mirrordoperators`, `mirrordoperators/certificate`, `targets`, and `targets/port-locks` under the `operator.metalbear.co` apiGroup. The first two resources are required at a cluster level, and the last two can be allowed at a namespace level.

You can limit a user's ability to use mirrord on specific targets by limiting their access to the `target` resource. The specific verbs for rules to our resources can be copied from the examples below.

For your convenience, mirrord for Teams includes a built-in ClusterRole called `mirrord-operator-user`, which controls access to the Operator API. To grant access to the Operator API, you can create a ClusterRoleBinding like this:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
subjects:
- kind: User
  name: jim
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: mirrord-operator-user
  apiGroup: rbac.authorization.k8s.io`
```

In addition, the Operator impersonates any user that calls its API, and thus only operates on pods or deployments for which the user has `get` permissions.

Below is the ClusterRole's yaml, which you can modify to suit your needs:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: mirrord-operator-user
rules:
- apiGroups:
  - operator.metalbear.co
  resources:
  - mirrordoperators
  - targets
  - targets/port-locks
  verbs:
  - get
  - list
- apiGroups:
  - operator.metalbear.co
  resources:
  - mirrordoperators/certificate
  verbs:
  - create
- apiGroups:
  - operator.metalbear.co
  resources:
  - targets
  verbs:
  - proxy
  ```

  ### How do I limit user access to a specific namespace?
  Create a ClusterRoleBinding between the user and the `mirrord-operator-user` role, but only grant the user access to `get` pods or deployments on the allowed namespace. The Operator will impersonate the user and so only have access to their allowed targets.

  ### How do I limit user access to a specific target?
  If the user doesn't have `get` access to the targets, then they won't be able to use target them with mirrord. However, if you want to allow `get` access to targets but disallow using mirrord on them, we recommend creating a new role based on the `mirrord-operator-user` role above, and adding a `resourceNames` field to the `targets` resource. This will limit the user to only using the Operator on the specified targets. For example:
  ```yaml
  - apiGroups:
    - operator.metalbear.co
    resources:
    - targets
    resourceNames:
    - "my-deployment"
    verbs:
    - proxy
  ```