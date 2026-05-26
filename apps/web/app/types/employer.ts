export interface EmployerMeResponse {
  id: string
  email: string
  role: string
  hasCompanyProfile: boolean
}

export interface EmployerBootstrapResponse extends EmployerMeResponse {
  message: string
}
