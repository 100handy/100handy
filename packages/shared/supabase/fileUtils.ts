// Web stub - these functions are only used on mobile
// They should never be called on web, but we need the export to exist for bundling

export async function readFileAsBase64(_uri: string): Promise<string> {
  throw new Error('readFileAsBase64 is not supported on web');
}
