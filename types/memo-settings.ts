export interface MemoSettings {
  enabled: boolean;
  defaultText: string;
  placeholder: string;
  variables: string[];
}

export const defaultMemoSettings: MemoSettings = {
  enabled: false,
  defaultText: "",
  placeholder: "Additional notes...",
  variables: ["{companyName}", "{date}", "{invoiceNumber}"]
}; 