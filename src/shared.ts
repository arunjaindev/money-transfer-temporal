// @@@SNIPSTART money-transfer-project-template-ts-constants
// Connection settings are read from the environment so nothing
// deployment-specific is hardcoded. Defaults target a local dev server.
export const address = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
export const namespace = process.env.TEMPORAL_NAMESPACE || 'default';
export const taskQueueName = process.env.TEMPORAL_TASK_QUEUE || 'money-transfer';
// @@@SNIPEND

// @@@SNIPSTART money-transfer-project-template-ts-shared

export type PaymentDetails = {
  amount: number;
  sourceAccount: string;
  targetAccount: string;
  referenceId: string;
};

// @@@SNIPEND
