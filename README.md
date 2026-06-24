# Temporal Money Transfer example in TypeScript

This is the companion code for the tutorial [Run your first Temporal Application with TypeScript](https://learn.temporal.io/getting_started/typescript/first_program_in_typescript).

### Running this sample:

1. Make sure Temporal Server is running locally (see the [quick install guide](https://docs.temporal.io/server/quick-install/)).
1. `npm install` to install dependencies.
1. `npm run worker` to start the Worker.
1. In another shell, `npm run client` to run the Workflow Client.

The Workflow will return:

```bash
Started Workflow workflow-OyIhuWr6X4opgqtYnhxuX with RunID a85055c8-3fce-466e-b4f6-8f66c16614e6
Transfer complete (transaction IDs: w1328871163, d0590412617)
```

### Configuration

Connection and observability settings are read from environment variables, with
defaults that target a local dev server. See `.env.example` for the full list.

| Variable | Default | Description |
| --- | --- | --- |
| `TEMPORAL_ADDRESS` | `localhost:7233` | Temporal frontend gRPC address used by the Worker and Client. |
| `TEMPORAL_NAMESPACE` | `default` | Temporal namespace. |
| `TEMPORAL_TASK_QUEUE` | `money-transfer` | Task queue the Worker polls and the Client targets. |
| `PROMETHEUS_BIND_ADDRESS` | `0.0.0.0:9464` | Address where the Worker exposes Prometheus SDK metrics (`/metrics`). |

These are plain environment variables — set them in your shell or your deployment
(e.g. a Kubernetes Deployment), no `.env` loader is required.
