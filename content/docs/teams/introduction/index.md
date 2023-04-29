---
title: "Introduction"
description: "Intro to mirrord for Teams"
date: 2022-05-26T08:48:57+00:00
lastmod: 2022-05-26T08:48:57+00:00
draft: false
images: []
menu:
  docs:
    parent: "teams"
weight: 100
toc: true
---

> mirrord for Teams is currently in closed beta. Go [here](https://metalbear.co/#waitlist-form) to join the waitlist.

## Why mirrord for Teams?

So you've tried out mirrord on your cloud development environment and you liked it. You've even shown it to your teammates, and they tried it out on their own personal environments. Great! Now you might want to use mirrord together on your shared staging environment. This is where things might get tricky:
1. Your DevOps team might not be too happy about giving everyone's user privileged permissions to the staging environment.
2. Two or more developers might want to run mirrord simultaneously on the same pod without clashing.
3. You might be sharing the staging environment with other teams, who wouldn't want you to mess with their components.

You might have guessed that this is where mirrord for Teams comes in.

## How It Works

In the basic version of mirrord, mirrord injects itself into the local process, and creates a pod in the cloud environment. It's completely standalone, and is unaware of other instances of mirrord running on the same cluster. 

In mirrord for Teams, we introduce a new component - the mirrord Operator. The Operator is a Kubernetes operator that runs persistently in the cluster and manages the mirrord instances trying to access it. The Operator itself is the one creating mirrord agents, so individual users no longer require elevated Kubernetes permissions to use mirrord. Additionally, a centralized component makes possible things like simultaneous use or limiting access or specific actions to certain cluster components.