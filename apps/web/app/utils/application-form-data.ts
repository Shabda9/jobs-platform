import type { ApplicationFormSchema } from '~/schemas/application-form.schema'

function appendOptionalField(
  formData: FormData,
  key: string,
  value: string | undefined
): void {
  const trimmed = value?.trim()
  if (trimmed) {
    formData.append(key, trimmed)
  }
}

/** Builds multipart/form-data for POST /jobs/:id/applications */
export function buildApplicationFormData(
  data: ApplicationFormSchema
): FormData {
  const formData = new FormData()

  formData.append('fullName', data.fullName.trim())
  formData.append('email', data.email.trim())
  appendOptionalField(formData, 'phone', data.phone)
  appendOptionalField(formData, 'coverMessage', data.coverMessage)
  appendOptionalField(formData, 'availability', data.availability)
  appendOptionalField(formData, 'workRights', data.workRights)
  appendOptionalField(formData, 'experienceSummary', data.experienceSummary)
  appendOptionalField(formData, 'licenceOrCertificate', data.licenceOrCertificate)
  formData.append('resume', data.resume, data.resume.name)

  return formData
}
