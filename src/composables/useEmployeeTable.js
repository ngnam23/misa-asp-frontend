import { listApi } from '@/constants/list-api'
import { debounce } from '@/utils/debounce'
import http from '@/utils/http'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useEmployeeTable = () => {
  const route = useRoute()
  const router = useRouter()

  const rows = ref([])
  const totalItems = ref(0)
  const page = ref(parseInt(route.query.page) || 1)
  const pageSize = ref(parseInt(route.query.pageSize) || 20)
  const keyword = ref(route.query.keyword || '')
  const contactTitle = ref(route.query.contactTitle || '')
  const isActive = ref(+route.query.isActive === 0 ? 0 : +route.query.isActive || -1)
  const gender = ref(+route.query.gender === 0 ? 0 : +route.query.gender || -1)
  const unitCode = ref(route.query.unitCode || '')

  const updateRouterQuery = () => {
    router.push({
      name: 'employee',
      query: {
        keyword: keyword.value,
        page: page.value,
        pageSize: pageSize.value,
        contactTitle: contactTitle.value,
        isActive: isActive.value,
        gender: gender.value,
        unitCode: unitCode.value,
      },
    })
  }

  const debounceGetData = debounce(() => {
    page.value = 1
    updateRouterQuery()
    getData()
  }, 800)

  const handleFilter = (filter) => {
    page.value = 1
    contactTitle.value = filter.contactTitle
    isActive.value = filter.isActive
    gender.value = filter.gender
    unitCode.value = filter.unitCode
  }

  const getData = async () => {
    try {
      const response = await http.get(listApi.Employees, {
        params: {
          pageSize: pageSize.value,
          page: page.value,
          keyword: keyword.value,
          contactTitle: contactTitle.value,
          isActive: +isActive.value === -1 ? null : Boolean(isActive.value),
          gender: +gender.value === -1 ? null : Boolean(gender.value),
          unitCode: unitCode.value === '' ? null : unitCode.value,
        },
      })
      if (response.success) {
        rows.value = response.data.data
        totalItems.value = response.data.meta.total
      }
    } catch (error) {
      console.error('Error fetching employee list:', error)
      rows.value = []
      totalItems.value = 0
    }
  }

  return {
    rows,
    totalItems,
    keyword,
    page,
    pageSize,
    contactTitle,
    isActive,
    gender,
    unitCode,
    getData,
    updateRouterQuery,
    debounceGetData,
    handleFilter,
  }
}
