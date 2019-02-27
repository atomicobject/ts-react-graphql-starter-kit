import * as DataLoader from "dataloader";
export async function uncachedLoad<K, V>(
  dataloader: DataLoader<K, V>,
  key: K
): Promise<V> {
  dataloader.clear(key);
  return dataloader.load(key);
}
