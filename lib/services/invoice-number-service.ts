import { InvoiceNumberConfig } from "@/types/invoice"

const STORAGE_KEY = "invoice_number_settings"

export class InvoiceNumberService {
  private static instance: InvoiceNumberService
  private config: InvoiceNumberConfig
  private lastNumber: number

  private constructor() {
    // Default configuration
    this.config = {
      format: "dd-mm-nn",
      prefix: "INV-",
      suffix: "",
      startNumber: 1,
      padding: 3,
      includeYear: true,
      includeMonth: true,
      separator: "-"
    }
    this.lastNumber = this.config.startNumber - 1
    this.loadSettings()
  }

  public static getInstance(): InvoiceNumberService {
    if (!InvoiceNumberService.instance) {
      InvoiceNumberService.instance = new InvoiceNumberService()
    }
    return InvoiceNumberService.instance
  }

  private loadSettings() {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY)
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        this.config = parsed
        this.lastNumber = parsed.startNumber - 1
      }
    } catch (error) {
      console.error("Failed to load invoice number settings:", error)
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config))
    } catch (error) {
      console.error("Failed to save invoice number settings:", error)
    }
  }

  public setConfig(config: InvoiceNumberConfig) {
    this.config = config
    this.lastNumber = config.startNumber - 1
    this.saveSettings()
  }

  public getConfig(): InvoiceNumberConfig {
    return { ...this.config }
  }

  public generateNextNumber(): string {
    this.lastNumber++
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const number = this.lastNumber.toString().padStart(this.config.padding, "0")

    let format = this.config.format
      .replace("dd", year)
      .replace("mm", month)
      .replace("nn", number)

    // Replace separator
    format = format.replace(/-/g, this.config.separator)

    return `${this.config.prefix}${format}${this.config.suffix}`
  }

  public getLastNumber(): number {
    return this.lastNumber
  }

  public resetCounter() {
    this.lastNumber = this.config.startNumber - 1
  }

  // Method to load settings from backend (to be implemented)
  public async loadSettingsFromBackend(): Promise<void> {
    try {
      // const response = await fetch('/api/settings/invoice-number')
      // const data = await response.json()
      // this.setConfig(data)
    } catch (error) {
      console.error("Failed to load settings from backend:", error)
    }
  }

  // Method to save settings to backend (to be implemented)
  public async saveSettingsToBackend(): Promise<void> {
    try {
      // await fetch('/api/settings/invoice-number', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(this.config),
      // })
    } catch (error) {
      console.error("Failed to save settings to backend:", error)
    }
  }
} 