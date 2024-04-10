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

mirrord Operator can produce logs in JSON format to be digested by most logging solutions (DataDog, Dynatrace, etc).
To enable JSON logging, specify `json_log: true` under `operator` in the operator helm chart values.
Log level is info by default, and can be altered via operator deployment env using `RUST_LOG` (directive)[https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html].