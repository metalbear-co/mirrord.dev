<!-- file derive/src/config/field.rs -->
<!-- struct ConfigField -->


<!-- impl ConfigField::fn is_option -->
Check if field is `Option<T>` and if so return type of `T`
<!-- impl ConfigField::fn definition -->


<!-- impl ConfigField::fn implmentation -->

//* ```
<!-- file derive/src/config/flag.rs -->
<!-- struct ConfigFlags -->


<!-- file src/agent.rs -->
<!-- struct AgentConfig -->
# agent

Configuration for the mirrord-agent pod that is spawned in the Kubernetes cluster.

## Minimal `agent` config

We provide sane defaults for this option, so you don't have to set up anything here.

## Advanced `agent` config

```json
{
  "agent": {
    "log_level": "info",
    "namespace": "default",
    "image": "ghcr.io/metalbear-co/mirrord:latest",
    "image_pull_policy": "IfNotPresent",
    "image_pull_secrets": [ { "secret-key": "secret" } ],
    "ttl": 30,
    "ephemeral": false,
    "communication_timeout": 30,
    "startup_timeout": 360,
    "network_interface": "eth0",
    "pause": false,
    "flush_connections": false,
  }
}
```
<!-- struct AgentConfig::variant log_level -->
## log_level

Log level for the agent.

Supports any string that would work with `RUST_LOG`.

```json
{
  "agent": {
    "log_level": "mirrord=debug,warn",
  }
}
```
<!-- struct AgentConfig::variant namespace -->
## namespace

Namespace where the agent shall live.

Defaults to the current kubernetes namespace.
<!-- struct AgentConfig::variant image -->
## image

Name of the agent's docker image.

Useful when a custom build of mirrord-agent is required, or when using an internal
registry.

Defaults to the latest stable image `"ghcr.io/metalbear-co/mirrord:latest"`.

```json
{
  "agent": {
    "image": "internal.repo/images/mirrord:latest"
  }
}
```
<!-- struct AgentConfig::variant image_pull_policy -->
## image_pull_policy

Controls when a new agent image is downloaded.

Supports any valid kubernetes
[image pull policy](https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy)

Defaults to `"IfNotPresent"`
<!-- struct AgentConfig::variant image_pull_secrets -->
## image_pull_secrets

List of secrets the agent pod has access to.

Takes an array of hash with the format `{ name: <secret-name> }`.

