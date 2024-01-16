---
title: "Policies - mirrord for Teams"
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
---

## Mirrord Policies

The installation of the mirrord operator defines a [custom resource](
https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
named `MirrordPolicy` on your cluster.
By creating policies you can limit the use of some features of mirrord with selected targets.
In order to see a list of the features you can block in a policy you can run
```shell
kubectl get crd mirrordpolicies.policies.mirrord.metalbear.co -o jsonpath='{.spec.versions[-1].schema.openAPIV3Schema.properties.spec.properties.block.items.enum}'
```
You can optionally set a target path pattern and/or a [label selector](
https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#resources-that-support-set-based-requirements)
in order to limit the targets for which a policy applies.

The target path of a mirrord run is either `targetless` or has the form `<TARGET_TYPE>/<NAME>` followed by an optional
`/container/<CONTAINER_NAME>`, where `<TARGET_TYPE>` is one of `deploy`, `pod` and `rollout`.

Examples for possible target paths:
- `deploy/boats`
- `pod/boats-5fffb9767c-w92qh`
- `pod/boats-5fffb9767c-w92qh/container/appcontainer`
- `targetless`

By specifying a `targetPath` pattern in the policy, you limit the policy to only apply to runs that have
a target path that matches the specified pattern.
The target path pattern can contain `?` which will match a single character and `*` which will match arbitrarily many
characters.
For example, `"deploy/*"` will make a policy apply for any run with a deployment target. `"*boats*"` will make a
policy apply to any target with `boats` in its name, e.g. `pod/boats-2kljw9`,
`pod/whatever-23oije2/container/boats-container`, etc.

> __Note__: when a container is specified for the mirrord run, the target path ends with `/container/<CONTAINER_NAME>`.
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

If a deployment is used as a target, the deployment's labels will be used to match against policies' `selector`, if
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
```
