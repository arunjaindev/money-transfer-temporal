// @@@SNIPSTART money-transfer-project-template-ts-worker
import { Worker, Runtime, NativeConnection } from '@temporalio/worker';
import type { Duration } from '@temporalio/common';
import * as activities from './activities';
import { address, namespace, taskQueueName } from './shared';

// Address Prometheus scrapes the Worker's SDK metrics from.
// Override with PROMETHEUS_BIND_ADDRESS, e.g. '0.0.0.0:9464'.
const prometheusBindAddress = process.env.PROMETHEUS_BIND_ADDRESS || '0.0.0.0:9464';

// On SIGTERM (e.g. a KEDA/Kubernetes scale-down), drain in-flight tasks for
// this long before forcefully shutting down. Keep it below the pod's
// terminationGracePeriodSeconds (GracePeriod) so the drain completes in time.
const shutdownGraceTime = (process.env.SHUTDOWN_GRACE_TIME || '25s') as Duration;

async function run() {
  // Install the Core runtime once per process and expose SDK metrics
  // over a Prometheus scrape endpoint. This must run before Worker.create().
  Runtime.install({
    telemetryOptions: {
      metrics: {
        prometheus: { bindAddress: prometheusBindAddress },
      },
    },
  });
  console.log(`Worker SDK metrics exposed at http://${prometheusBindAddress}/metrics`);

  // Connect to the Temporal server at the configured address.
  const connection = await NativeConnection.connect({ address });

  // Register Workflows and Activities with the Worker and connect to
  // the Temporal server.
  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve('./workflows'),
    activities,
    namespace,
    taskQueue: taskQueueName,
    shutdownGraceTime,
  });

  // Start accepting tasks from the Task Queue. The Worker installs handlers for
  // SIGINT/SIGTERM by default and shuts down gracefully when one is received.
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
