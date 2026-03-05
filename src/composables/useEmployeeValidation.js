import * as yup from 'yup'

export const useEmployeeValidation = () => {
  const schema = yup.object({
    isCustomer: yup.boolean().nullable(),
    isSupplier: yup.boolean().nullable(),
    employeeCode: yup.string().required('Mã nhân viên trống'),
    employeeName: yup.string().required('Tên nhân viên trống'),
    contactTitle: yup.string().nullable(),
    unitID: yup.string().required('Đơn vị trống').notOneOf([''], 'Đơn vị trống'),
    dateOfBirth: yup.date().nullable(),
    gender: yup.boolean().default(true),
    cccdNumber: yup.string().nullable(),
    dateOfIssuance: yup.date().nullable(),
    issuingAuthority: yup.string().nullable(),
    groupEmployee: yup.string().nullable(),
    accountsReceivable: yup.string().nullable(),
    accountsPayable: yup.string().nullable(),
    salaryNegotiable: yup.number().nullable(),
    salaryCoefficient: yup.number().nullable(),
    salarySubjectInsuranceContributions: yup.number().nullable(),
    loaiHopDong: yup.number().nullable(),
    numberOfDependents: yup.number().nullable(),
    address: yup.string().nullable(),
    phoneNumber: yup.string().nullable(),
    landlinePhone: yup.string().nullable(),
    email: yup.string().nullable(),
    banks: yup
      .array()
      .of(
        yup.object({
          bankNumber: yup.string().nullable(),
          bankName: yup.string().nullable(),
          bankAddress: yup.string().nullable(),
          bankCity: yup.string().nullable(),
        }),
      )
      .nullable(),
  })

  const getEmployeeInitialValues = (type, newCode, employeeDetail) => {
    return {
      employeeCode: type === 'create' || type === 'double' ? newCode : employeeDetail?.employeeCode,
      isCustomer: false,
      isSupplier: false,
      gender: true,
      salaryNegotiable: 0,
      salaryCoefficient: 0.0,
      salarySubjectInsuranceContributions: 0,
      loaiHopDong: 0,
      numberOfDependents: 0,
      banks: [{ bankNumber: '', bankName: '', bankAddress: '', bankCity: '' }],
    }
  }

  return {
    schema,
    getEmployeeInitialValues,
  }
}
