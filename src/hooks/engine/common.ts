export type OutputListener = (output: string) => void;

export interface ProcessResponse {
  success: boolean;
  message: string;
  process_id?: string;
}
