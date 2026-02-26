export const SIDEBAR_MENU = [
  {
    name: 'Tổng quan',
    icon: 'icon-dashboard',
  },
  {
    name: 'Tiền mặt',
    icon: 'icon-cash',
  },
  {
    name: 'Tiền gửi',
    icon: 'icon-bank',
  },
  {
    name: 'Mua hàng',
    icon: 'icon-pu',
  },
  {
    name: 'Bán hàng',
    icon: 'icon-sale',
  },
  {
    name: 'Quản lý hóa đơn',
    icon: 'icon-invoice',
  },
  {
    name: 'Kho',
    icon: 'icon-stock',
  },
  {
    name: 'Công cụ dụng cụ',
    icon: 'icon-tools',
  },
  {
    name: 'Tài sản cố định',
    icon: 'icon-fixed-assets',
  },
  {
    name: 'Tiền lương',
    icon: 'icon-salary',
  },
  {
    name: 'Thuế',
    icon: 'icon-tax',
  },
  {
    name: 'Giá thành',
    icon: 'icon-price',
  },
  {
    name: 'Tổng hợp',
    icon: 'icon-general',
  },
  {
    name: 'Báo cáo',
    icon: 'icon-report',
    isNoArrow: true,
  },
  {
    name: 'Kiểm soát rủi ro',
    icon: 'icon-compare',
    isNoArrow: true,
  },
  {
    name: 'Danh mục',
    icon: 'icon-menu',
  },
  {
    name: 'Số dư ban đầu',
    icon: 'icon-opening',
  },
]

export const EMPLOYEE_FIELDS = [
  { key: 'employeeCode', label: 'Mã nhân viên', width: 220 },
  { key: 'employeeName', label: 'Tên nhân viên', width: 250 },
  { key: 'taxCode', label: 'Mã số thuế', width: 150 },
  { key: 'contactTitle', label: 'Chức danh', width: 250 },
  { key: 'unitCode', label: 'Mã đơn vị', width: 220 },
  { key: 'unitName', label: 'Tên đơn vị', width: 220 },
  { key: 'bankNumber', label: 'Số tài khoản', width: 150 },
  { key: 'bankName', label: 'Tên ngân hàng', width: 280 },
  { key: 'isActive', label: 'Trạng thái', width: 180 },
  { key: 'phoneNumber', label: 'Số điện thoại', width: 150 },
  { key: 'gender', label: 'Giới tính', width: 100 },
  { key: 'dateOfBirth', label: 'Ngày sinh', width: 150, align: 'center', type: 'date' },
  { key: 'passportNumber', label: 'Số hộ chiếu', width: 200 },
  { key: 'cccdNumber', label: 'Số CCCD/ CMND', width: 200 },
  { key: 'dateOfIssuance', label: 'Ngày cấp', width: 200, align: 'center', type: 'date' },
  { key: 'issuingAuthority', label: 'Nơi cấp', width: 280 },
  { key: 'isCustomer', label: 'Là khách hàng', width: 120, align: 'center' },
  { key: 'isSupplier', label: 'Là nhà cung cấp', width: 120, align: 'center' },
  { key: 'createdDate', label: 'Ngày tạo', width: 180, align: 'center', type: 'date' },
  { key: 'createdBy', label: 'Người tạo', width: 180 },
  { key: 'modifiedDate', label: 'Ngày sửa', width: 180, align: 'center', type: 'date' },
  { key: 'modifiedBy', label: 'Người sửa', width: 180 },
]

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 bản ghi trên 1 trang' },
  { value: 20, label: '20 bản ghi trên 1 trang' },
  { value: 50, label: '50 bản ghi trên 1 trang' },
  { value: 100, label: '100 bản ghi trên 1 trang' },
]
