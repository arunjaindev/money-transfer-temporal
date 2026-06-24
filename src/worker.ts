// @@@SNIPSTART money-transfer-project-template-ts-worker
import { Worker, Runtime, NativeConnection } from '@temporalio/worker';
import * as activities from './activities';
import { address, namespace, taskQueueName } from './shared';

// Address Prometheus scrapes the Worker's SDK metrics from.
// Override with PROMETHEUS_BIND_ADDRESS, e.g. '0.0.0.0:9464'.
const prometheusBindAddress = process.env.PROMETHEUS_BIND_ADDRESS || '0.0.0.0:9464';

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
  });

  // Start accepting tasks from the Task Queue.
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
