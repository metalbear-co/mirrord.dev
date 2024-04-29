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

## Functional Logs

The following logs are written with log level `INFO`, and can be used for dashboards within monitoring solutions in order to monitor mirrord usage within your organization:

Log messages:
- Target Copied
- Port Stolen
- Port Mirrored
- Port Released
- Session Started
- Session Ended

Fields:

|field|description|events|
|---|---|---|
|target|the session's target|`All`|
|client_hostname|`whoami::hostname` of client|`All`|
|client_name|`whoami::realname` of client|`All`|
|client_user|Kubernetes user of client (via k8s RBAC)|`All`|
|session_id|unique id for individual mirrord sessions|`Port Steal` `Port Mirrored` `Port Released` `Session Started` `Session Ended`|
|session_duration|the session's duration in seconds|`Session Ended`|
|port|port number|`Port Stolen` `Port Mirrored` `Port Released`|
|http_filter|the client's configured [HTTP Filter](https://mirrord.dev/docs/reference/configuration/#feature-network-incoming-http-filter)|`Port Stolen`|
|scale_down|whether the session's target was scaled down|`Target Copied`|



## DataDog dashboard

We offer a DataDog dashboard you can import to track statistics (working on official DD integration as well).
Download it <a href="/Mirrord_Operator_Dashboard.json" download>here</a>