Read more [here](https://kubernetes.io/docs/concepts/containers/images/).

```json
{
  "agent": {
    "image_pull_secrets": [
      "very-secret": "secret-key",
      "very-secret": "keep-your-secrets"
    ]
  }
}
```
<!-- struct AgentConfig::variant ttl -->
## ttl

Controls how long the agent pod persists for after the agent exits (in seconds).

Can be useful for collecting logs.

Defaults to `1`.
<!-- struct AgentConfig::variant ephemeral -->
## ephemeral

Runs the agent as an
[ephemeral container](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/)

Defaults to `false`.
<!-- struct AgentConfig::variant communication_timeout -->
## communication_timeout

Controls how long the agent lives when there are no connections.

Each connection has its own heartbeat mechanism, so even if the local application has no
messages, the agent stays alive until there are no more heartbeat messages.
<!-- struct AgentConfig::variant startup_timeout -->
## startup_timeout

Controls how long to wait for the agent to finish initialization.

If initialization takes longer than this value, mirrord exits.

Defaults to `60`.
<!-- struct AgentConfig::variant network_interface -->
## network_interface

Which network interface to use for mirroring.

The default behavior is try to access the internet and use that interface. If that fails
it uses eth0.
<!-- struct AgentConfig::variant pause -->
## pause

Controls target pause feature. Unstable.

With this feature enabled, the remote container is paused while clients are connected to
the agent.

Defaults to `false`.
<!-- struct AgentConfig::variant flush_connections -->
## flush_connections

Flushes existing connections when starting to steal, might fix issues where connections
aren't stolen (due to being already established)

Defaults to `true`.
<!-- file src/config/from_env.rs -->
<!-- struct FromEnvWithError -->
This is the same as `FromEnv` but doesn't discard the error
returned from parse. This is for parsing `Target`.
I (A.H) couldn't find any better way to do this since you can't
do specialization on associated types.
<!-- file src/config.rs -->
<!-- enum ConfigError -->
Error that would be returned from [MirrordConfig::generate_config]
<!-- trait MirrordConfig -->
Main configuration creation trait of mirrord-config
<!-- trait MirrordConfig::type Generated -->
The resulting struct you plan on using in the rest of your code
<!-- trait MirrordConfig::fn generate_config -->
Load configuration from all sources and output as [Self::Generated]
<!-- trait FromMirrordConfig -->
Lookup trait for accessing type implementing [MirrordConfig] from [MirrordConfig::Generated]
<!-- file src/env.rs -->
<!-- struct EnvConfig -->
# env

Allows the user to set or override the local process' environment variables with the ones from
the remote pod.

Which environment variables to load from the remote pod are controlled by setting either
[`include`](##include) or [`exclude`](##exclude).

See the environment variables [reference](https://mirrord.dev/docs/reference/env/) for more
details.

## Example `env` config

```json
{
  "feature": {
    "env": {
      "include": "DATABASE_USER;PUBLIC_ENV",
      "exclude": "DATABASE_PASSWORD;SECRET_ENV",
      "override": {
        "DATABASE_CONNECTION": "db://localhost:7777/my-db",
        "LOCAL_BEAR": "panda"
      }
    }
  }
}
```
<!-- struct EnvConfig::variant include -->
## include

Include only these remote environment variables in the local process.

Value is a list separated by ";".

Some environment variables are excluded by default (`PATH` for example), including these
requires specifying them with `include`
<!-- struct EnvConfig::variant exclude -->
## exclude

Include the remote environment variables in the local process that are **NOT** specified by
this option.

Value is a list separated by ";".
<!-- struct EnvConfig::variant overrides -->
## override

Allows setting or overriding environment variables (locally) with a custom value.

For example, if the remote pod has an environment variable `REGION=1`, but this is an
undesirable value, it's possible to use `overrides` to set `REGION=2` (locally) instead.
<!-- file src/feature.rs -->
<!-- struct FeatureConfig -->
# feature

Configuration for mirrord features.

For more information, check the [technical reference](https://mirrord.dev/docs/reference/)
of the feature.

## Minimal `feature` config

The [`fs`](#fs) and [`network`](#network) options have support for a shortened version.

```json
{
  "feature": {
    "env": {
      "include": "DATABASE_USER;PUBLIC_ENV",
      "exclude": "DATABASE_PASSWORD;SECRET_ENV",
      "overrides": {
        "DATABASE_CONNECTION": "db://localhost:7777/my-db",
        "LOCAL_BEAR": "panda"
      }
    },
    "fs": "read",
    "network": "mirror",
    "capture_error_trace": false
  }
}
```

## Advanced `feature` config

```json
{
  "feature": {
    "env": {
      "include": "DATABASE_USER;PUBLIC_ENV",
      "exclude": "DATABASE_PASSWORD;SECRET_ENV",
      "overrides": {
        "DATABASE_CONNECTION": "db://localhost:7777/my-db",
        "LOCAL_BEAR": "panda"
      }
    },
    "fs": {
      "mode": "write",
      "read_write": ".+\.json" ,
      "read_only": [ ".+\.yaml", ".+important-file\.txt" ],
      "local": [ ".+\.js", ".+\.mjs" ]
    },
    "network": {
      "incoming": {
        "mode": "steal",
        "http_header_filter": {
          "filter": "host: api\..+",
          "ports": [80, 8080]
        },
        "port_mapping": [{ 7777: 8888 }],
        "ignore_localhost": false,
        "ignore_ports": [9999, 10000]
      },
      "outgoing": {
        "tcp": true,
        "udp": true,
        "ignore_localhost": false,
        "unix_streams": "bear.+"
      },
      "dns": false
    },
    "capture_error_trace": false
  }
}
```
<!-- struct FeatureConfig::variant env -->
## env

Controls the environment variables feature, see [`EnvConfig`](#env).

For more information, check the environment variables
[technical reference](https://mirrord.dev/docs/reference/env/).
<!-- struct FeatureConfig::variant fs -->
## fs

Controls the file operations feature, see [`FsConfig`](#fs).

For more information, check the file operations
[technical reference](https://mirrord.dev/docs/reference/fileops/).
<!-- struct FeatureConfig::variant network -->
## network

Controls the network feature, see [`NetworkConfig`](#network).

For more information, check the network traffic
[technical reference](https://mirrord.dev/docs/reference/traffic/).
<!-- struct FeatureConfig::variant capture_error_trace -->
## capture_error_trace

Controls the crash reporting feature.

With this feature enabled, mirrord generates a nice crash report log.

Defaults to `false`.
<!-- file src/fs/advanced.rs -->
<!-- struct FsConfig -->
# fs advanced

Advanced user configuration for file operations.

Allows the user to specify:

What is the default behavior for file operations:
1. read - Read from the remote file system (default)
2. write - Read/Write from the remote file system.
3. local - Read from the local file system.
4. disabled - Disable file operations.

Besides the default behavior, user can specify behavior for specific regex patterns. Case
insensitive.

1. read_write - List of patterns that should be read/write remotely.
2. read_only - List of patterns that should be read only remotely.
3. local - List of patterns that should be read locally.

The logic for choosing the behavior is as follows:

1. Check if one of the patterns match the file path, do the corresponding action. There's no
specified order if two lists match the same path, we will use the first one (and we do not
guarantee what is first).

**Warning**: Specifying the same path in two lists is unsupported and can lead to undefined
behaviour.

2. Check our "special list" - we have an internal at compile time list
for different behavior based on patterns    to provide better UX.

3. If none of the above match, use the default behavior (mode).

## Example `fs` config

```json
{
  "feature": {
    "fs": {
      "mode": "write",
      "read_write": ".+\.json" ,
      "read_only": [ ".+\.yaml", ".+important-file\.txt" ],
      "local": [ ".+\.js", ".+\.mjs" ]
    }
  }
}
```
<!-- struct FsConfig::variant mode -->
## mode

File operations mode, defaults to read-only, see [`mode`](#mode).
<!-- struct FsConfig::variant read_write -->
## read_write

Specify file path patterns that if matched will be read and written to the remote.
<!-- struct FsConfig::variant read_only -->
## read_only

Specify file path patterns that if matched will be read from the remote.
if file matching the pattern is opened for writing or read/write it will be opened locally.
<!-- struct FsConfig::variant local -->
## local

Specify file path patterns that if matched will be opened locally.
<!-- impl FsConfig::fn is_active -->
Checks if fs operations are active
<!-- file src/fs/mode.rs -->
<!-- enum FsModeConfig -->
# mode

Configuration for enabling read-only and read-write file operations.

These options are overriden by user specified overrides and mirrord default overrides.

If you set LocalWithOverrides then some files can be read/write remotely based on our
default/user specified. Default option for general file configuration.

The accepted values are: `"local"`, `"localwithoverrides`, `"read"`, or `"write`.
<!-- enum FsModeConfig::variant Local -->
## local

mirrord won't do anything fs-related, all operations will be local.
<!-- enum FsModeConfig::variant LocalWithOverrides -->
## localwithoverrides

mirrord will run overrides on some file operations, but most will be local.
<!-- enum FsModeConfig::variant Read -->
## read

mirrord will read files from the remote, but won't write to them.
<!-- enum FsModeConfig::variant Write -->
## write

mirrord will read/write from the remote.
<!-- file src/fs.rs -->
<!-- use serde::Deserialize; -->
mirrord file operations support 2 modes of configuration:

1. [`FsUserConfig::Simple`]: controls only the option for enabling read-only, read-write,
or disable file operations;

2. [`FsUserConfig::Advanced`]: All of the above, plus allows setting up
[`mirrord_layer::file::filter::FileFilter`] to control which files should be opened
locally or remotely.
<!-- enum FsUserConfig -->
# fs

Changes file operations behavior based on user configuration.

See the file operations [reference](https://mirrord.dev/docs/reference/fileops/)
for more details, and [fs adnvaced](# fs advanced) for more information on how to fully setup
mirrord file operations.

## Minimal `fs` config

```json
{
  "feature": {
    "fs": true
  }
}
```

## Advanced `fs` config

```json
{
  "feature": {
    "fs": {
      "mode": "write",
      "read_write": ".+\.json" ,
      "read_only": [ ".+\.yaml", ".+important-file\.txt" ],
      "local": [ ".+\.js", ".+\.mjs" ]
    }
  }
}
```
<!-- file src/incoming/http_filter.rs -->
<!-- struct HttpHeaderFilterConfig -->
# http_header_filter

Filter configuration for the HTTP traffic stealer feature.

Allows the user to set a filter (regex) for the HTTP headers, so that the stealer traffic
feature only captures HTTP requests that match the specified filter, forwarding unmatched
requests to their original destinations.

Only does something when [`IncomingConfig`](super::IncomingConfig) is set as
[`IncomingMode::Steal`](super::IncomingMode::Steal), ignored otherwise.

## Types

```json
{
  "filter": null | String,
  "ports": Number | [Number],
}
```

## Sample

- `config.json`:

```json
{
  "filter": "host: api\..+",
  "ports": [80, 8080]
}
```
<!-- struct HttpHeaderFilterConfig::variant filter -->
### filter

Used to match against the requests captured by the mirrord-agent pod.

Supports regexes validated by the
[`fancy-regex`](https://docs.rs/fancy-regex/latest/fancy_regex/) crate.

#### Usage

The HTTP traffic feature converts the HTTP headers to `HeaderKey: HeaderValue`,
case-insensitive.
<!-- struct HttpHeaderFilterConfig::variant ports -->
### ports

Activate the HTTP traffic filter only for these ports.
<!-- file src/incoming.rs -->
<!-- enum IncomingFileConfig -->
# incoming

Controls the incoming TCP traffic feature.

See the incoming [reference](https://mirrord.dev/docs/reference/traffic/#incoming) for more
details.

Incoming traffic supports 2 modes of operation:

1. Mirror (**default**): Sniffs the TCP data from a port, and forwards a copy to the interested
listeners;

2. Steal: Captures the TCP data from a port, and forwards it (depending on how it's configured,
see [`IncomingMode::Steal`]);
<!-- struct IncomingAdvancedFileConfig::variant mode -->
Allows selecting between mirrorring or stealing traffic.

See [`IncomingMode`] for details.
<!-- struct IncomingAdvancedFileConfig::variant http_header_filter -->
Sets up the HTTP traffic filter (currently, only for [`IncomingMode::Steal`]).

See [`HttpHeaderFilterConfig`] for details.
<!-- struct IncomingAdvancedFileConfig::variant port_mapping -->
Mapping for local ports to remote ports.

This is useful when you want to mirror/steal a port to a different port on the remote
machine. For example, your local process listens on port 9333 and the container listens
on port 80. You'd use [[9333, 80]]
<!-- struct IncomingAdvancedFileConfig::variant ignore_localhost -->
Consider removing when adding https://github.com/metalbear-co/mirrord/issues/702
<!-- struct IncomingAdvancedFileConfig::variant ignore_ports -->
Ports to ignore when mirroring/stealing traffic. Useful if you want
specific ports to be used locally only.
<!-- struct IncomingConfig -->
# incoming

Sets up how mirrord handles incoming network packets.

## Minimal `incoming` config

```json
{
  "feature": {
    "network": {
      "incoming": "mirror",
      "outgoing": true
    }
  }
}
```

## Advanced `incoming` config

```json
{
  "feature": {
    "network": {
      "incoming": {
        "mode": "steal",
        "http_header_filter": {
          "filter": "host: api\..+",
          "ports": [80, 8080]
        }
      }
    }
  }
}
```
<!-- struct IncomingConfig::variant mode -->
## mode

See incoming [`mode`](#mode incoming) for more details.
<!-- struct IncomingConfig::variant http_header_filter -->
## http_header_filter

See [`http_header_filter`](#http_header_filter) for more details.
<!-- struct IncomingConfig::variant port_mapping -->
## port_mapping
<!-- struct IncomingConfig::variant ignore_localhost -->
## ignore_localhost
<!-- struct IncomingConfig::variant ignore_ports -->
## ignore_ports
<!-- enum IncomingMode -->
# mode incoming

Mode of operation for the incoming TCP traffic feature.

Can be set to either `"mirror"` (default) or `"steal"`.
<!-- enum IncomingMode::variant Mirror -->
## mirror

Sniffs on TCP port, and send a copy of the data to listeners.
<!-- enum IncomingMode::variant Steal -->
## steal

Stealer supports 2 modes of operation:

1. Port traffic stealing: Steals all TCP data from a port, which is selected whenever the
user listens in a TCP socket (enabling the feature is enough to make this work, no
additional configuration is needed);

2. HTTP traffic stealing: Steals only HTTP traffic, mirrord tries to detect if the incoming
data on a port is HTTP (in a best-effort kind of way, not guaranteed to be HTTP), and
steals the traffic on the port if it is HTTP;
<!-- file src/lib.rs -->
<!-- use std::path::Path; -->
To generate the `mirrord-schema.json` file see
[`tests::check_schema_file_exists_and_is_valid_or_create_it`].

Remember to re-generate the `mirrord-schema.json` if you make **ANY** changes to this lib,
including if you only made documentation changes.
<!-- struct LayerConfig -->
# Mirrord configuration

Mirrord allows for a high degree of customization when it comes to which features you want to
enable, and how they should function.

Mirrord features can be setup with the [`feature`](#feature) configuration, you'll also
need to set up a [`target`](#target) for mirrord to impersonate.

## Minimal `config.json`

Most of the configuration fields have a default value, so all you really need is to specify a
[`target`](###target) to impersonate. This will start mirrord with [`network`](##network) in
sniffer mode, with outgoing traffic enabled for both TCP and UDP, and [`fs`](##fs) set to
read-only file operations.

```json
{
  "target": "pod/bear-pod"
}
```

## Advanced `config.json`

Both [`fs`](#fs) and [`network`](#network) also support a simplified configuration, see their
respective documentations to learn more.

```json
{
  "accept_invalid_certificates": false,
  "skip_processes": "ide-debugger",
  "target": {
    "path": "pod/bear-pod",
    "namespace": "default",
  },
  "connect_tcp": null,
  "connect_agent_name": "mirrord-agent-still-alive",
  "connect_agent_port": "7777",
  "agent": {
    "log_level": "info",
    "namespace": "default",
    "image": "ghcr.io/metalbear-co/mirrord:latest",
    "image_pull_policy": "IfNotPresent",
    "image_pull_secrets": [ { "secret-key": "secret" } ],
    "ttl": 30,
    "ephemeral": false,
    "communication_timeout": 30,
    "startup_timeout": 360,
    "network_interface": "eth0",
    "pause": false,
    "flush_connections": true,
  },
  "feature": {
    "env": {
      "include": "DATABASE_USER;PUBLIC_ENV",
      "exclude": "DATABASE_PASSWORD;SECRET_ENV",
      "overrides": {
        "DATABASE_CONNECTION": "db://localhost:7777/my-db",
        "LOCAL_BEAR": "panda"
      }
    },
    "fs": {
      "mode": "write",
      "read_write": ".+\.json" ,
      "read_only": [ ".+\.yaml", ".+important-file\.txt" ],
      "local": [ ".+\.js", ".+\.mjs" ]
    },
    "network": {
      "incoming": {
        "mode": "steal",
        "http_header_filter": {
          "filter": "host: api\..+",
          "ports": [80, 8080]
        },
        "port_mapping": [{ 7777: 8888 }],
        "ignore_localhost": false,
        "ignore_ports": [9999, 10000]
      },
      "outgoing": {
        "tcp": true,
        "udp": true,
        "ignore_localhost": false,
        "unix_streams": "bear.+"
      },
      "dns": false
    },
    "capture_error_trace": false
  },
  "operator": true,
  "kubeconfig": "~/.kube/config",
  "sip_binaries": "bash",
}
```
<!-- struct LayerConfig::variant accept_invalid_certificates -->
## accept_invalid_certificates

Controls whether or not mirrord accepts invalid TLS certificates (e.g. self-signed
certificates).

Defaults to `false`.
<!-- struct LayerConfig::variant skip_processes -->
## skip_processes

Allows mirrord to skip unwanted processes.

Useful when process A spawns process B, and the user wants mirrord to operate only on
process B.

Accepts a single value, or multiple values separated by `;`.

```json
{
  "skip_processes": "bash;node"
}
```
<!-- struct LayerConfig::variant target -->
## target

Specifies the running pod to mirror, see [`TargetConfig`](#target) for more details.

The simplified configuration supports:

- `pod/{sample-pod}/[container]/{sample-container}`;
- `podname/{sample-pod}/[container]/{sample-container}`;
- `deployment/{sample-deployment}/[container]/{sample-container}`;

```json
{
  "target": "pod/bear-pod"
}
```
<!-- struct LayerConfig::variant connect_tcp -->
## connect_tcp

IP:PORT to connect to instead of using k8s api, for testing purposes.

```json
{
  "connect_tcp": "10.10.0.100:7777"
}
```
<!-- struct LayerConfig::variant connect_agent_name -->
## connect_agent_name

Agent name that already exists that we can connect to.

```json
{
  "connect_agent_name": "mirrord-agent-still-alive"
}
```
<!-- struct LayerConfig::variant connect_agent_port -->
## connect_agent_port

Agent listen port that already exists that we can connect to.

```json
{
  "connect_agent_port": "8888"
}
```
<!-- struct LayerConfig::variant agent -->
## agent

Agent configuration, see [`AgentConfig`](#agent) for more advanced usage.

```json
{
  "agent": {
    "log_level": "debug",
    "image": "custom-ghcr/images/mirrord:latest",
    "image_pull_policy": "Always",
    "ttl": 180,
  }
}
```
<!-- struct LayerConfig::variant feature -->
## feature

Controls mirrord features, see [`FeatureConfig`](#feature) to learn how to set up mirrord
to do exactly what you want, and the
[technical reference, Technical Reference](https://mirrord.dev/docs/reference/)
to learn more about mirrord features.

```json
{
  "feature": {
    "env": {
      "exclude": "DATABASE_PASSWORD;SECRET_ENV",
    },
    "fs": {
      "mode": "write",
      "read_only": [ ".+\.yaml", ".+important-file\.txt" ],
      "local": [ ".+\.js", ".+\.mjs" ]
    },
    "network": {
      "incoming": {
        "mode": "steal",
        "http_header_filter": {
          "filter": "host: api\..+",
        }
      },
      "outgoing": {
        "udp": false,
      }
    }
  }
}
```
<!-- struct LayerConfig::variant operator -->
## operator

Allow to lookup if operator is installed on cluster and use it

Defaults to `true`.
<!-- struct LayerConfig::variant kubeconfig -->
## kubeconfig

Path to a kubeconfig file, if not specified, will use `KUBECONFIG`, or `~/.kube/config`, or
the in-cluster config.

```json
{
  "kubeconfig": "~/bear/kube-config"
}
```
<!-- struct LayerConfig::variant sip_binaries -->
## sip_binaries

Binaries to patch (macOS SIP).

Use this when mirrord isn't loaded to protected binaries that weren't automatically
patched.

Runs `endswith` on the binary path (so `bash` would apply to any binary ending with `bash`
while `/usr/bin/bash` would apply only for that binary).

```json
{
  "sip_binaries": "bash;python"
}
```
<!-- file src/network.rs -->
<!-- struct NetworkConfig -->
# network

Controls mirrord network operations.

See the network traffic [reference](https://mirrord.dev/docs/reference/traffic/)
for more details.

## Minimal `network` config

```json
{
  "feature": {
    "network": {
      "incoming": "mirror",
      "outgoing": true
    }
  }
}
```

## Advanced `network` config

```json
{
  "feature": {
    "network": {
      "incoming": {
        "mode": "steal",
        "http_header_filter": {
          "filter": "host: api\..+",
          "ports": [80, 8080]
        },
        "port_mapping": [{ 7777: 8888 }],
        "ignore_localhost": false,
        "ignore_ports": [9999, 10000],
      },
      "outgoing": {
        "tcp": true,
        "udp": true,
        "ignore_localhost": false,
        "unix_streams": "bear.+"
      },
      "dns": false
    }
  }
}
```
<!-- struct NetworkConfig::variant incoming -->
## incoming

Handles incoming network traffic, see [`IncomingConfig`](#incoming) for more details.
<!-- struct NetworkConfig::variant outgoing -->
## outgoing

Tunnel outgoing network operations through mirrord, see [`OutgoingConfig`](#outgoing) for
more details.
<!-- struct NetworkConfig::variant dns -->
## dns

Resolve DNS via the remote pod.

Defaults to `true`.
<!-- file src/outgoing.rs -->
<!-- struct OutgoingConfig -->
# outgoing

Controls the outgoing TCP traffic feature.

See the outgoing [reference](https://mirrord.dev/docs/reference/traffic/#outgoing) for more
details.

## Minimal `outgoing` config

```json
{
  "feature": {
    "network": {
      "outgoing": true,
    }
  }
}
```

## Advanced `outgoing` config

```json
{
  "feature": {
    "network": {
      "outgoing": {
        "tcp": true,
        "udp": true,
        "ignore_localhost": false,
        "unix_streams": "bear.+"
      }
    }
  }
}
```
<!-- struct OutgoingConfig::variant tcp -->
## tcp

Defaults to `true`.
<!-- struct OutgoingConfig::variant udp -->
## udp

Defaults to `true`.
<!-- struct OutgoingConfig::variant ignore_localhost -->
## ignore_localhost

Defaults to `false`.
<!-- struct OutgoingConfig::variant unix_streams -->
## unix_streams

Connect to these unix streams remotely (and to all other paths locally).

You can either specify a single value or an array of values.
Each value is interpreted as a regular expression
([Supported Syntax](https://docs.rs/regex/1.7.1/regex/index.html#syntax)).

When your application connects to a unix socket, the target address will be converted to a
string (non-utf8 bytes are replaced by a placeholder character) and matched against the set
of regexes specified here. If there is a match, mirrord will connect your application with
the target unix socket address on the target pod. Otherwise, it will leave the connection
to happen locally on your machine.
<!-- file src/target.rs -->
<!-- enum TargetFileConfig -->
# target

Specifies the target and namespace to mirror, see [`path`](##path) for a list of accepted values
for the `target` option.

## Minimal `target` config

```json
{
  "target": "pod/bear-pod"
}
```

## Advanced `target` config

```json
{
  "target": {
    "path": {
      "pod": "bear-pod"
    },
    "namespace": "default"
  }
}
```

## path

Specifies the running pod (or deployment) to mirror.

Supports:
- `pod/{sample-pod}`;
- `podname/{sample-pod}`;
- `deployment/{sample-deployment}`;
- `container/{sample-container}`;
- `containername/{sample-container}`.

## namespace

The namespace of the remote pod.
<!-- struct TargetConfig::variant path -->
## path

Path of the target to impersonate, see [`path`](#path) for details.
<!-- struct TargetConfig::variant namespace -->
## namespace

Namespace where the target lives.

Defaults to `"default"`.
<!-- file src/util.rs -->
<!-- fn with_env_vars -->
Sets environment variables to the given value for the duration of the closure.
Restores the previous values when the closure completes or panics, before unwinding the
panic.
