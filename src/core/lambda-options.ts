import { awscdk } from 'projen';

/**
 * AWS Lambda defaults for construct libraries.
 *
 * The runtime is Node.js 24, the same major line as workflow Node `24.x`
 * and the Dev Container Node feature. These options apply only when projen
 * discovers a Lambda handler. A library without one is left unchanged.
 *
 * Returns a new object on each call so nested bundling options are not shared
 * across projects.
 *
 * @returns Common options for discovered Lambda functions.
 */
export const createSharedLambdaOptions = (): awscdk.LambdaFunctionCommonOptions => ({
  runtime: awscdk.LambdaRuntime.NODEJS_24_X,
  bundlingOptions: {
    // The Node.js 24 Lambda runtime includes AWS SDK for JavaScript v3.
    externals: ['@aws-sdk/*'],
    sourcemap: true,
  },
});
