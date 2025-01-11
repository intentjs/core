export class DownloadFromRegistry {
  async handle(registryUrl: string): Promise<any> {
    const response = await fetch(registryUrl);
    const data = await response.json();
    return data;
  }
}
