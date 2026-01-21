
export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
  fileName: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  TRANSCRIBING = 'TRANSCRIBING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
