import { utils } from "ethers";

export function parseTransactionData(
  eventFragment: string,
  abi: string[],
  data: string,
  topics?: string[]
): utils.Result | null {
  try {
    const iface = new utils.Interface(abi);
    const parseLog = iface.decodeEventLog(eventFragment, data, topics);
    return parseLog;
  } catch (err: any) {
    console.error(`Failed to parse transaction data: ${err.message}`);
    return null;
  }
}
