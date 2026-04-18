export interface GrepMatch { line: number; text: string }
export interface GrepResult { relativePath: string; project: string; matches: GrepMatch[] }
