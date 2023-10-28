
export function parseRespBulkString<ReturnType>(
  string: string

): ReturnType {

  const result = <Record<string, string>> {};

  const lines = string.split('\r\n');

  for (let line of lines) {

    line = line.trim();

    if (!line || line.startsWith('#') || !line.includes(':')) {
      continue;
    }

    const [key, value] = line.split(':', 2);

    if (key && value !== undefined) {
      result[key] = value;
    }

  }

  return result as ReturnType;

}
