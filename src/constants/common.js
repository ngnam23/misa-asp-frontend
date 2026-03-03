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
  { key: 'employeeCode', label: 'Mã nhân viên', width: 150, display: true },
  { key: 'employeeName', label: 'Tên nhân viên', width: 200, display: true },
  { key: 'taxCode', label: 'Mã số thuế', width: 140, display: true },
  { key: 'contactTitle', label: 'Chức danh', width: 180, display: true },
  { key: 'unitCode', label: 'Mã đơn vị', width: 150, display: true },
  { key: 'unitName', label: 'Tên đơn vị', width: 200, display: true },
  { key: 'bankNumber', label: 'Số tài khoản', width: 150, display: true },
  { key: 'bankName', label: 'Tên ngân hàng', width: 200, display: true },
  { key: 'isActive', label: 'Trạng thái', width: 120, display: true },
  { key: 'phoneNumber', label: 'Số điện thoại', width: 140, display: true },
  { key: 'gender', label: 'Giới tính', width: 100, display: true },
  {
    key: 'dateOfBirth',
    label: 'Ngày sinh',
    width: 140,
    align: 'center',
    type: 'date',
    display: true,
  },
  { key: 'passportNumber', label: 'Số hộ chiếu', width: 150, display: true },
  { key: 'cccdNumber', label: 'Số CCCD/ CMND', width: 160, display: true },
  {
    key: 'dateOfIssuance',
    label: 'Ngày cấp',
    width: 140,
    align: 'center',
    type: 'date',
    display: true,
  },
  { key: 'issuingAuthority', label: 'Nơi cấp', width: 220, display: true },
  { key: 'isCustomer', label: 'Là khách hàng', width: 120, align: 'center', display: true },
  { key: 'isSupplier', label: 'Là nhà cung cấp', width: 120, align: 'center', display: true },
  {
    key: 'createdDate',
    label: 'Ngày tạo',
    width: 140,
    align: 'center',
    type: 'date',
    display: true,
  },
  { key: 'createdBy', label: 'Người tạo', width: 160, display: true },
  {
    key: 'modifiedDate',
    label: 'Ngày sửa',
    width: 140,
    align: 'center',
    type: 'date',
    display: true,
  },
  { key: 'modifiedBy', label: 'Người sửa', width: 160, display: true },
]

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 bản ghi trên 1 trang' },
  { value: 20, label: '20 bản ghi trên 1 trang' },
  { value: 50, label: '50 bản ghi trên 1 trang' },
  { value: 100, label: '100 bản ghi trên 1 trang' },
]
