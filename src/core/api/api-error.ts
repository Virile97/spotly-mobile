export interface ApiFieldIssue {
  path: (string | number)[]
  message: string
}

export class ApiError extends Error {
  status: number
  code?: string
  issues?: ApiFieldIssue[]

  constructor(message: string, status: number, code?: string, issues?: ApiFieldIssue[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.issues = issues
  }
}
