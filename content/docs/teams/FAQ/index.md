---
title: "FAQ"
description: "FAQ for mirrord for Teams"
draft: false
images: []
linktitle: "FAQ"
weight: 130
toc: true
---

## General

### `mirrord operator status` fails with `503 Service Unavailable` on GKE

If private networking is enabled, it is likely due to firewall rules blocking the mirrord operator's API service from the API server. To fix this, add a firewall rule that allows your cluster's master nodes to access TCP port 3000 in your cluster's pods. Please refer to the [GCP docs](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters#add_firewall_rules) for information.
