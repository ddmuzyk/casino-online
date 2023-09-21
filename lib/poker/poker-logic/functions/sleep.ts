export function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function sleep(ms: number) {
  await timeout(ms);
}