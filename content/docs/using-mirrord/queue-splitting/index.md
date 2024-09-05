---
title: "Queue Splitting"
description: "Sharing queues by splitting messages between multiple clients and the cluster"
date: 2024-08-31T13:37:00+00:00
lastmod: 2024-08-31T13:37:00+00:00
draft: false
menu:
  docs:
    parent: "using-mirrord"
weight: 150
toc: true
tags: ["team", "enterprise"]
---

If your application consumes messages from a queue service, you should choose a configuration that matches your
intention:
1. Running your application with mirrord without any special configuration will result in your local application
   competing with the remote target (and potentially other mirrord runs by teammates) for queue messages.
2. Running your application with
   [`copy_target` + `scale_down`](https://mirrord.dev/docs/using-mirrord/copy-target/#replacing-a-whole-deployment-using-scale_down)
   will result in the deployed application not consuming any messages, and your local application being the
   exclusive consumer of queue messages.
3. **If you want to control which messages will be consumed by the deployed application, and which ones will reach your
   local application, set up queue splitting for the relevant target, and define a messages filter in the mirrord
   configuration. Messages that match the filter will reach your local application, and messages that do not, will
   reach either the deployed application, or another teammate's local application, if they match their filter.**

> **_NOTE:_** So far queue splitting is available for [Amazon SQS](https://aws.amazon.com/sqs/). Pretty soon we'll
> support Kafka as well.

## How It Works

### SQS Splitting

When a queue splitting session starts, the operator changes the target workload to consume messages from a
different, temporary queue created by the operator. The operator also creates a temporary queue that the local
application reads from.

So if we have a consumer app reading messages from a queue:

{{<figure src="before-splitting.svg" class="bg-white center" alt="A K8s application that consumes messages from a queue">}}

After a mirrord queue splitting session starts, the setup will change to this:

{{<figure src="1-user.svg" class="bg-white center" alt="A queue splitting session">}}

The operator will consume messages from the original queue, and try to match their attributes with filter defined by
the user in the mirrord configuration file. A message that matches the filter will be sent to the queue consumed by
the local application. Other messages will be sent to the queue consumed by the remote application.

And as soon as a second mirrord queue splitting session starts, the operator will create another temporary queue for
the new local app:

{{<figure src="2-users.svg" class="bg-white center" alt="2 queue splitting sessions">}}

The users' filters will be matched in the order of the start of their sessions. If filters defined by two users both
match a message, the message will go to whichever user started their session first.

After a mirrord session ends, the operator will delete the temporary queue it created for it. When all
sessions that split a certain queue end, the mirrord Operator will wait for the deployed application to consume the
remaining messages in its temporary queue, and then delete that temporary queue as well, and change the deployed
application to consume messages back from the original queue.

## Getting Started with Queue Splitting

### Enabling Queue Splitting in Your Cluster

In order to use the queue splitting feature, some extra values need be provided during the installation of the mirrord Operator.

First of all, the SQS splitting feature needs to be enabled:
- When installing with the [mirrord-operator Helm chart](https://github.com/metalbear-co/charts/tree/main/mirrord-operator)
  it is enabled by setting the
  [`operator.sqsSplitting`](https://github.com/metalbear-co/charts/blob/61fec57ca913068a11f3dc8579bdaa377cb028a1/mirrord-operator/values.yaml#L22)
  [value](https://helm.sh/docs/chart_template_guide/values_files/) to `true`.
- When installing via the `mirrord operator setup` command, set the `--sqs-splitting` flag.

When SQS splitting is enabled during installation, some additional resources are created, and the SQS component of
the mirrord Operator is started.

Additionally, the operator needs to be able to do some operations on SQS queues in your account.
For that, an IAM role with an appropriate policy has to be assigned to the operator's service account.
Please follow [AWS's documentation on how to do that](https://docs.aws.amazon.com/eks/latest/userguide/associate-service-account-role.html).

Some of the permissions are needed for your actual queues that you would like to split, and some permissions are
only needed for the temporary queues the mirrord Operator creates and later deletes. Here is an overview:

| SQS Permission     | needed for your queues | needed for temporary queues |
|:-------------------|:----------------------:|:---------------------------:|
| GetQueueUrl        |           ✓            |                             |
| ListQueueTags      |           ✓            |                             |
| ReceiveMessage     |           ✓            |                             |
| DeleteMessage      |           ✓            |                             |
| GetQueueAttributes |           ✓            |          ✓ (both!)          |
| CreateQueue        |                        |              ✓              |
| TagQueue           |                        |              ✓              |
| SendMessage        |                        |              ✓              |
| GetQueueAttributes |                        |              ✓              |
| DeleteQueue        |                        |              ✓              |


Here we provide a short explanation for each required permission.
* `sqs:GetQueueUrl`: the operator finds queue names to split in the provided source, and then it fetches the URL
  from SQS in order to make all other API calls.
* `sqs:GetQueueAttributes`: the operator gives all temporary queues the same attributes as their corresponding
  original queue, so it needs permission to get the original queue's attributes. It also reads the attributes of
  temporary queues it created, in order to check how many messages they have approximately.
* `sqs:ListQueueTags`: the operator queries your queue's tags, in order to give all temporary queues that are
  created for that queue the same tags.
* `sqs:ReceiveMessage`: the mirrord Operator will read messages from queues you want to split.
* `sqs:DeleteMessage`: after reading a message and forwarding it to a temporary queue, the operator deletes it.
* `sqs:CreateQueue`: the mirrord Operator will create temporary queues in your SQS account.
* `sqs:TagQueue`: all the queues mirrord creates will be tagged with all the tags of their respective original
  queues, plus any tags that are configured for them in the `MirrordWorkloadQueueRegistry` in which they are declared.
* `sqs:SendMessage`: mirrord will send the messages it reads from an original queue to the temporary queue of the
  client whose filter matches it, or to the temporary queue the deployed application reads from.
* `sqs:DeleteQueue`: when a user session is done, mirrord will delete the temporary queue it created for that
  session. After all sessions that split a certain queue end, also the temporary queue that is for the deployed
  application is deleted.


This is an example for a policy that gives the operator's roles the minimal permissions it needs to split a queue
called `ClientUploads`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "sqs:GetQueueUrl",
                "sqs:GetQueueAttributes",
                "sqs:ListQueueTags",
                "sqs:ReceiveMessage",
                "sqs:DeleteMessage"
            ],
            "Resource": [
                "arn:aws:sqs:eu-north-1:314159265359:ClientUploads"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "sqs:CreateQueue",
                "sqs:TagQueue",
                "sqs:SendMessage",
                "sqs:GetQueueAttributes",
                "sqs:DeleteQueue"
            ],
            "Resource": "arn:aws:sqs:eu-north-1:314159265359:mirrord-*"
        }
    ]
}
```
* The first statement gives the role the permissions it needs for your original queues.

  Instead of specifying the queues you would like to be able to split in the first statement, you could alternatively
  make that statement apply for all resources in the account, and limit the queues it applies to using conditions
  instead of resource names. For example, you could add a condition that makes the statement only apply to queues with
  the tag `splittable=true` or `env=dev` etc. and set those tags for all queues you would like to allow the operator
  to split.

* The second statement in the example gives the role the permissions it needs for the temporary queues. Since all the
  temporary queues created by mirrord are created with the name prefix `mirrord-`, that statement in the example is
  limited to resources with that prefix in their name.

  If you would like to limit the second statement with conditions instead of (only) with the resource name, you can
  [set a condition that requires a tag](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-abac-tagging-resource-control.html),
  and in the `MirrordWorkloadQueueRegistry` resource you can specify for each queue tags that mirrord will set for
  temporary queues that it creates for that original queue.

If the queue messages are encrypted, the operator's IAM role should also have the following permissions:
* `kms:Encrypt`
* `kms:Decrypt`
* `kms:GenerateDataKey`

The ARN of the IAM role has to be passed when installing the operator.
- When installing with Helm, the ARN is passed via the `sa.roleArn` value
- When installing via the `mirrord operator setup` command, use the `--aws-role-arn` flag.

### Permissions for Target Workloads

In order to be targeted with SQS queue splitting, a workload has to be able to read from queues that are created by
mirrord.

Any temporary queues created by mirrord are created with the same policy as the original queues they are splitting
(with the single change of the queue name in the policy), so if a queue has a policy that allows the target workload
to call `ReceiveMessage` on it, that is enough.

However, if the workload gets its access to the queue by an IAM policy (and not an SQS policy, see
[SQS docs](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-using-identity-based-policies.html#sqs-using-sqs-and-iam-policies))
that grants access to that specific queue by its exact name, you would have to add a policy that would allow that
workload to also read from new temporary queues created by mirrord on the run.

### Creating a Queue Registry

On operator installation, a new
[`CustomResources`](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) type was
created on your cluster: `MirrordWorkloadQueueRegistry`. Users with permissions to get CRDs, can verify its
existence with `kubectl get crd mirrordworkloadqueueregistries.queues.mirrord.metalbear.co`.
After an SQS-enabled operator is installed, and before you can start splitting queues, a resource of that type must
be created for the target you want to run against, in the target's namespace.

Below we have an example for such a resource, for a meme app that consumes messages from two queues:

```yaml
apiVersion: "queues.mirrord.metalbear.co/v1alpha"
kind: MirrordWorkloadQueueRegistry
metadata:
  name: meme-app-q-registry
spec:
  queues:
    meme-queue:
      queueType: SQS
      nameSource:
        envVar: INCOMING_MEME_QUEUE_NAME
      tags:
        tool: mirrord
    ad-queue:
      queueType: SQS
      nameSource:
        envVar: AD_QUEUE_NAME
      tags:
        tool: mirrord
  consumer:
    name: meme-app
    container: main
    workloadType: Deployment
```

* `spec.queues` holds queues that should be split when running mirrord with this target.
  It is a mapping from a queue ID to the details of the queue.
  * The queue ID is chosen by you, and will be used by every teammate who wishes to filter messages from this queue.
    You can choose any string for that, it does not have to be the same as the name of the queue. In the example
    above the first queue has the queue id `meme-queue`
    and the second one `ad-queue`.
  * `nameSource` tells mirrord where the app finds the name of this queue.
    * Currently `envVar` is the only supported
      source for the queue name, but in the future we will also support other sources, such as config maps. The value
      of `envVar` is the name of the environment variable the app reads the queue name from. It is crucial that both
      the local and the deployed app use the queue name they find in that environment variable. mirrord changes the
      value of that environment variable in order to make the application read from a temporary queue it creates.
  * `tags` is an optional field where you can specify queue tags that should be added to all temporary queues mirrord
    creates for splitting this queue.
* `spec.consumer` is the workload that consumes these queues. The queues specified above will be split whenever that
  workload is targeted.
  * `container` is optional, when set - this queue registry only applies to runs that target that container.

### Setting a Filter for a mirrord Run

Once everything else is set, you can start setting message filters in your mirrord configuration file.
Below is an example for what such a configuration might look like:
```json
{
    "operator": true,
    "target": "deployment/meme-app/main",
    "feature": {
        "split_queues": {
            "meme-queue": {
                "queue_type": "SQS",
                "message_filter": {
                    "author": "^me$",
                    "level": "^(beginner|intermediate)$"
                }
            }
        }
    }
}
```

* [`feature.split_queues`](/docs/reference/configuration/#feature-split_queues) is the configuration field you need
  to specify in order to filter queue messages. Directly under it, we have a mapping from a queue ID to a queue
  filter definition. This queue ID is the queue ID that was set in the
  [queue registry resource](#creating-a-queue-registry) of this target.
  * `message_filter` is a mapping from message attribute names to message attribute value regexes. Your local
    application will only see queue messages that have all the specified message attributes.

    In this case, the local
    application would only receive messages that have an attribute with the name "author" and the value "me", AND an
    attribute with the name "level" and one of the values "beginner" and "intermediate".

In the example above, a filter was only defined for one of the queues this target consumes. This is equivalent to
specifying a match-none filter for the second queue. Meaning our application will not see any messages in the
`ad-queue`.

Once all users stop filtering a queue (i.e. end their mirrord sessions), the temporary SQS queues that mirrord
created will be deleted.
