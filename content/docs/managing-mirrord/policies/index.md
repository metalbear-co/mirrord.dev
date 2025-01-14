---
title: "Policies"
description: "Limiting available features for selected targets with mirrord for Teams"
date: 2024-01-03T13:37:00+00:00
lastmod: 2024-01-03T13:37:00+00:00
draft: false
images: []
linktitle: "Policies"
menu:
docs:
teams:
weight: 500
toc: true
tags: ["team", "enterprise"]
---

## Policies

The installation of the mirrord operator defines two [custom resources](
https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) in your cluster:
the namespaced `MirrordPolicy` and the clusterwide `MirrordClusterPolicy`. With these policies you can limit
the use of some features of mirrord for selected targets.

- `MirrordPolicy` and `MirrordClusterPolicy` have the exact same specification;
- `MirrordPolicy` applies only to targets living in the same namespace;
- `MirrordClusterPolicy` applies to all targets in the cluster.

### Blockable features

Currently the set of blockable features contains:
* `steal` - prevents stealing traffic from the targeted pods;
* `steal-without-filter` - prevents stealing traffic from the targeted pods, unless HTTP filter is used;
* `mirror` - prevents mirroring traffic from the targeted pods.

If you are not using the latest operator version, the set of supported blockable features might be different.
In order to see the exact set of features you can block, use the following `kubectl` command:

```shell
kubectl get crd mirrordpolicies.policies.mirrord.metalbear.co -o jsonpath='{.spec.versions[-1].schema.openAPIV3Schema.properties.spec.properties.block.items.enum}'
```

### Controllable features

Some policies are not for outright blocking features, instead they change or override behaviour.

* `env` - changes how environment variables may be retrieved from the target, overriding
  what the user has set in their `mirrord.json` config file;
  * `exclude` - the environment variables in this list **WON'T** be retrieved from the target,
  instead mirrord will either use the locally available env vars (if they exist in the user's
  machine), or these env vars will be missing completely;
* `fs` - changes file operations behaviour, giving the operator control over which files
  may be accessed from the target, and in which modes. Overrides what the user has set in
  their `mirrord.json` config file;
  * `readOnly` - files that match any of the patterns specified here must be opened as
    **read-only**, otherwise the operation will fail;
  * `local` - matching files will be forced to be opened locally, on the user's machine,
    instead of in the target;
  * `notFound` - any matching files will return a _not found_ error as if the file is not
    present in the target, even if it exists there;
 
### Restricting targets affected by mirrord policies

By default, mirrord policies apply to all targets in the namespace or cluster.
You can use a target path pattern (`.spec.targetPath`) and/or a [label selector](
https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#resources-that-support-set-based-requirements)
(`.spec.selector`) in order to limit the targets to which a policy applies.

The target path of a mirrord run is either `targetless` or has the form `<TARGET_TYPE>/<NAME>` followed by an optional
`/container/<CONTAINER_NAME>`, where `<TARGET_TYPE>` is one of `deploy`, `pod`, `rollout` and `statefulset`.

Examples for possible target paths:
- `deploy/boats`
- `pod/boats-5fffb9767c-w92qh`
- `pod/boats-5fffb9767c-w92qh/container/appcontainer`
- `targetless`

By specifying a `targetPath` pattern in the policy, you limit the policy to only apply to runs that have
a target path that matches the specified pattern.

The target path pattern can contain `?`, which will match a single character, and `*`, which will match arbitrarily many
characters.
For example, `"deploy/*"` will make a policy apply for any run with a deployment target. `"*boats*"` will make a
policy apply to any target with `boats` in its name, e.g. `pod/boats-2kljw9`,
`pod/whatever-23oije2/container/boats-container`, etc.

> __Note__: when mirrord user specifies a container for the mirrord run, the target path ends with `/container/<CONTAINER_NAME>`.
>
> This means the pattern `deploy/my-deployment` will not match when a container is specified. That pattern can be
> changed to `deploy/my-deployment*` to also match on runs with a specified container (but will then also match
> `deploy/my-deployment-1` etc.)


Please note that the policy is applied according to the target given to mirrord. It is possible for a policy to apply
to a deployment target, but not to apply to the deployment's pods when targeted directly. For example, the following
policy:

```yaml
apiVersion: policies.mirrord.metalbear.co/v1alpha
kind: MirrordPolicy
metadata:
  name: block-stealing-from-boats-deployment
  namespace: default
spec:
  targetPath: "deploy/boats*"
  block:
    - steal
```

prevents mirrord users from stealing traffic when using the whole `boats` deployment as a target. However, a user could
still use a specific pod out of that deployment as a target for mirrord and steal its traffic. In order to prevent that,
the `targetPath` pattern or the label selector needs to be changed to match the pods of that deployment.

If a workload is used as a target, this workload's labels will be used to match against policies' `selector`, if
set. If a pod is used as a target, the pod's labels will be used.

Another example of a policy:

```yaml
apiVersion: policies.mirrord.metalbear.co/v1alpha
kind: MirrordPolicy
metadata:
  name: block-unfiltered-stealing-from-webserver-deployments
  namespace: books
spec:
  targetPath: "deploy/*"
  selector:
    matchLabels:
      component: webserver
  block:
    - steal-without-filter
    - mirror
```

This policy blocks mirroring and unfiltered stealing of traffic coming to all deployments in the namespace `books`
which are marked with label `component: webserver`.
