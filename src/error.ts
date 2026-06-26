/**
 * Error thrown when a Star Comms API call fails.
 */
export class StarCommsError extends Error {
  constructor(
    /** HTTP status code from the shard (or 500 for client-side errors) */
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "StarCommsError";
  }
}
