export interface EnumerateData<T = string> {
  id: T;
  description: string;
  value?: number;
  stringValue?: string;
  show?: boolean;
}
