import { listApi } from '@/constants/list-api'
import http from '@/utils/http'
import { ref } from 'vue'

export const useEmployeeDialog = () => {
  const isOpenEmployeeDialog = ref(false)
  const employeeDetail = ref(null)
  const type = ref('create')
  const newCode = ref('')

  const getNewCode = async () => {
    try {
      const response = await http.get(listApi.NewCode)
      if (response.success) {
        return response.data
      }
    } catch {
      return ''
    }
  }

  const getEmployeeDetail = async (employeeID) => {
    try {
      const response = await http.get(`${listApi.Employees}/${employeeID}`)
      if (response.success) {
        employeeDetail.value = response.data
      }
    } catch {
      employeeDetail.value = null
    }
  }

  const handleOpenDialogCreate = async () => {
    newCode.value = await getNewCode()
    type.value = 'create'
    isOpenEmployeeDialog.value = true
  }

  const handleOpenDialogToUpdate = async (employeeID) => {
    await getEmployeeDetail(employeeID)
    type.value = 'update'
    isOpenEmployeeDialog.value = true
  }

  const handleOpenDialogToDouble = async (employeeID) => {
    await getEmployeeDetail(employeeID)
    newCode.value = await getNewCode()
    type.value = 'double'
    isOpenEmployeeDialog.value = true
  }

  const handleSaveAndAdd = async () => {
    newCode.value = await getNewCode()
    type.value = 'create'
  }

  return {
    isOpenEmployeeDialog,
    employeeDetail,
    type,
    newCode,
    handleOpenDialogCreate,
    handleOpenDialogToUpdate,
    handleOpenDialogToDouble,
    handleSaveAndAdd,
  }
}
