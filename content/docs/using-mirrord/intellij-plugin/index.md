---
title: "IntelliJ Plugin"
description: "Using the mirrord plugin in JetBrains' IDEs"
date: 2025-01-07T00:00:00+00:00
lastmod: 2025-01-07T00:00:00+00:00
draft: false
menu:
  docs:
    parent: "using-mirrord"
weight: 160
toc: true
tags: ["open source", "team", "enterprise"]
---

If you develop your application in one of the JetBrains' IDEs (e.g PyCharm, IntelliJ or GoLand), you can debug it with mirrord using our JetBrains Marketplace [plugin](https://plugins.jetbrains.com/plugin/19772-mirrord). Simply:
1. Download the plugin
2. Enable mirrord using the toolbar button (next to "mirrord" popup menu)
{{<figure src="images/enabler.png" alt="Select Active Config action">}}
3. Run or debug your application as you usually do

When you start a debugging session with mirrord enabled, you'll be prompted with a target selection dialog.
This dialog will allow you to select the target in your Kubernetes cluster that you want to impersonate.

> __Note__: For some projects, the plugin might not be able to present the target selection dialog.
>
> When this happens, you'll see a warning notification and the execution will be cancelled.
> You can still use mirrord, but you'll have to specify the target in mirrord config.
>
> This is known to happen with Java projects using the IntelliJ build system.

The toolbar button enables/disables mirrord for all run and debug sessions.

mirrord's initial state on startup can be configured in the plugin settings (`Settings -> Tools -> mirrord -> Enable mirrord on startup`)

## Enabling/disabling mirrord for a specific run configuration

mirrord can be persistently enabled or disabled for a specific run configuration, regardless of the toolbar button state.
This is controlled via the `MIRRORD_ACTIVE` environment variable in your run configuration.

To have mirrord always enabled for the given run configuration, set `MIRRORD_ACTIVE=1` in the run configuration's environment variables.
To have mirrord always disabled, set `MIRRORD_ACTIVE=0`.

## Selecting Session Target

mirrord's target can be specified in two ways: with the target selection dialog or with the mirrord config.

If the mirrord config does not specify the target, you will be prompted with the dialog each time you start a new session.

The dialog will only show targets in the namespace specified in the mirrord config.
If the namespace is not specified, your Kubernetes user's default namespace will be used.

## Using the mirrord Config

The plugin allows for using the [mirrord config](/docs/reference/configuration).
For any run/debug session, the mirrord config to be used can be specified in multiple ways:

### Active Config

The toolbar dropdown menu allows for specifying a temporary mirrord config override.
This config will be used for all run/debug sessions.

To specify the override, use `Select Active Config` action.

{{<figure src="images/select-active-config.png" alt="Select Active Config action">}}

You will be prompted with a dialog where you can select a mirrord config from your project files.
For the file to be present in the dialog, its path must contain `mirrord` and end with either `.json`, `.yaml` or `.toml`.

You can remove the override using the same action.

### Config For Run Configuration

If no active config is specified, the plugin will try to read the config file path from the `MIRRORD_CONFIG_FILE` environment variable specified in the run configuration.

This path should be absolute.

### Config From Default Path

If config file path is not specified in the run configuration environment, the plugin will try to find a default config.

Default config is the lexicographically first file in `<PROJECT ROOT>/.mirrord` directory that ends with either `.json`, `.yaml` or `.toml`.

## Managing the mirrord Binary

The plugin relies on the standard mirrord CLI binary.

By default, the plugin checks latest release version and downloads the most up-to-date binary in the background.
You can disable this behavior in the plugin settings (`Settings -> Tools -> mirrord -> Auto update mirrord binary`).

You can also pin the binary version in the plugin settings (`Settings -> Tools -> mirrord -> mirrord binary version`).

## WSL

The guide on how to use the plugin with remote development on WSL can be found [here](/docs/using-mirrord/wsl/#root-project-intellij).