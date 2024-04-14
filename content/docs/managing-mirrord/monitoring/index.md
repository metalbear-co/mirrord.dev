---
title: "Monitoring"
description: "Monitoring with mirrord for Teams"
date: 2024-04-01T13:37:00+00:00
lastmod: 2024-04-01T13:37:00+00:00
draft: false
images: []
linktitle: "Monitoring"
menu:
docs:
teams:
weight: 500
toc: true
tags: ["team", "enterprise"]
---

## Monitoring

The mirrord Operator can produce logs in JSON format that can be digested by most popular logging solutions (DataDog, Dynatrace, etc).
To enable JSON logging, set `operator.jsonLog` to `true` in the Operator Helm chart values.
The log level is `INFO` by default, and can be changed using the `RUST_LOG` environment variable in the Operator container, which takes values in the following format: `mirrord={log_level}` (e.g. `mirrord=debug`).