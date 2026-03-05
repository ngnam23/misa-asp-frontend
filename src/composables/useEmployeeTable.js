import { listApi } from '@/constants/list-api'
import { debounce } from '@/utils/debounce'
import http from '@/utils/http'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { EMPLOYEE_FIELDS } from '@/constants/common'
import { formatDateDDMMYYYY } from '@/utils/formatter'

const fields = ref(JSON.parse(localStorage.getItem('employeeFields')) || [...EMPLOYEE_FIELDS])

/**
 * Cập nhật danh sách các cột hiển thị và lưu vào localStorage
 * @param {Array} newFields - Danh sách các trường thông tin mới
 */
const updateFields = (newFields) => {
  fields.value = [...newFields]
  localStorage.setItem('employeeFields', JSON.stringify(fields.value))
}

/**
 * Composable quản lý logic cho bảng nhân viên (phân trang, tìm kiếm, lọc, export)
 * @returns {Object} Các state và phương thức xử lý bảng nhân viên
 */
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

  /**
   * Cập nhật các tham số trên URL dựa trên trạng thái hiện tại
   */
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

  /**
   * Hàm debounce gọi API lấy dữ liệu để tránh gọi liên tục khi người dùng gõ tìm kiếm
   */
  const debounceGetData = debounce(() => {
    page.value = 1
    updateRouterQuery()
    getData()
  }, 800)

  /**
   * Xử lý khi có thay đổi bộ lọc từ giao diện
   * @param {Object} filter - Đối tượng chứa các giá trị lọc mới
   */
  const handleFilter = (filter) => {
    page.value = 1
    contactTitle.value = filter.contactTitle
    isActive.value = filter.isActive
    gender.value = filter.gender
    unitCode.value = filter.unitCode
  }

  /**
   * Gọi API lấy danh sách nhân viên từ server
   */
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

  /**
   * Xử lý xuất danh sách nhân viên ra file Excel
   */
  const handleExport = async () => {
    const response = await http.get(listApi.Employees, {
      params: {
        pageSize: totalItems.value,
        page: 1,
        keyword: keyword.value,
        contactTitle: contactTitle.value,
        isActive: +isActive.value === -1 ? null : Boolean(isActive.value),
        gender: +gender.value === -1 ? null : Boolean(gender.value),
        unitCode: unitCode.value === '' ? null : unitCode.value,
      },
    })
    if (response.success) {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Danh sách nhân viên')
      worksheet.columns = fields.value
        .filter((field) => field.display)
        .map((field) => ({
          header: field.label,
          key: field.key,
          width: Math.round(field.width / 10),
        }))

      response.data.data.forEach((employee) => {
        worksheet.addRow({
          ...employee,
          gender: employee.gender ? 'Nam' : 'Nữ',
          isCustomer: employee.isCustomer ? 'Có' : 'Không',
          isSupplier: employee.isSupplier ? 'Có' : 'Không',
          isActive: employee.isActive ? 'Hoạt động' : 'Ngừng hoạt động',
          dateOfBirth: employee.dateOfBirth ? formatDateDDMMYYYY(employee.dateOfBirth) : '',
          createdDate: employee.createdDate ? formatDateDDMMYYYY(employee.createdDate) : '',
          modifiedDate: employee.modifiedDate ? formatDateDDMMYYYY(employee.modifiedDate) : '',
          dateOfIssuance: employee.dateOfIssuance
            ? formatDateDDMMYYYY(employee.dateOfIssuance)
            : '',
        })
      })
      worksheet.eachRow((row) => {
        row.height = 22 // default height
      })
      const headerRow = worksheet.getRow(1)
      headerRow.height = 26
      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { bold: true }
        cell.alignment = { vertical: 'middle', horizontal: 'left' }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEFEFEF' },
        }
      })
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }
        })
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      })
      saveAs(blob, `DanhSachNhanVien_${new Date().getTime()}.xlsx`)
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
    fields,
    getData,
    updateRouterQuery,
    debounceGetData,
    handleFilter,
    handleExport,
    updateFields,
  }
}
