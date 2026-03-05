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

  const listGroupEmployees = ref([])
  const listAccountsPayables = ref([])
  const listAccountsReceivables = ref([])

  const getMasterData = async () => {
    try {
      const response = await http.get(listApi.MasterData)
      if (response.success) {
        listGroupEmployees.value = response.data.groupEmployees
        listAccountsPayables.value = response.data.accountsPayables
        listAccountsReceivables.value = response.data.accountsReceivables
      }
    } catch (error) {
      console.error('Error fetching master data:', error)
    }
  }

  return {
    isOpenEmployeeDialog,
    employeeDetail,
    type,
    newCode,
    listGroupEmployees,
    listAccountsPayables,
    listAccountsReceivables,
    handleOpenDialogCreate,
    handleOpenDialogToUpdate,
    handleOpenDialogToDouble,
    handleSaveAndAdd,
    getMasterData,
  }
}
