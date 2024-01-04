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

# Mirrord Policies

The installation of the mirrord operator defines a [custom resource](
https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
named `MirrordPolicy` on your cluster.
By creating policies you can limit the use of some feature of mirrord with selected targets.
In order to see a list of the features you can block in a policy you can run
```shell
kubectl get crd mirrordpolicies.policies.mirrord.metalbear.co -o jsonpath='{.spec.versions[-1].schema.openAPIV3Schema.properties.spec.properties.block.items.enum}'
```
You can optionally set a target path pattern and/or a [label selector](
https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#resources-that-support-set-based-requirements)
in order to limit the targets for which a policy applies.

The target path pattern can contain `?` which will match a single character and `*` arbitrarily many characters.
For example, `"deploy/*"` will make a policy apply for any run with a deployment target. `"*boats*"` will make a
policy apply to any target with `boats` in its name, e.g. `pod/boats-2kljw9`,
`pod/whatever-23oije2/container/boats-container`, etc.

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
  targetPath: "deploy/boats"
  block:
    - steal
```

prevents mirrord users from stealing traffic when using the whole `boats` deployment as a target. However, a user could
steal use a specific pod out of that deployment as a target for mirrord and steal its traffic. In order to prevent that,
the `targetPath` pattern or the label selector need to be changed to match the pods of that deployment.

If a deployment is used as a target the deployment's labels will be used to match against policies' `selector`, if
set. If a pod is used as a target, the pod's labels will be used.

