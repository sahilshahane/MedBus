type StatusKind = 'error' | 'loading' | 'success' | 'info'

interface Status {
  type: StatusKind
  enabled?: boolean
  message?: string
  title?: string
}

type OperationType = 'signin' | 'signup'

export type { Status, OperationType, StatusKind }
