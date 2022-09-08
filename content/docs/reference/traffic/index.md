---
title: "Network Traffic"
description: "Reference to working with network traffic with mirrord"
date: 2022-08-08T08:48:45+00:00
lastmod: 2022-08-08T08:48:45+00:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 110
toc: true
---

## Incoming

mirrord allows users to debug incoming network traffic in the following ways -

#### mirroring

mirrord's default configuration is to duplicate traffic from the remote pod, i.e. run the local process in the context of cloud environment without
manipulating incoming traffic.

Let's look at a simple example of this in works, by creating a simple Kubernetes deployment and service -

1. `user-service`: stores registered users.

```bash
mehula@mehul-machine:~/mirrord$ minikube service list
|-------------|-------------------|--------------|---------------------------|
|  NAMESPACE  |       NAME        | TARGET PORT  |            URL            |
|-------------|-------------------|--------------|---------------------------|
| default     | kubernetes        | No node port |
| default     | user-service      |           80 | http://192.168.49.2:32000 |
| kube-system | kube-dns          | No node port |
|-------------|-------------------|--------------|---------------------------|

mehula@mehul-machine:~/mirrord-demo$ curl -X POST -H "Content-type: application/json" -d "{\"Name\" : \"Metal\", \"Last\" : \"Bear\"}" http://192.168.49.2:32000/user
{"Last":"Bear","Name":"Metal"}

mehula@mehul-machine:~/mirrord-demo$ curl http://192.168.49.2:31000/index.html
<html> <head>USERS</head><body><h1> MetalBear Users</h1><p>[{"Last":"Bear","Name":"Metal"}]</p></body></html>
```

Now to mirror traffic from remote services to our local development environment we will run the services locally with mirrord,

```bash
mehula@mehul-machine:~/mirrord$ kubectl get pods
NAME                                        READY   STATUS    RESTARTS      AGE
metalbear-bff-deployment-597cb4f957-485t5   1/1     Running   1 (15h ago)   16h
metalbear-deployment-85c754c75f-6k7mg       1/1     Running   1 (15h ago)   16h
```

Let's see what happens when we send traffic to the remote pod through our service

##### Window 1

```bash
mehula@mehul-machine:~/mirrord-demo$ ../mirrord/target/debug/mirrord exec -c --pod-name metalbear-deployment-85c754c75f-6k7mg python3 user-service/service.py 
 * Serving Flask app 'service' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on all addresses (0.0.0.0)
   WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://127.0.0.1:33695
 * Running on http://172.16.0.4:33695 (Press CTRL+C to quit)
 127.0.0.1 - - [08/Sep/2022 15:34:34] "GET /users HTTP/1.1" 200 - // <- Received mirrored traffic from the remote pod
```

##### Window 2

```bash
mehula@mehul-machine:~/mirrord-demo$ curl http://192.168.49.2:32000/users
[{"Last":"Bear","Name":"Metal"}]
```

#### stealing

mirrord can steal network traffic, i.e. intercept it and send it to the local process. This means that the local process's state is directly interacting
with the incoming network traffic without affecting the remote process.

Let's run `user-service` with mirrord and `--tcp-steal` on -

##### Window 1

```bash
mehula@mehul-machine:~/mirrord-demo$ ../mirrord/target/debug/mirrord exec -c --tcp-steal --pod-name metalbear-deployment-85c754c75f-6k7mg python3 user-service/service.py 
 * Serving Flask app 'service' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on all addresses (0.0.0.0)
   WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://127.0.0.1:35215
 * Running on http://172.16.0.4:35215 (Press CTRL+C to quit) 
 127.0.0.1 - - [08/Sep/2022 15:48:40] "GET /users HTTP/1.1" 200 -
 127.0.0.1 - - [08/Sep/2022 15:50:40] "POST /user HTTP/1.1" 200 -
 127.0.0.1 - - [08/Sep/2022 15:50:55] "GET /users HTTP/1.1" 200 -
 127.0.0.1 - - [08/Sep/2022 16:57:51] "POST /user HTTP/1.1" 200 -
 127.0.0.1 - - [08/Sep/2022 16:57:54] "GET /users HTTP/1.1" 200 -
 ^Cmehula@mehul-machine:~/mirrord-demo$ 
```

##### Window 2

```bash
// Before running mirrord with `--tcp-steal`
mehula@mehul-machine:~/mirrord-demo$ curl http://192.168.49.2:32000/users
[{"Last":"Bear","Name":"Metal"}]

// After running with mirrord and `--tcp-steal` - remote process witched context with local process
mehula@mehul-machine:~/mirrord-demo$ curl http://192.168.49.2:32000/users
[]
mehula@mehul-machine:~/mirrord-demo$ curl -X POST -H "Content-type: application/json" -d "{\"Name\" : \"Mehul\", \"Last\" : \"Arora\"}" http://192.168.49.2:32000/user
{"Last":"Arora","Name":"Mehul"}
mehula@mehul-machine:~/mirrord-demo$ curl http://192.168.49.2:32000/users
[{"Last":"Arora","Name":"Mehul"}]
mehula@mehul-machine:~/mirrord-demo$ curl -X POST -H "Content-type: application/json" -d "{\"Name\" : \"Alex\", \"Last\" : \"C\"}" http://192.168.49.2:32000/user
{"Last":"C","Name":"Alex"}
mehula@mehul-machine:~/mirrord-demo$ curl http://192.168.49.2:32000/users
[{"Last":"Arora","Name":"Mehul"},{"Last":"C","Name":"Alex"}]

// After sending SIGINT to the local process - remote switched back to its original context
mehula@mehul-machine:~/mirrord-demo$ curl http://192.168.49.2:32000/users
[{"Last":"Bear","Name":"Metal"}]
```

## Outgoing

mirrord provides access to outgoing traffic, i.e. local network requests will be redirected to the remote.

Let's see if we can get the user list from the remote by sending a `GET` request to port 80 in the context of remote -

```bash
mehula@mehul-machine:~/mirrord-demo$ ../mirrord/target/debug/mirrord exec -c -o --pod-name metalbear-deployment-85c754c75f-6k7mg curl localhost:80/users
[{"Last":"Bear","Name":"Metal"}]
```

## DNS Resolution
