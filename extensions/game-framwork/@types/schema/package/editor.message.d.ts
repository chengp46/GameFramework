declare namespace Editor.Message {
  function broadcast(event: string, ...args: any[]): void;
  function addBroadcastListener(event: string, callback: (...args: any[]) => void): void;
  function removeBroadcastListener(event: string, callback: (...args: any[]) => void): void;
}
