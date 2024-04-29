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

_functional logs are available from operator version 3.80.0 / Chart version 1.3.2 and are currently WIP, meaning it can change_

The following logs are written with log level `INFO`, and can be used for dashboards within monitoring solutions in order to monitor mirrord usage within your organization:

Log messages:
- Copy Target
- Port Steal
- Port Mirror
- Port Release
- Session Start
- Session End

Fields:

|field|description|events|
|---|---|---|
|client_hostname|`whoami::hostname` of client|`All`|
|client_name|`whoami::realname` of client|`All`|
|client_user|Kubernetes user of client (via k8s RBAC)|`All`|
|http_filter|The client's configured [HTTP Filter](https://mirrord.dev/docs/reference/configuration/#feature-network-incoming-http-filter)|`Port Steal`|
|port|port number (if relevant)|`Port Steal` `Port Mirror` `Port Release`|
|scale_down|whether the session's target was scaled down|`Copy Target`|
|session_id|unique id for individial mirrord execution (base64)|`Port Steal`
`Port Mirror` `Port Release` `Session Start` `Session End`|
|session_duration|time in seconds of session's existance|`Session End`|
|target|kubernetes resource targeted|`All`|


## DataDog dashboard

We offer a DataDog dashboard you can import to track statistics (working on official DD integration as well).
Download it <a href="/Mirrord_Operator_Dashboard.json" download>here</a>