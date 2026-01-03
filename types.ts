
export enum LaserType {
  DIODE = 'Diode',
  CO2 = 'CO2',
  FIBER = 'Fiber',
}

export interface LaserConfig {
  type: LaserType;
  wattage: number;
  brand?: string;
  lensSize: number; // focal length in mm
}

export interface CloudConfig {
  googleSheetsApiKey: string;
  spreadsheetId: string;
  githubToken?: string;
  githubRepo?: string; // format: 'username/repo'
}

export interface MaterialItem {
  id: string;
  name: string;
  cost: number;
}

export interface JobSettings {
  material: string;
  thickness: number; // in mm
  operation: 'cut' | 'engrave';
  fileName?: string;
  filePreview?: string;
  materialItems: MaterialItem[];
  hourlyRate?: number;
}

export interface CalculationResult {
  power: number; // percentage
  speed: number; // mm/min
  passes: number;
  estimatedTime: string;
  notes: string;
  totalCost?: number;
  suggestedPrice?: number;
}

export interface Project extends JobSettings {
  id: string;
  date: string;
  laserConfig: LaserConfig;
  results: CalculationResult;
}
