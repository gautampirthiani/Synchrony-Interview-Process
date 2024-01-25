import { MetadataBearer } from '@aws-sdk/types';
import { HttpResponse } from '@aws-amplify/core/internals/aws-client-utils';
import { RestApiError } from '../errors';
/**
 * Internal-only method to create a new RestApiError from a service error.
 *
 * @internal
 */
export declare const buildRestApiServiceError: (error: Error) => RestApiError;
export declare const parseRestApiServiceError: (response?: HttpResponse) => Promise<(RestApiError & MetadataBearer) | undefined>;
