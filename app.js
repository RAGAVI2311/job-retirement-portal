// ==========================================================================
// Employee Retirement Portal & Jobify UI - Core Application Logic
// Traceable to SRS FR-1 through FR-10 and UI Specifications
// ==========================================================================

const APP_STATE = {
  currentMode: 'retirement', // 'retirement' or 'jobify'
  currentRole: 'administrator', // employee, reporting_officer, hr_officer, nodal_officer, accounts_officer, competent_authority, pensioner, administrator, auditor
  currentUser: {
    id: 'EMP-ADM-001',
    name: 'Gausul Haque',
    title: 'System Administrator',
    department: 'Administration',
    email: 'admin@jobify-retirement.gov',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
  },
  filters: {
    search: '',
    location: '',
    sortBy: 'recently',
    salaryMin: 50,
    salaryMax: 120,
    jobTypes: ['Full-Time'],
    locations: [],
    experience: [],
    retirementScheme: 'all',
    retirementStatus: 'all'
  },
  bookmarks: new Set([2, 4, 5, 6]), // Pre-bookmarked IDs matching screenshot
  selectedAppId: null,
  selectedJobId: null
};

// ==========================================================================
// SEED DATA: SRS User Classes & Roles (Section 2.2)
// ==========================================================================
const ROLES = {
  employee: {
    id: 'EMP-1042',
    name: 'Robert Chen',
    title: 'Sr. Staff Engineer',
    roleLabel: 'Employee (Applicant)',
    department: 'Information Technology',
    email: 'robert.chen@org.gov',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
  },
  reporting_officer: {
    id: 'OFF-2019',
    name: 'Marcus Vance',
    title: 'Director of Engineering',
    roleLabel: 'Reporting Officer / HOD',
    department: 'Information Technology',
    email: 'marcus.vance@org.gov',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'
  },
  hr_officer: {
    id: 'HR-3044',
    name: 'Sarah Jenkins',
    title: 'Lead HR Scrutiny Officer',
    roleLabel: 'HR Officer',
    department: 'Human Resources',
    email: 'sarah.jenkins@org.gov',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80'
  },
  nodal_officer: {
    id: 'NOD-4081',
    name: 'David Ross',
    title: 'Central Nodal Officer',
    roleLabel: 'Department Nodal Officer',
    department: 'Assets & Quarters',
    email: 'david.ross@org.gov',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80'
  },
  accounts_officer: {
    id: 'ACC-5102',
    name: 'Elena Rostova',
    title: 'Chief Accounts Officer',
    roleLabel: 'Accounts / Finance Officer',
    department: 'Finance & Pension Accounts',
    email: 'elena.rostova@org.gov',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80'
  },
  competent_authority: {
    id: 'DIR-6001',
    name: 'Dr. William Sterling',
    title: 'Executive Director & Sanctioning Head',
    roleLabel: 'Competent Authority',
    department: 'Executive Board',
    email: 'william.sterling@org.gov',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80'
  },
  pensioner: {
    id: 'PEN-8012',
    name: 'Arthur Pendelton',
    title: 'Former Chief Architect (Retd.)',
    roleLabel: 'Pensioner',
    department: 'Civil Engineering',
    email: 'arthur.pendelton@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80'
  },
  administrator: {
    id: 'EMP-ADM-001',
    name: 'Gausul Haque',
    title: 'System Administrator',
    roleLabel: 'System Administrator',
    department: 'Administration',
    email: 'admin@jobify-retirement.gov',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
  },
  auditor: {
    id: 'AUD-9005',
    name: 'Patricia Hayes',
    title: 'Senior Audit Inspector',
    roleLabel: 'Auditor (Read-Only)',
    department: 'Internal Audit & Vigilance',
    email: 'patricia.hayes@audit.gov',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80'
  }
};

// ==========================================================================
// SEED DATA: Retirement Applications (Full 8-Stage Lifecycle & Return Path)
// ==========================================================================
let APPLICATIONS = [
  {
    id: 'RET-2026-0842',
    employeeId: 'EMP-1042',
    employeeName: 'Robert Chen',
    designation: 'Sr. Staff Engineer',
    department: 'Information Technology',
    dob: '1966-12-15',
    joiningDate: '1994-06-01',
    superannuationDate: '2026-12-31',
    retirementType: 'Superannuation',
    intendedDate: '2026-12-31',
    status: 'HR Scrutiny',
    currentStageIndex: 2, // 0: Apply, 1: Reporting, 2: HR Scrutiny, 3: No-Dues, 4: Accounts, 5: Final Sanction, 6: Sanction Order, 7: Pensioner
    basicPay: 9400,
    daPercent: 42,
    qualifyingServiceYears: 32,
    leaveBalanceDays: 280,
    monthlyPensionEstimate: 6674,
    gratuityEstimate: 232000,
    leaveEncashmentEstimate: 125000,
    commutationPercentage: 40,
    daysElapsed: 8,
    slaDays: 15,
    vigilanceStatus: 'CLEAR',
    vigilanceNotes: 'No pending departmental or vigilance inquiries.',
    documents: [
      { name: 'National ID Proof (Passport/Aadhaar)', status: 'Verified', size: '2.4 MB' },
      { name: 'Bank Passbook & Cancelled Cheque', status: 'Verified', size: '1.8 MB' },
      { name: 'Nomination Form (Family Pension)', status: 'Pending Review', size: '3.1 MB' },
      { name: 'Service Book Extract', status: 'Verified', size: '4.5 MB' },
      { name: 'Recent Passport Photograph', status: 'Verified', size: '1.2 MB' }
    ],
    noDues: {
      assets: { status: 'CLEARED', amount: 0, officer: 'David Ross' },
      library: { status: 'CLEARED', amount: 0, officer: 'K. Sharma' },
      it: { status: 'CLEARED', amount: 0, officer: 'D. Miller' },
      loans: { status: 'CLEARED', amount: 0, officer: 'A. Gupta' },
      quarters: { status: 'CLEARED', amount: 0, officer: 'M. Jenkins' }
    },
    remarksHistory: [
      { author: 'Robert Chen (Employee)', role: 'Employee', date: '2026-11-10', text: 'Application submitted along with verified bank and nominee certificates.' },
      { author: 'Marcus Vance (HOD)', role: 'Reporting Officer', date: '2026-11-12', text: 'Service particulars and handover checklist verified. Recommended for superannuation.' }
    ]
  },
  {
    id: 'RET-2026-0791',
    employeeId: 'EMP-1108',
    employeeName: 'Eleanor Bennett',
    designation: 'Principal Architect',
    department: 'Civil Engineering',
    dob: '1968-04-10',
    joiningDate: '1998-08-15',
    superannuationDate: '2028-04-30',
    retirementType: 'Voluntary (VRS)',
    intendedDate: '2026-12-15',
    status: 'No-Dues Clearance',
    currentStageIndex: 3,
    basicPay: 8900,
    daPercent: 42,
    qualifyingServiceYears: 28,
    leaveBalanceDays: 240,
    monthlyPensionEstimate: 6319,
    gratuityEstimate: 201000,
    leaveEncashmentEstimate: 101000,
    commutationPercentage: 30,
    daysElapsed: 12,
    slaDays: 15,
    vigilanceStatus: 'CLEAR',
    vigilanceNotes: 'Vigilance clearance issued on 2026-10-25.',
    documents: [
      { name: 'National ID Proof', status: 'Verified', size: '2.1 MB' },
      { name: 'Bank Passbook', status: 'Verified', size: '1.9 MB' },
      { name: 'VRS Justification Notice', status: 'Verified', size: '1.5 MB' },
      { name: 'Service Book Extract', status: 'Verified', size: '4.2 MB' }
    ],
    noDues: {
      assets: { status: 'CLEARED', amount: 0, officer: 'David Ross' },
      library: { status: 'DUES_PENDING', amount: 150, officer: 'K. Sharma', notes: '2 missing engineering journals.' },
      it: { status: 'CLEARED', amount: 0, officer: 'D. Miller' },
      loans: { status: 'DUES_PENDING', amount: 1200, officer: 'A. Gupta', notes: 'Outstanding computer advance recovery.' },
      quarters: { status: 'CLEARED', amount: 0, officer: 'M. Jenkins' }
    },
    remarksHistory: [
      { author: 'Marcus Vance', role: 'Reporting Officer', date: '2026-10-30', text: '28 years of qualifying service verified. Eligible for voluntary retirement under Rule 48.' },
      { author: 'Sarah Jenkins', role: 'HR Officer', date: '2026-11-04', text: 'HR verification completed. Disciplinary records clear. Forwarded for parallel No-Dues clearance.' }
    ]
  },
  {
    id: 'RET-2026-0715',
    employeeId: 'EMP-1249',
    employeeName: 'Franklin Wright',
    designation: 'Chief Financial Analyst',
    department: 'Finance & Accounts',
    dob: '1966-11-28',
    joiningDate: '1992-02-01',
    superannuationDate: '2026-11-30',
    retirementType: 'Superannuation',
    intendedDate: '2026-11-30',
    status: 'Accounts Approval',
    currentStageIndex: 4,
    basicPay: 10500,
    daPercent: 42,
    qualifyingServiceYears: 34,
    leaveBalanceDays: 300,
    monthlyPensionEstimate: 7455,
    gratuityEstimate: 250000,
    leaveEncashmentEstimate: 149000,
    commutationPercentage: 40,
    daysElapsed: 14,
    slaDays: 15,
    vigilanceStatus: 'CLEAR',
    vigilanceNotes: 'Clearance verified.',
    documents: [
      { name: 'ID Proof', status: 'Verified', size: '2.5 MB' },
      { name: 'Bank Details', status: 'Verified', size: '1.7 MB' },
      { name: 'No-Dues Certificate', status: 'Verified', size: '2.0 MB' }
    ],
    noDues: {
      assets: { status: 'CLEARED', amount: 0, officer: 'David Ross' },
      library: { status: 'CLEARED', amount: 0, officer: 'K. Sharma' },
      it: { status: 'CLEARED', amount: 0, officer: 'D. Miller' },
      loans: { status: 'CLEARED', amount: 0, officer: 'A. Gupta' },
      quarters: { status: 'CLEARED', amount: 0, officer: 'M. Jenkins' }
    },
    remarksHistory: [
      { author: 'Sarah Jenkins', role: 'HR Officer', date: '2026-11-01', text: 'All five departmental clearances verified without outstanding dues.' },
      { author: 'Elena Rostova', role: 'Accounts Officer', date: '2026-11-15', text: 'Calculation verified: Basic Pension $7,455, Gratuity capped at $250,000 statutory limit.' }
    ]
  },
  {
    id: 'RET-2026-0680',
    employeeId: 'EMP-1390',
    employeeName: 'Margaret Cho',
    designation: 'Senior Registrar',
    department: 'General Administration',
    dob: '1967-01-20',
    joiningDate: '1995-10-10',
    superannuationDate: '2027-01-31',
    retirementType: 'Premature',
    intendedDate: '2026-12-01',
    status: 'Final Sanction',
    currentStageIndex: 5,
    basicPay: 8200,
    daPercent: 42,
    qualifyingServiceYears: 31,
    leaveBalanceDays: 210,
    monthlyPensionEstimate: 5822,
    gratuityEstimate: 195000,
    leaveEncashmentEstimate: 81000,
    commutationPercentage: 35,
    daysElapsed: 6,
    slaDays: 15,
    vigilanceStatus: 'CLEAR',
    vigilanceNotes: 'Clear.',
    documents: [
      { name: 'Medical Board Certificate', status: 'Verified', size: '3.6 MB' },
      { name: 'All Clearance Slips', status: 'Verified', size: '2.2 MB' }
    ],
    noDues: {
      assets: { status: 'CLEARED', amount: 0, officer: 'David Ross' },
      library: { status: 'CLEARED', amount: 0, officer: 'K. Sharma' },
      it: { status: 'CLEARED', amount: 0, officer: 'D. Miller' },
      loans: { status: 'CLEARED', amount: 0, officer: 'A. Gupta' },
      quarters: { status: 'CLEARED', amount: 0, officer: 'M. Jenkins' }
    },
    remarksHistory: [
      { author: 'Elena Rostova', role: 'Accounts Officer', date: '2026-11-14', text: 'Benefits audited and certified. Forwarded to Competent Authority for formal sanction.' }
    ]
  },
  {
    id: 'RET-2026-0520',
    employeeId: 'EMP-1002',
    employeeName: 'Arthur Pendelton',
    designation: 'Chief Architect (Retd.)',
    department: 'Civil Engineering',
    dob: '1966-03-12',
    joiningDate: '1989-04-01',
    superannuationDate: '2026-03-31',
    retirementType: 'Superannuation',
    intendedDate: '2026-03-31',
    status: 'Sanctioned & Closed',
    currentStageIndex: 7, // Converted to pensioner
    basicPay: 11200,
    daPercent: 42,
    qualifyingServiceYears: 37,
    leaveBalanceDays: 300,
    monthlyPensionEstimate: 7952,
    gratuityEstimate: 250000,
    leaveEncashmentEstimate: 159000,
    commutationPercentage: 40,
    daysElapsed: 0,
    slaDays: 15,
    vigilanceStatus: 'CLEAR',
    vigilanceNotes: 'Fully cleared and retired.',
    sanctionOrderNo: 'SANCTION/2026/PENS/0491',
    pensionDisbursementAccount: 'State Apex Bank - AC# 40991823901',
    lifeCertificateSubmittedDate: '2026-10-18',
    documents: [
      { name: 'Official Sanction Order (e-Signed)', status: 'Issued', size: '1.2 MB' },
      { name: 'Digital Life Certificate 2026', status: 'Verified', size: '890 KB' }
    ],
    noDues: {
      assets: { status: 'CLEARED', amount: 0, officer: 'David Ross' },
      library: { status: 'CLEARED', amount: 0, officer: 'K. Sharma' },
      it: { status: 'CLEARED', amount: 0, officer: 'D. Miller' },
      loans: { status: 'CLEARED', amount: 0, officer: 'A. Gupta' },
      quarters: { status: 'CLEARED', amount: 0, officer: 'M. Jenkins' }
    },
    remarksHistory: [
      { author: 'Dr. William Sterling', role: 'Competent Authority', date: '2026-03-25', text: 'Retirement sanction granted with full admissible pensionary benefits. Digital seal affixed.' }
    ]
  },
  {
    id: 'RET-2026-0912',
    employeeId: 'EMP-1402',
    employeeName: 'Grace Hopper',
    designation: 'Lead Systems Analyst',
    department: 'Information Technology',
    dob: '1967-02-15',
    joiningDate: '1997-03-01',
    superannuationDate: '2027-02-28',
    retirementType: 'Superannuation',
    intendedDate: '2027-02-28',
    status: 'Returned with Remarks',
    currentStageIndex: 1,
    basicPay: 8600,
    daPercent: 42,
    qualifyingServiceYears: 29,
    leaveBalanceDays: 195,
    monthlyPensionEstimate: 6106,
    gratuityEstimate: 191000,
    leaveEncashmentEstimate: 80000,
    commutationPercentage: 40,
    daysElapsed: 3,
    slaDays: 15,
    vigilanceStatus: 'CLEAR',
    vigilanceNotes: 'Clear.',
    documents: [
      { name: 'Bank Passbook & Cancelled Cheque', status: 'Returned for Resubmission', size: '1.1 MB' }
    ],
    noDues: {
      assets: { status: 'AWAITING', amount: 0, officer: 'Pending' },
      library: { status: 'AWAITING', amount: 0, officer: 'Pending' },
      it: { status: 'AWAITING', amount: 0, officer: 'Pending' },
      loans: { status: 'AWAITING', amount: 0, officer: 'Pending' },
      quarters: { status: 'AWAITING', amount: 0, officer: 'Pending' }
    },
    remarksHistory: [
      { author: 'Sarah Jenkins', role: 'HR Officer', date: '2026-11-16', text: 'Returned: Bank passbook photocopy is blurred; account number and IFSC are not legible. Please upload a clear scanned copy.' }
    ]
  }
];

// ==========================================================================
// SEED DATA: Exact UI Jobs Matching Screenshot (Jobify Reference Mode)
// ==========================================================================
const JOBS = [
  {
    id: 1,
    title: 'Sr. Product Designer',
    company: 'Google',
    applicants: 12,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$102k/m',
    salaryVal: 102,
    posted: 'Posted 12 days ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '🔴',
    logoColor: '#ea4335'
  },
  {
    id: 2,
    title: 'Interaction Designer',
    company: 'Apple',
    applicants: 26,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$100k/m',
    salaryVal: 100,
    posted: 'Posted 8 days ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '🍎',
    logoColor: '#000000'
  },
  {
    id: 3,
    title: 'Design System Manager',
    company: 'Spotify',
    applicants: 56,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$232k/m',
    salaryVal: 232,
    posted: 'Posted 07 days ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '🟢',
    logoColor: '#1db954'
  },
  {
    id: 4,
    title: 'Product Designer',
    company: 'Reddit',
    applicants: 134,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$132k/m',
    salaryVal: 132,
    posted: 'Posted 12 days ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '🤖',
    logoColor: '#ff4500'
  },
  {
    id: 5,
    title: 'UI/UX Designer',
    company: 'Discord',
    applicants: 14,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$90k/m',
    salaryVal: 90,
    posted: 'Posted 10 days ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '👾',
    logoColor: '#5865f2'
  },
  {
    id: 6,
    title: 'UX Writter',
    company: 'Pinterest',
    applicants: 81,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$110k/m',
    salaryVal: 110,
    posted: 'Posted 2 days ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '📌',
    logoColor: '#e60023'
  },
  {
    id: 7,
    title: 'UX Resercher',
    company: 'Facebook',
    applicants: 42,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$125k/m',
    salaryVal: 125,
    posted: 'Posted 5 days ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '👤',
    logoColor: '#1877f2'
  },
  {
    id: 8,
    title: 'Growth Product Lead',
    company: 'Figma',
    applicants: 67,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$140k/m',
    salaryVal: 140,
    posted: 'Posted 9 days ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '🎨',
    logoColor: '#f24e1e'
  },
  {
    id: 9,
    title: 'Sr. Product Analyst',
    company: 'LinkedIn',
    applicants: 93,
    tags: ['Full-Time', 'Remote', 'Expert'],
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    salary: '$115k/m',
    salaryVal: 115,
    posted: 'Posted 1 day ago',
    type: 'Full-Time',
    location: 'Remote',
    experience: 'Expert',
    logo: '💼',
    logoColor: '#0077b5'
  }
];

// ==========================================================================
// SEED DATA: Immutable Audit Logs (FR-10.6)
// ==========================================================================
let AUDIT_LOGS = [
  { timestamp: '2026-11-20 16:45:10', user: 'Elena Rostova (Accounts)', role: 'Accounts Officer', action: 'APPROVE_BENEFITS', recordId: 'RET-2026-0715', details: 'Benefits calculated: Monthly Pension $7,455, Gratuity $250,000.', ip: '10.14.22.81' },
  { timestamp: '2026-11-20 15:30:22', user: 'David Ross (Nodal)', role: 'Department Nodal', action: 'RECORD_DUES', recordId: 'RET-2026-0791', details: 'Library dues recorded: $150 for 2 missing technical volumes.', ip: '10.14.22.45' },
  { timestamp: '2026-11-20 14:12:05', user: 'Sarah Jenkins (HR)', role: 'HR Officer', action: 'RETURN_APPLICATION', recordId: 'RET-2026-0912', details: 'Returned to employee: blurred bank passbook document requires resubmission.', ip: '10.14.19.12' },
  { timestamp: '2026-11-20 11:20:18', user: 'Robert Chen (Employee)', role: 'Employee', action: 'SUBMIT_APPLICATION', recordId: 'RET-2026-0842', details: 'Superannuation application submitted with nominee and bank details.', ip: '10.14.88.92' },
  { timestamp: '2026-11-19 17:05:40', user: 'Dr. William Sterling', role: 'Competent Authority', action: 'SANCTION_ORDER_ISSUED', recordId: 'RET-2026-0520', details: 'Formal sanction order issued with digital signature stamp and QR validation.', ip: '10.14.10.01' },
  { timestamp: '2026-11-19 09:15:00', user: 'System (Automated)', role: 'Scheduler', action: 'HR_RETIREMENT_ALERT', recordId: 'SYSTEM', details: 'Generated 6-month retirement forecast for 24 eligible employees.', ip: '127.0.0.1' }
];

// ==========================================================================
// 8-STAGE WORKFLOW DEFINITION (Section 7.1 diagram)
// ==========================================================================
const WORKFLOW_STAGES = [
  'Employee applies',
  'Reporting officer',
  'HR scrutiny',
  'No-dues clearance',
  'Accounts approval',
  'Final sanction',
  'Sanction order',
  'Pensioner account'
];

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderApp();
});

function initEventListeners() {
  // Mode toggles
  document.getElementById('btnModeRetirement').addEventListener('click', () => switchMode('retirement'));
  document.getElementById('btnModeJobify').addEventListener('click', () => switchMode('jobify'));

  // User Profile Role Switcher
  const userProfileBadge = document.getElementById('userProfileBadge');
  const roleDropdownMenu = document.getElementById('roleDropdownMenu');

  userProfileBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    roleDropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    roleDropdownMenu.classList.remove('show');
  });

  document.querySelectorAll('.role-option').forEach(el => {
    el.addEventListener('click', () => {
      const selectedRoleKey = el.dataset.role;
      switchRole(selectedRoleKey);
    });
  });

  // Search input listeners
  const searchInput = document.getElementById('mainSearchInput');
  const locationInput = document.getElementById('locationSearchInput');
  const btnSearch = document.getElementById('btnMainSearch');

  btnSearch.addEventListener('click', () => {
    APP_STATE.filters.search = searchInput.value.trim();
    APP_STATE.filters.location = locationInput.value.trim();
    renderCards();
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      APP_STATE.filters.search = searchInput.value.trim();
      renderCards();
    }
  });

  locationInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      APP_STATE.filters.location = locationInput.value.trim();
      renderCards();
    }
  });

  // Reset filter button
  document.getElementById('btnResetFilters').addEventListener('click', resetFilters);

  // Range Slider listener
  const rangeSlider = document.getElementById('salaryRangeSlider');
  rangeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    APP_STATE.filters.salaryMax = val;
    document.getElementById('sliderMaxLabel').textContent = `$${val}k/m`;
    renderCards();
  });

  // Sort dropdown
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', (e) => {
    APP_STATE.filters.sortBy = e.target.value;
    renderCards();
  });

  // Nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const action = link.dataset.action;
      handleNavAction(action);
    });
  });
}

// ==========================================================================
// RENDER CORE
// ==========================================================================
function renderApp() {
  updateHeaderProfile();
  updateHeroText();
  updateSidebarFilters();
  renderCards();
}

function switchMode(mode) {
  APP_STATE.currentMode = mode;
  document.getElementById('btnModeRetirement').classList.toggle('active', mode === 'retirement');
  document.getElementById('btnModeJobify').classList.toggle('active', mode === 'jobify');
  
  const browserUrl = document.getElementById('browserUrlText');
  if (mode === 'retirement') {
    browserUrl.textContent = 'www.retirement-portal.gov/pension-lifecycle';
    showToast('Switched to Employee Retirement Portal (SRS System)', 'info');
  } else {
    browserUrl.textContent = 'www.jobify-findjobs.com';
    showToast('Switched to Jobify UI (Reference Design Mode)', 'info');
  }

  renderApp();
}

function switchRole(roleKey) {
  if (!ROLES[roleKey]) return;
  APP_STATE.currentRole = roleKey;
  APP_STATE.currentUser = ROLES[roleKey];
  
  document.querySelectorAll('.role-option').forEach(el => {
    el.classList.toggle('active', el.dataset.role === roleKey);
  });

  updateHeaderProfile();
  showToast(`Switched active role to: ${ROLES[roleKey].roleLabel}`, 'success');
  addAuditLog(`Switched active user session to ${ROLES[roleKey].name} (${ROLES[roleKey].roleLabel})`, 'USER_ROLE_SWITCH');
  renderCards();
}

function updateHeaderProfile() {
  const user = APP_STATE.currentUser;
  document.getElementById('headerUserName').textContent = user.name;
  document.getElementById('headerUserRole').textContent = user.roleLabel || user.title;
  document.getElementById('headerUserAvatar').src = user.avatar;
}

function updateHeroText() {
  const isRetirement = APP_STATE.currentMode === 'retirement';
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const searchInput = document.getElementById('mainSearchInput');
  const locationInput = document.getElementById('locationSearchInput');
  const resultsCount = document.getElementById('resultsCountNumber');
  const resultsLabel = document.getElementById('resultsLabelText');

  if (isRetirement) {
    heroTitle.textContent = 'Employee Retirement & Pension Portal';
    heroSubtitle.textContent = 'Manage superannuation, approvals, multi-departmental no-dues clearance, and statutory pension benefits.';
    searchInput.placeholder = 'Search Employee Name, ID, or Designation...';
    locationInput.placeholder = 'Search Department or Office...';
    resultsLabel.textContent = 'active retirement applications';
  } else {
    heroTitle.textContent = 'Find your Dream job here!';
    heroSubtitle.textContent = 'Explore our newest job opportunities to discover and apply for the top positions available today!';
    searchInput.placeholder = 'Search Job tittle or Company here';
    locationInput.placeholder = 'Search Country or City here';
    resultsLabel.textContent = 'available jobs';
  }
}

function updateSidebarFilters() {
  const isRetirement = APP_STATE.currentMode === 'retirement';
  const sidebarTitle = document.getElementById('sidebarTitle');
  const filterGroup2Title = document.getElementById('filterGroup2Title');
  const filterGroup3Title = document.getElementById('filterGroup3Title');
  const filterGroup4Title = document.getElementById('filterGroup4Title');
  const filterGroup5Title = document.getElementById('filterGroup5Title');

  if (isRetirement) {
    sidebarTitle.textContent = 'Retirement Filters';
    filterGroup2Title.textContent = 'Pension Range';
    filterGroup3Title.textContent = 'Retirement Scheme';
    filterGroup4Title.textContent = 'Department';
    filterGroup5Title.textContent = 'Service Tenure';
    
    document.getElementById('jobTypeLabel1').textContent = 'Superannuation';
    document.getElementById('jobTypeLabel2').textContent = 'Voluntary (VRS)';
    document.getElementById('jobTypeLabel3').textContent = 'Premature';
    document.getElementById('jobTypeLabel4').textContent = 'Medical Ground';
    document.getElementById('jobTypeLabel5').textContent = 'Compulsory';

    document.getElementById('locationLabel1').textContent = 'IT & Systems';
    document.getElementById('locationLabel2').textContent = 'Civil Engineering';
    document.getElementById('locationLabel3').textContent = 'Finance & Accounts';

    document.getElementById('expLabel1').textContent = '10 - 20 Years';
    document.getElementById('expLabel2').textContent = '20 - 30 Years';
    document.getElementById('expLabel3').textContent = '30+ Years';
    document.getElementById('expLabel4').textContent = 'Sanctioned';
  } else {
    sidebarTitle.textContent = 'Filter';
    filterGroup2Title.textContent = 'Salary Range';
    filterGroup3Title.textContent = 'Job Type';
    filterGroup4Title.textContent = 'Work Location';
    filterGroup5Title.textContent = 'Experience Level';

    document.getElementById('jobTypeLabel1').textContent = 'Full-Time';
    document.getElementById('jobTypeLabel2').textContent = 'Part-Time';
    document.getElementById('jobTypeLabel3').textContent = 'Contractual';
    document.getElementById('jobTypeLabel4').textContent = 'Freelance';
    document.getElementById('jobTypeLabel5').textContent = 'Internship';

    document.getElementById('locationLabel1').textContent = 'On-Site';
    document.getElementById('locationLabel2').textContent = 'Remote';
    document.getElementById('locationLabel3').textContent = 'Hybrid';

    document.getElementById('expLabel1').textContent = 'Fresher';
    document.getElementById('expLabel2').textContent = 'Beginner';
    document.getElementById('expLabel3').textContent = 'Intermediate';
    document.getElementById('expLabel4').textContent = 'Expert';
  }
}

// ==========================================================================
// RENDER CARDS (Grid of Retirement Applications OR Jobify Jobs)
// ==========================================================================
function renderCards() {
  const container = document.getElementById('cardsGrid');
  container.innerHTML = '';

  const isRetirement = APP_STATE.currentMode === 'retirement';
  const searchTerm = APP_STATE.filters.search.toLowerCase();
  const locationTerm = APP_STATE.filters.location.toLowerCase();

  if (isRetirement) {
    let filtered = APPLICATIONS.filter(app => {
      const matchSearch = app.employeeName.toLowerCase().includes(searchTerm) ||
                          app.id.toLowerCase().includes(searchTerm) ||
                          app.designation.toLowerCase().includes(searchTerm);
      const matchDept = !locationTerm || app.department.toLowerCase().includes(locationTerm);
      return matchSearch && matchDept;
    });

    document.getElementById('resultsCountNumber').textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 48px; text-align: center; background: white; border-radius: 12px; border: 1px dashed #cbd5e1;">
          <h3 style="color: #64748b; font-size: 18px; margin-bottom: 8px;">No retirement applications match your search criteria.</h3>
          <p style="color: #94a3b8; font-size: 14px;">Try clearing filters or click "Reset" in the sidebar.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(app => {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.onclick = () => openRetirementDetailModal(app.id);

      // Status pill color
      let statusColorClass = 'tag-blue';
      if (app.status.includes('Sanctioned')) statusColorClass = 'tag-green';
      else if (app.status.includes('Returned')) statusColorClass = 'tag-rose';
      else if (app.status.includes('No-Dues')) statusColorClass = 'tag-amber';
      else if (app.status.includes('Accounts')) statusColorClass = 'tag-purple';

      card.innerHTML = `
        <div class="card-top">
          <div class="org-info">
            <div class="org-logo" style="background: #ecfdf5; color: #059669; font-weight: 800; font-size: 15px;">
              ${app.id.slice(-4)}
            </div>
            <div class="card-title-group">
              <h3>${app.employeeName}</h3>
              <div class="card-subtitle">${app.designation} • ${app.department}</div>
            </div>
          </div>
          <button class="bookmark-btn active" title="Application ID" onclick="event.stopPropagation();">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
          </button>
        </div>

        <div class="tags-row">
          <span class="tag-pill ${statusColorClass}">Stage: ${app.status}</span>
          <span class="tag-pill tag-purple">${app.retirementType}</span>
          <span class="tag-pill tag-amber">${app.qualifyingServiceYears} Yrs Service</span>
        </div>

        <div class="card-description">
          Intended Date: <strong>${app.intendedDate}</strong> | Superannuation: ${app.superannuationDate}
          <br>
          Vigilance: <span style="color: ${app.vigilanceStatus === 'CLEAR' ? '#166534' : '#b91c1c'}; font-weight: 600;">${app.vigilanceStatus}</span> • SLA: ${app.daysElapsed}/${app.slaDays} days elapsed
        </div>

        <div class="card-bottom">
          <div class="salary-figure">
            $${app.monthlyPensionEstimate.toLocaleString()}<span>/m pension</span>
          </div>
          <div class="time-elapsed">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M12 6v6l4 2" stroke-width="2"/></svg>
            ${app.daysElapsed} days in progress
          </div>
        </div>
      `;
      container.appendChild(card);
    });

  } else {
    // Jobify Mode (Exact replica matching the screenshot)
    let filtered = JOBS.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(searchTerm) ||
                          job.company.toLowerCase().includes(searchTerm);
      const matchLocation = !locationTerm || job.location.toLowerCase().includes(locationTerm);
      const matchSalary = job.salaryVal >= APP_STATE.filters.salaryMin && job.salaryVal <= APP_STATE.filters.salaryMax;
      return matchSearch && matchLocation && matchSalary;
    });

    document.getElementById('resultsCountNumber').textContent = '1,382';

    filtered.forEach(job => {
      const isBookmarked = APP_STATE.bookmarks.has(job.id);
      const card = document.createElement('div');
      card.className = 'job-card';
      card.onclick = () => openJobDetailModal(job.id);

      card.innerHTML = `
        <div class="card-top">
          <div class="org-info">
            <div class="org-logo">
              ${job.logo}
            </div>
            <div class="card-title-group">
              <h3>${job.title}</h3>
              <div class="card-subtitle">${job.company} • ${job.applicants} Applicants</div>
            </div>
          </div>
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="event.stopPropagation(); toggleBookmark(${job.id});">
            ${isBookmarked ? 
              `<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>` : 
              `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>`
            }
          </button>
        </div>

        <div class="tags-row">
          <span class="tag-pill tag-blue">${job.tags[0]}</span>
          <span class="tag-pill tag-purple">${job.tags[1]}</span>
          <span class="tag-pill tag-amber">${job.tags[2]}</span>
        </div>

        <div class="card-description">
          ${job.description}
        </div>

        <div class="card-bottom">
          <div class="salary-figure">
            ${job.salary}
          </div>
          <div class="time-elapsed">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M12 6v6l4 2" stroke-width="2"/></svg>
            ${job.posted}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

function toggleBookmark(jobId) {
  if (APP_STATE.bookmarks.has(jobId)) {
    APP_STATE.bookmarks.delete(jobId);
    showToast('Removed from saved bookmarks', 'info');
  } else {
    APP_STATE.bookmarks.add(jobId);
    showToast('Saved to bookmarks!', 'success');
  }
  renderCards();
}

function resetFilters() {
  APP_STATE.filters = {
    search: '',
    location: '',
    sortBy: 'recently',
    salaryMin: 50,
    salaryMax: 120,
    jobTypes: ['Full-Time'],
    locations: [],
    experience: [],
    retirementScheme: 'all',
    retirementStatus: 'all'
  };

  document.getElementById('mainSearchInput').value = '';
  document.getElementById('locationSearchInput').value = '';
  document.getElementById('salaryRangeSlider').value = 120;
  document.getElementById('sliderMaxLabel').textContent = '$120k/m';
  
  showToast('Filters reset to default', 'info');
  renderCards();
}

// ==========================================================================
// RETIREMENT APPLICATION DETAIL & WORKFLOW MODAL
// ==========================================================================
function openRetirementDetailModal(appId) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;
  APP_STATE.selectedAppId = appId;

  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  // Render 8-stage progress tracker matching diagram in Section 7.1
  let workflowHtml = '<div class="workflow-pipeline">';
  WORKFLOW_STAGES.forEach((stageName, idx) => {
    let stateClass = '';
    let icon = idx + 1;
    if (idx < app.currentStageIndex) {
      stateClass = 'completed';
      icon = '✓';
    } else if (idx === app.currentStageIndex) {
      stateClass = 'active';
      if (app.status.includes('Returned')) {
        stateClass = 'returned';
        icon = '↺';
      }
    }

    workflowHtml += `
      <div class="wf-step ${stateClass}">
        <div class="wf-circle">${icon}</div>
        <div class="wf-label">${stageName}</div>
      </div>
    `;

    if (idx < WORKFLOW_STAGES.length - 1) {
      const connClass = idx < app.currentStageIndex ? 'completed' : '';
      workflowHtml += `<div class="wf-connector ${connClass}"></div>`;
    }
  });
  workflowHtml += '</div>';

  // Render remarks history
  let remarksHtml = '';
  app.remarksHistory.forEach(rem => {
    remarksHtml += `
      <div style="background: #f8fafc; border-left: 3px solid #059669; padding: 10px 14px; margin-bottom: 8px; border-radius: 4px; font-size: 13px;">
        <div style="font-weight: 700; color: #334155;">${rem.author} <span style="font-weight: 400; color: #94a3b8;">(${rem.role}) • ${rem.date}</span></div>
        <div style="color: #475569; margin-top: 3px;">${rem.text}</div>
      </div>
    `;
  });

  // Action buttons based on Role
  let actionButtonsHtml = '';
  const role = APP_STATE.currentRole;

  if (role === 'reporting_officer' && app.currentStageIndex === 1) {
    actionButtonsHtml = `
      <button class="btn-danger" onclick="returnApplicationModal('${app.id}')">Return with Remarks</button>
      <button class="btn-primary" onclick="advanceWorkflow('${app.id}', 2, 'HR Scrutiny')">Recommend to HR Scrutiny ✓</button>
    `;
  } else if (role === 'hr_officer' && app.currentStageIndex === 2) {
    actionButtonsHtml = `
      <button class="btn-danger" onclick="returnApplicationModal('${app.id}')">Return for Correction</button>
      <button class="btn-primary" onclick="advanceWorkflow('${app.id}', 3, 'No-Dues Clearance')">Forward for No-Dues Clearance ✓</button>
    `;
  } else if (role === 'nodal_officer' && app.currentStageIndex === 3) {
    actionButtonsHtml = `
      <button class="btn-secondary" onclick="openNoDuesModal('${app.id}')">Open No-Dues Matrix 🏛️</button>
      <button class="btn-primary" onclick="advanceWorkflow('${app.id}', 4, 'Accounts Approval')">Verify All No-Dues & Forward ✓</button>
    `;
  } else if (role === 'accounts_officer' && app.currentStageIndex === 4) {
    actionButtonsHtml = `
      <button class="btn-secondary" onclick="openBenefitCalcModal('${app.id}')">Review Benefit Calculations 🧮</button>
      <button class="btn-primary" onclick="advanceWorkflow('${app.id}', 5, 'Final Sanction')">Approve Benefits & Forward to Sanction ✓</button>
    `;
  } else if (role === 'competent_authority' && app.currentStageIndex === 5) {
    actionButtonsHtml = `
      <button class="btn-danger" onclick="returnApplicationModal('${app.id}')">Return to Accounts</button>
      <button class="btn-primary" onclick="generateSanctionOrderModal('${app.id}')">Affix Digital Seal & Issue Sanction Order ✍️</button>
    `;
  } else if (app.currentStageIndex >= 6) {
    actionButtonsHtml = `
      <button class="btn-primary" onclick="viewSanctionOrderModal('${app.id}')">View Official Sanction Order 📄</button>
    `;
  } else if (role === 'administrator') {
    actionButtonsHtml = `
      <span style="font-size: 12px; color: #64748b; margin-right: auto;">Admin Override Mode</span>
      <button class="btn-danger" onclick="returnApplicationModal('${app.id}')">Return Step ↺</button>
      <button class="btn-secondary" onclick="openNoDuesModal('${app.id}')">No-Dues</button>
      <button class="btn-secondary" onclick="openBenefitCalcModal('${app.id}')">Benefits</button>
      <button class="btn-primary" onclick="forceAdvanceWorkflow('${app.id}')">Next Stage ➔</button>
    `;
  } else if (role === 'employee' && app.employeeId === APP_STATE.currentUser.id && app.currentStageIndex < 5) {
    actionButtonsHtml = `
      <button class="btn-danger" onclick="withdrawApplicationModal('${app.id}')">Withdraw Application (FR-3.4)</button>
    `;
  }

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <h2>Retirement Case: ${app.id}</h2>
        <div style="font-size: 13px; color: #64748b;">${app.employeeName} (${app.designation}) • ${app.department}</div>
      </div>
      <button class="modal-close-btn" onclick="closeRetirementModal()">&times;</button>
    </div>

    <div class="modal-body">
      <!-- 8-Stage Interactive Workflow Diagram -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="font-size: 14px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">Retirement Lifecycle Progress (Section 7.1)</h4>
          <span class="badge ${app.status.includes('Returned') ? 'badge-danger' : 'badge-success'}">${app.status}</span>
        </div>
        ${workflowHtml}
        <div style="font-size: 12.5px; color: #64748b; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 8px;">
          Note: Any reviewing officer can return an application back to the employee or earlier stages with remarks.
        </div>
      </div>

      <!-- Service Details Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 11.5px; color: #64748b; font-weight: 600;">DATE OF BIRTH / JOINING</div>
          <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-top: 4px;">${app.dob} / ${app.joiningDate}</div>
        </div>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 11.5px; color: #64748b; font-weight: 600;">SUPERANNUATION DATE</div>
          <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-top: 4px;">${app.superannuationDate}</div>
        </div>
        <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 11.5px; color: #64748b; font-weight: 600;">QUALIFYING SERVICE</div>
          <div style="font-size: 14px; font-weight: 700; color: #059669; margin-top: 4px;">${app.qualifyingServiceYears} Completed Years</div>
        </div>
      </div>

      <!-- Financial & Benefit Estimates -->
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 14px; font-weight: 700; color: #065f46;">Statutory Benefits Summary (FR-7)</h4>
          <button class="btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="openBenefitCalcModal('${app.id}')">Open Formula Details 🧮</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
          <div>
            <div style="font-size: 11.5px; color: #047857;">BASIC PAY + DA</div>
            <div style="font-size: 15px; font-weight: 800; color: #064e3b;">$${app.basicPay} + ${app.daPercent}%</div>
          </div>
          <div>
            <div style="font-size: 11.5px; color: #047857;">MONTHLY PENSION</div>
            <div style="font-size: 15px; font-weight: 800; color: #059669;">$${app.monthlyPensionEstimate.toLocaleString()}/mo</div>
          </div>
          <div>
            <div style="font-size: 11.5px; color: #047857;">DEATH-CUM-RETIREMENT GRATUITY</div>
            <div style="font-size: 15px; font-weight: 800; color: #064e3b;">$${app.gratuityEstimate.toLocaleString()}</div>
          </div>
          <div>
            <div style="font-size: 11.5px; color: #047857;">LEAVE ENCASHMENT (${app.leaveBalanceDays}d)</div>
            <div style="font-size: 15px; font-weight: 800; color: #064e3b;">$${app.leaveEncashmentEstimate.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <!-- Document Verification Table (FR-4) -->
      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">Mandatory Document Checklist (FR-4)</h4>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>File Size</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${app.documents.map((doc, dIdx) => `
                <tr>
                  <td><strong>${doc.name}</strong></td>
                  <td>${doc.size}</td>
                  <td>
                    <span class="badge ${doc.status === 'Verified' ? 'badge-success' : (doc.status === 'Issued' ? 'badge-info' : 'badge-warning')}">
                      ${doc.status}
                    </span>
                  </td>
                  <td>
                    <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="viewDocumentMock('${doc.name}')">View 👁️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Remarks History -->
      <div>
        <h4 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">Audit & Approver Remarks Trail (FR-5.2)</h4>
        ${remarksHtml}
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeRetirementModal()">Close</button>
      ${actionButtonsHtml}
    </div>
  `;

  modalOverlay.classList.add('active');
}

function closeRetirementModal() {
  document.getElementById('retirementModalOverlay').classList.remove('active');
}

// ==========================================================================
// WORKFLOW PROGRESSION ENGINE (8 Stages + Return Path)
// ==========================================================================
function advanceWorkflow(appId, nextStageIndex, nextStageLabel) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;

  app.currentStageIndex = nextStageIndex;
  app.status = nextStageLabel;
  app.remarksHistory.push({
    author: `${APP_STATE.currentUser.name} (${APP_STATE.currentUser.roleLabel})`,
    role: APP_STATE.currentUser.roleLabel,
    date: new Date().toISOString().slice(0, 10),
    text: `Application reviewed and advanced to stage: ${nextStageLabel}.`
  });

  addAuditLog(`Application ${appId} advanced to stage: ${nextStageLabel}`, 'WORKFLOW_ADVANCE', appId);
  showToast(`Case ${appId} successfully advanced to ${nextStageLabel}!`, 'success');

  closeRetirementModal();
  renderCards();
}

function forceAdvanceWorkflow(appId) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;
  if (app.currentStageIndex < WORKFLOW_STAGES.length - 1) {
    app.currentStageIndex++;
    app.status = WORKFLOW_STAGES[app.currentStageIndex];
    app.remarksHistory.push({
      author: `${APP_STATE.currentUser.name} (Admin Override)`,
      role: 'Administrator',
      date: new Date().toISOString().slice(0, 10),
      text: `Administrative override: advanced to ${app.status}`
    });
    addAuditLog(`Admin override advanced application ${appId} to ${app.status}`, 'ADMIN_OVERRIDE', appId);
    showToast(`Application moved to ${app.status}`, 'success');
    closeRetirementModal();
    renderCards();
  }
}

function returnApplicationModal(appId) {
  const reason = prompt('Please enter mandatory reason/remarks for returning this application for correction:');
  if (!reason || !reason.trim()) {
    showToast('Remarks are mandatory when returning an application (FR-5.2)', 'error');
    return;
  }

  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;

  app.status = 'Returned with Remarks';
  app.currentStageIndex = 0; // Returns back to employee
  app.remarksHistory.push({
    author: `${APP_STATE.currentUser.name} (${APP_STATE.currentUser.roleLabel})`,
    role: APP_STATE.currentUser.roleLabel,
    date: new Date().toISOString().slice(0, 10),
    text: `RETURNED: ${reason.trim()}`
  });

  addAuditLog(`Application ${appId} returned for correction: ${reason.trim()}`, 'WORKFLOW_RETURN', appId);
  showToast(`Application ${appId} returned with remarks. Notification sent to employee!`, 'info');

  closeRetirementModal();
  renderCards();
}

function withdrawApplicationModal(appId) {
  const reason = prompt('Enter reason for withdrawing your retirement application (FR-3.4):');
  if (!reason || !reason.trim()) return;

  APPLICATIONS = APPLICATIONS.filter(a => a.id !== appId);
  addAuditLog(`Application ${appId} withdrawn by employee: ${reason.trim()}`, 'APPLICATION_WITHDRAWN', appId);
  showToast(`Retirement application ${appId} has been withdrawn successfully.`, 'info');
  closeRetirementModal();
  renderCards();
}

// ==========================================================================
// NO-DUES CLEARANCE MATRIX MODAL (FR-6)
// ==========================================================================
function openNoDuesModal(appId) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;

  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  let totalDues = 0;
  Object.values(app.noDues).forEach(dept => {
    totalDues += (dept.amount || 0);
  });

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <h2>Parallel Departmental No-Dues Clearance (FR-6)</h2>
        <div style="font-size: 13px; color: #64748b;">Case: ${app.id} • ${app.employeeName}</div>
      </div>
      <button class="modal-close-btn" onclick="openRetirementDetailModal('${app.id}')">&times;</button>
    </div>

    <div class="modal-body">
      <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 14px; border-radius: 8px; margin-bottom: 20px; font-size: 13.5px; color: #166534;">
        Clearance requests are issued in parallel to all 5 departments. Outstanding amounts are automatically deducted from the final retirement settlement (FR-6.3).
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Status</th>
              <th>Outstanding Dues</th>
              <th>Nodal Officer Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Assets & Equipment</strong></td>
              <td><span class="badge ${app.noDues.assets.status === 'CLEARED' ? 'badge-success' : 'badge-danger'}">${app.noDues.assets.status}</span></td>
              <td>$${app.noDues.assets.amount}</td>
              <td>${app.noDues.assets.notes || 'All laptops, inventory and furniture accounted for.'}</td>
              <td>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="toggleNoDuesDept('${app.id}', 'assets')">Toggle Status</button>
              </td>
            </tr>
            <tr>
              <td><strong>Central Library</strong></td>
              <td><span class="badge ${app.noDues.library.status === 'CLEARED' ? 'badge-success' : 'badge-danger'}">${app.noDues.library.status}</span></td>
              <td>$${app.noDues.library.amount}</td>
              <td>${app.noDues.library.notes || 'No overdue books or research journals.'}</td>
              <td>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="toggleNoDuesDept('${app.id}', 'library')">Toggle Status</button>
              </td>
            </tr>
            <tr>
              <td><strong>IT & Telecommunications</strong></td>
              <td><span class="badge ${app.noDues.it.status === 'CLEARED' ? 'badge-success' : 'badge-danger'}">${app.noDues.it.status}</span></td>
              <td>$${app.noDues.it.amount}</td>
              <td>${app.noDues.it.notes || 'VPN tokens and cloud credentials de-provisioned.'}</td>
              <td>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="toggleNoDuesDept('${app.id}', 'it')">Toggle Status</button>
              </td>
            </tr>
            <tr>
              <td><strong>Loans & Advances</strong></td>
              <td><span class="badge ${app.noDues.loans.status === 'CLEARED' ? 'badge-success' : 'badge-danger'}">${app.noDues.loans.status}</span></td>
              <td>$${app.noDues.loans.amount}</td>
              <td>${app.noDues.loans.notes || 'HBA, Festival and Computer advances fully settled.'}</td>
              <td>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="toggleNoDuesDept('${app.id}', 'loans')">Toggle Status</button>
              </td>
            </tr>
            <tr>
              <td><strong>Staff Quarters & Housing</strong></td>
              <td><span class="badge ${app.noDues.quarters.status === 'CLEARED' ? 'badge-success' : 'badge-danger'}">${app.noDues.quarters.status}</span></td>
              <td>$${app.noDues.quarters.amount}</td>
              <td>${app.noDues.quarters.notes || 'Quarter vacated; electricity and water meters cleared.'}</td>
              <td>
                <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="toggleNoDuesDept('${app.id}', 'quarters')">Toggle Status</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div>
          <span style="font-size: 13px; color: #64748b;">Total Outstanding Departmental Recoveries:</span>
          <div style="font-size: 20px; font-weight: 800; color: ${totalDues > 0 ? '#b91c1c' : '#059669'};">
            $${totalDues.toLocaleString()}
          </div>
        </div>
        <div>
          ${totalDues === 0 ? 
            `<button class="btn-primary" onclick="generateNoDuesCertMock('${app.id}')">Generate Unified No-Dues Certificate (FR-6.4) 📜</button>` :
            `<button class="btn-secondary" onclick="settleAllDues('${app.id}')">Record Dues Deduction from Final Settlement 💳</button>`
          }
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="openRetirementDetailModal('${app.id}')">Back to Case</button>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function toggleNoDuesDept(appId, deptKey) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;

  const current = app.noDues[deptKey].status;
  if (current === 'CLEARED') {
    const amount = prompt(`Enter outstanding due amount for ${deptKey.toUpperCase()} ($):`, '250');
    if (amount) {
      app.noDues[deptKey].status = 'DUES_PENDING';
      app.noDues[deptKey].amount = parseFloat(amount) || 250;
      app.noDues[deptKey].notes = 'Outstanding dues reported by nodal officer.';
    }
  } else {
    app.noDues[deptKey].status = 'CLEARED';
    app.noDues[deptKey].amount = 0;
    app.noDues[deptKey].notes = 'Dues cleared and verified.';
  }

  addAuditLog(`Updated No-Dues status for case ${appId} in department ${deptKey}`, 'NO_DUES_UPDATE', appId);
  openNoDuesModal(appId);
}

function settleAllDues(appId) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;

  Object.keys(app.noDues).forEach(k => {
    app.noDues[k].status = 'CLEARED';
    app.noDues[k].amount = 0;
    app.noDues[k].notes = 'Recovered from final settlement.';
  });

  addAuditLog(`Recovered all outstanding dues from final settlement for ${appId}`, 'DUES_SETTLED', appId);
  showToast('All outstanding dues successfully recovered and recorded.', 'success');
  openNoDuesModal(appId);
}

function generateNoDuesCertMock(appId) {
  showToast(`Unified No-Dues Certificate generated and attached to Case ${appId}!`, 'success');
  addAuditLog(`Generated unified No-Dues Certificate for ${appId}`, 'NO_DUES_CERT_GENERATED', appId);
}

// ==========================================================================
// BENEFIT CALCULATION & WHAT-IF ESTIMATOR (FR-7)
// ==========================================================================
function openBenefitCalcModal(appId) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;

  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  const emoluments = app.basicPay * (1 + app.daPercent / 100);
  const monthlyPension = emoluments * 0.5;
  const commutedValue = (monthlyPension * (app.commutationPercentage / 100)) * 12 * 8.194;
  const reducedPension = monthlyPension * (1 - app.commutationPercentage / 100);

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <h2>Pension & Benefit Calculation Engine (FR-7)</h2>
        <div style="font-size: 13px; color: #64748b;">Applicant: ${app.employeeName} (${app.id}) • Service: ${app.qualifyingServiceYears} Years</div>
      </div>
      <button class="modal-close-btn" onclick="openRetirementDetailModal('${app.id}')">&times;</button>
    </div>

    <div class="modal-body">
      <!-- Statutory Formulas Breakdown -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h4 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 12px;">Step-by-Step Benefit Formula Breakdown (FR-7.2)</h4>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px;">
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <div style="font-weight: 700; color: #059669;">1. Monthly Pension Formula</div>
            <div style="color: #64748b; font-family: monospace; margin: 4px 0;">50% of (Basic Pay + DA)</div>
            <div>= 50% × ($${app.basicPay} + ${app.daPercent}%) = <strong>$${Math.round(monthlyPension).toLocaleString()}/month</strong></div>
          </div>

          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <div style="font-weight: 700; color: #059669;">2. Gratuity (DCRG) Formula</div>
            <div style="color: #64748b; font-family: monospace; margin: 4px 0;">(15 × Emoluments × Service) / 26</div>
            <div>= (15 × $${Math.round(emoluments)} × ${app.qualifyingServiceYears}) / 26 = <strong>$${app.gratuityEstimate.toLocaleString()}</strong></div>
          </div>

          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <div style="font-weight: 700; color: #059669;">3. Leave Encashment Formula</div>
            <div style="color: #64748b; font-family: monospace; margin: 4px 0;">(Emoluments / 30) × EL Days</div>
            <div>= ($${Math.round(emoluments)} / 30) × ${app.leaveBalanceDays} days = <strong>$${app.leaveEncashmentEstimate.toLocaleString()}</strong></div>
          </div>

          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <div style="font-weight: 700; color: #059669;">4. Commutation Lump Sum (${app.commutationPercentage}%)</div>
            <div style="color: #64748b; font-family: monospace; margin: 4px 0;">Commuted Portion × 12 × 8.194 factor</div>
            <div>= Lump Sum: <strong>$${Math.round(commutedValue).toLocaleString()}</strong> (Residual: $${Math.round(reducedPension)}/m)</div>
          </div>
        </div>
      </div>

      <!-- What-If Simulator (FR-7.3) -->
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 14px; font-weight: 700; color: #1e40af;">Interactive What-If Pension Estimator (FR-7.3)</h4>
          <span style="font-size: 12px; color: #2563eb;">Simulate scenarios before final sanction</span>
        </div>

        <div style="margin-bottom: 14px;">
          <label style="font-size: 13px; font-weight: 600; color: #1e3a8a; display: block; margin-bottom: 6px;">
            Commutation Percentage: <span id="whatIfCommVal">${app.commutationPercentage}%</span> (Max 40% lump sum withdrawal)
          </label>
          <input type="range" class="range-slider" min="0" max="40" value="${app.commutationPercentage}" id="whatIfCommSlider" 
            oninput="updateWhatIfCalc(this.value, ${monthlyPension}, ${app.gratuityEstimate}, ${app.leaveEncashmentEstimate})">
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: white; padding: 14px; border-radius: 6px; border: 1px solid #bfdbfe;">
          <div>
            <div style="font-size: 11px; color: #64748b;">COMMUTED LUMP SUM</div>
            <div id="whatIfLumpSum" style="font-size: 16px; font-weight: 800; color: #1d4ed8;">$${Math.round(commutedValue).toLocaleString()}</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #64748b;">RESIDUAL MONTHLY PENSION</div>
            <div id="whatIfResidual" style="font-size: 16px; font-weight: 800; color: #059669;">$${Math.round(reducedPension).toLocaleString()}/mo</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #64748b;">TOTAL EXIT SETTLEMENT</div>
            <div id="whatIfTotalExit" style="font-size: 16px; font-weight: 800; color: #0f172a;">$${Math.round(commutedValue + app.gratuityEstimate + app.leaveEncashmentEstimate).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <!-- Accounts Review & Adjustment (FR-7.4) -->
      ${APP_STATE.currentRole === 'accounts_officer' || APP_STATE.currentRole === 'administrator' ? `
        <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 14px; border-radius: 8px;">
          <h4 style="font-size: 13.5px; font-weight: 700; color: #92400e; margin-bottom: 8px;">Accounts Review & Mandatory Adjustment Reason (FR-7.4)</h4>
          <div style="display: flex; gap: 10px;">
            <input type="text" id="accAdjustReason" class="form-control" placeholder="Mandatory reason if modifying figures (e.g. Audit revision of qualifying service)...">
            <button class="btn-primary" onclick="saveAccountsAdjustment('${app.id}')">Save & Certify</button>
          </div>
        </div>
      ` : ''}
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="openRetirementDetailModal('${app.id}')">Back to Case</button>
      <button class="btn-primary" onclick="exportCalculationPdfMock('${app.id}')">Export Benefits Statement (PDF) 📥</button>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function updateWhatIfCalc(commPercent, monthlyPension, gratuity, leaveEncash) {
  document.getElementById('whatIfCommVal').textContent = `${commPercent}%`;
  const commutedValue = (monthlyPension * (commPercent / 100)) * 12 * 8.194;
  const residual = monthlyPension * (1 - commPercent / 100);
  const total = commutedValue + gratuity + leaveEncash;

  document.getElementById('whatIfLumpSum').textContent = `$${Math.round(commutedValue).toLocaleString()}`;
  document.getElementById('whatIfResidual').textContent = `$${Math.round(residual).toLocaleString()}/mo`;
  document.getElementById('whatIfTotalExit').textContent = `$${Math.round(total).toLocaleString()}`;
}

function saveAccountsAdjustment(appId) {
  const input = document.getElementById('accAdjustReason');
  if (!input.value.trim()) {
    showToast('A mandatory reason is required to adjust benefits (FR-7.4)', 'error');
    return;
  }
  addAuditLog(`Accounts officer adjusted benefit record for ${appId}: ${input.value.trim()}`, 'BENEFIT_ADJUSTMENT', appId);
  showToast('Benefit adjustment verified and written to immutable audit trail.', 'success');
}

function exportCalculationPdfMock(appId) {
  showToast(`Benefit Statement for ${appId} exported to PDF!`, 'success');
}

// ==========================================================================
// SANCTION ORDER GENERATOR (FR-8)
// ==========================================================================
function generateSanctionOrderModal(appId) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;

  app.sanctionOrderNo = `SANCTION/2026/PENS/${appId.slice(-4)}`;
  app.currentStageIndex = 6;
  app.status = 'Sanction Order Issued';

  addAuditLog(`Issued formal retirement sanction order ${app.sanctionOrderNo} for ${app.employeeName}`, 'SANCTION_ISSUED', appId);
  showToast(`Sanction order ${app.sanctionOrderNo} successfully signed and issued!`, 'success');

  viewSanctionOrderModal(appId);
}

function viewSanctionOrderModal(appId) {
  const app = APPLICATIONS.find(a => a.id === appId);
  if (!app) return;

  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  const orderNum = app.sanctionOrderNo || `SANCTION/2026/PENS/${app.id.slice(-4)}`;

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <h2>Retirement Sanction Order (FR-8)</h2>
        <div style="font-size: 13px; color: #64748b;">Ref: ${orderNum}</div>
      </div>
      <button class="modal-close-btn" onclick="openRetirementDetailModal('${app.id}')">&times;</button>
    </div>

    <div class="modal-body">
      <!-- Printable Official Document Format -->
      <div class="sanction-document" id="printableSanctionDoc">
        <div class="sanction-header">
          <div style="font-size: 14px; text-transform: uppercase; font-weight: bold;">Office of the Competent Sanctioning Authority</div>
          <div style="font-size: 13px; margin: 4px 0;">Directorate of Pension & Retirement Benefits</div>
          <div class="sanction-title">Formal Retirement Sanction Order</div>
          <div style="font-size: 12px; margin-top: 6px;">Order Ref: <strong>${orderNum}</strong> | Date: ${new Date().toLocaleDateString()}</div>
        </div>

        <p style="margin-bottom: 14px; text-align: justify;">
          In accordance with the Central Civil Service (Pension) Rules, sanction is hereby accorded to the retirement of
          <strong>${app.employeeName}</strong>, holding the post of <strong>${app.designation}</strong> in the
          Department of <strong>${app.department}</strong> (Employee ID: <strong>${app.employeeId}</strong>),
          with effect from the afternoon of <strong>${app.intendedDate}</strong> on attaining the age of superannuation.
        </p>

        <p style="margin-bottom: 14px;">
          The admissible retirement benefits calculated on the basis of <strong>${app.qualifyingServiceYears}</strong> completed
          years of qualifying service and last drawn pay are sanctioned as under:
        </p>

        <table class="sanction-table">
          <thead>
            <tr>
              <th>Benefit Component</th>
              <th>Sanctioned Amount</th>
              <th>Disbursement Schedule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Monthly Pension</td>
              <td><strong>$${app.monthlyPensionEstimate.toLocaleString()}</strong></td>
              <td>Monthly w.e.f. ${app.intendedDate}</td>
            </tr>
            <tr>
              <td>Retirement Gratuity (DCRG)</td>
              <td><strong>$${app.gratuityEstimate.toLocaleString()}</strong></td>
              <td>One-time lump sum settlement</td>
            </tr>
            <tr>
              <td>Leave Encashment (${app.leaveBalanceDays} days)</td>
              <td><strong>$${app.leaveEncashmentEstimate.toLocaleString()}</strong></td>
              <td>One-time lump sum settlement</td>
            </tr>
            <tr>
              <td>Commuted Pension Value (${app.commutationPercentage}%)</td>
              <td><strong>$${Math.round((app.monthlyPensionEstimate * 0.4) * 12 * 8.194).toLocaleString()}</strong></td>
              <td>One-time lump sum advance</td>
            </tr>
            <tr style="background: #f8fafc; font-weight: bold;">
              <td>Net Monthly Pension Payable (Post Commutation)</td>
              <td>$${Math.round(app.monthlyPensionEstimate * 0.6).toLocaleString()} / month</td>
              <td>Credited through Core Banking System</td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 12px; color: #475569; margin: 16px 0;">
          The Pay & Accounts Officer is directed to disburse the sanctioned amounts into the pensioner's registered bank account
          after adjusting all verified departmental dues.
        </p>

        <div class="sanction-footer">
          <div class="qr-code-box">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" stroke-width="2"/>
              <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
              <rect x="18" y="18" width="3" height="3" fill="currentColor"/>
            </svg>
            <span>Scan to Verify Online</span>
          </div>

          <div style="text-align: right;">
            <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 24px; color: #1e3a8a;">
              William Sterling
            </div>
            <div style="font-weight: bold; font-size: 13px;">(Dr. William Sterling)</div>
            <div style="font-size: 12px;">Executive Director & Competent Authority</div>
            <div style="font-size: 11px; color: #059669; font-weight: bold; margin-top: 4px;">
              [ Digitally Signed with e-Sign DSC Token • Validated ]
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="openRetirementDetailModal('${app.id}')">Back</button>
      <button class="btn-primary" onclick="window.print()">Print / Save as PDF 🖨️</button>
    </div>
  `;

  modalOverlay.classList.add('active');
}

// ==========================================================================
// PENSIONER SELF-SERVICE PORTAL (FR-9)
// ==========================================================================
function openPensionerPortalModal() {
  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  const pensionerApp = APPLICATIONS.find(a => a.status.includes('Sanctioned') || a.id === 'RET-2026-0520');

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <h2>Pensioner Self-Service Hub (FR-9)</h2>
        <div style="font-size: 13px; color: #64748b;">Welcome, Arthur Pendelton • PPO #PEN-8012-2026</div>
      </div>
      <button class="modal-close-btn" onclick="closeRetirementModal()">&times;</button>
    </div>

    <div class="modal-body">
      <!-- Pension Overview Card -->
      <div style="background: linear-gradient(135deg, #065f46, #047857); color: white; border-radius: 12px; padding: 22px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 13px; opacity: 0.85;">CURRENT MONTHLY PENSION CREDIT</div>
            <div style="font-size: 32px; font-weight: 800; margin-top: 4px;">$7,952.00</div>
            <div style="font-size: 13px; margin-top: 6px; opacity: 0.9;">
              Disbursed to: State Apex Bank • Account ending ****3901
            </div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4);">
              Life Certificate: ACTIVE (Valid till Nov 2027)
            </span>
            <div style="font-size: 12px; margin-top: 8px; opacity: 0.85;">Next credit date: Nov 30, 2026</div>
          </div>
        </div>
      </div>

      <!-- Action Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
        <!-- Digital Life Certificate (FR-9.3) -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
          <h4 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Annual Life Certificate (DLC)</h4>
          <p style="font-size: 12.5px; color: #64748b; margin-bottom: 14px;">Submit annual digital life certificate (Jeevan Pramaan) online using face authentication.</p>
          <button class="btn-primary" style="width: 100%; justify-content: center; font-size: 13px;" onclick="submitLifeCertificateMock()">
            Submit Digital DLC 🤳
          </button>
        </div>

        <!-- Download Payslips & Form 16 (FR-9.1) -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
          <h4 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Pension Slips & Tax Form 16</h4>
          <p style="font-size: 12.5px; color: #64748b; margin-bottom: 14px;">Download monthly credit payslips and annual Form 16 income tax deduction certificates.</p>
          <button class="btn-secondary" style="width: 100%; justify-content: center; font-size: 13px;" onclick="downloadPensionSlipMock()">
            Download Payslip (PDF) 📄
          </button>
        </div>

        <!-- Update Contact & Bank Details (FR-9.2) -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
          <h4 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Profile & Bank Updates</h4>
          <p style="font-size: 12.5px; color: #64748b; margin-bottom: 14px;">Submit a verified request to change communication address or pension bank branch.</p>
          <button class="btn-secondary" style="width: 100%; justify-content: center; font-size: 13px;" onclick="requestBankUpdateModal()">
            Request Change ✍️
          </button>
        </div>
      </div>

      <!-- Grievance & Query Tracker (FR-9.4) -->
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 14px; font-weight: 700; color: #1e293b;">Pensioner Grievance Redressal (FR-9.4)</h4>
          <button class="btn-primary" style="padding: 4px 10px; font-size: 12px;" onclick="raiseGrievanceModal()">+ Raise New Query</button>
        </div>
        <div class="data-table-container" style="margin-top: 0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Date Raised</th>
                <th>Status</th>
                <th>Resolution Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>#GRV-2026-081</strong></td>
                <td>Discrepancy in DA arrear calculation for Q2</td>
                <td>2026-10-12</td>
                <td><span class="badge badge-success">Resolved</span></td>
                <td>DA arrear of $320 credited with Oct 2026 pension.</td>
              </tr>
              <tr>
                <td><strong>#GRV-2026-104</strong></td>
                <td>Request for duplicate Form 16 copy</td>
                <td>2026-11-15</td>
                <td><span class="badge badge-info">Under Process</span></td>
                <td>Accounts officer processing duplicate certificate.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeRetirementModal()">Close Hub</button>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function submitLifeCertificateMock() {
  showToast('Simulating Face Verification Camera... Biometric confirmed! Annual Life Certificate submitted and valid for 12 months.', 'success');
  addAuditLog('Pensioner Arthur Pendelton submitted Annual Digital Life Certificate (Jeevan Pramaan)', 'LIFE_CERTIFICATE_SUBMITTED', 'PEN-8012');
}

function downloadPensionSlipMock() {
  showToast('Pension Payslip for October 2026 downloaded!', 'success');
}

function requestBankUpdateModal() {
  const newAccount = prompt('Enter new Bank Account Number & IFSC to submit for HR verification:');
  if (newAccount) {
    showToast(`Bank change request submitted to HR Scrutiny. Request ID: #CHG-${Math.floor(Math.random()*9000)+1000}`, 'info');
    addAuditLog(`Pensioner submitted bank account update request: ${newAccount}`, 'BANK_CHANGE_REQUEST', 'PEN-8012');
  }
}

function raiseGrievanceModal() {
  const query = prompt('Describe your pension query or grievance:');
  if (query) {
    showToast(`Grievance registered under Ticket #GRV-2026-${Math.floor(Math.random()*900)+100}. HR officer assigned.`, 'success');
    addAuditLog(`Pensioner raised grievance: ${query}`, 'GRIEVANCE_RAISED', 'PEN-8012');
  }
}

// ==========================================================================
// HR RETIRING FORECAST & AUDIT LOGS (FR-10)
// ==========================================================================
function openForecastReportModal() {
  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <h2>Upcoming Retirements Forecast Report (FR-10.2)</h2>
        <div style="font-size: 13px; color: #64748b;">Human Resources Long-Range Retirement Planning</div>
      </div>
      <button class="modal-close-btn" onclick="closeRetirementModal()">&times;</button>
    </div>

    <div class="modal-body">
      <!-- 6, 12, 24 Month Filter Controls -->
      <div style="display: flex; gap: 12px; margin-bottom: 20px;">
        <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="showToast('Filtering for next 6 months...', 'info')">
          Retiring in Next 6 Months (3)
        </button>
        <button class="btn-secondary" style="flex: 1; justify-content: center;" onclick="showToast('Filtering for next 12 months...', 'info')">
          Retiring in Next 12 Months (8)
        </button>
        <button class="btn-secondary" style="flex: 1; justify-content: center;" onclick="showToast('Filtering for next 24 months...', 'info')">
          Retiring in Next 24 Months (19)
        </button>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Superannuation Date</th>
              <th>Qualifying Service</th>
              <th>Vigilance Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>EMP-1042</strong></td>
              <td>Robert Chen</td>
              <td>Sr. Staff Engineer</td>
              <td>IT & Systems</td>
              <td>2026-12-31</td>
              <td>32 Years</td>
              <td><span class="badge badge-success">Clear</span></td>
            </tr>
            <tr>
              <td><strong>EMP-1249</strong></td>
              <td>Franklin Wright</td>
              <td>Chief Financial Analyst</td>
              <td>Finance & Accounts</td>
              <td>2026-11-30</td>
              <td>34 Years</td>
              <td><span class="badge badge-success">Clear</span></td>
            </tr>
            <tr>
              <td><strong>EMP-1390</strong></td>
              <td>Margaret Cho</td>
              <td>Senior Registrar</td>
              <td>Administration</td>
              <td>2027-01-31</td>
              <td>31 Years</td>
              <td><span class="badge badge-success">Clear</span></td>
            </tr>
            <tr>
              <td><strong>EMP-1402</strong></td>
              <td>Grace Hopper</td>
              <td>Lead Systems Analyst</td>
              <td>IT & Systems</td>
              <td>2027-02-28</td>
              <td>29 Years</td>
              <td><span class="badge badge-success">Clear</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeRetirementModal()">Close</button>
      <button class="btn-primary" onclick="exportForecastCsv()">Export to Excel / CSV (FR-10.4) 📊</button>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function exportForecastCsv() {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "Employee ID,Name,Designation,Department,Superannuation Date,Qualifying Service,Vigilance Status\n" +
    "EMP-1042,Robert Chen,Sr. Staff Engineer,IT,2026-12-31,32 Years,Clear\n" +
    "EMP-1249,Franklin Wright,Chief Financial Analyst,Finance,2026-11-30,34 Years,Clear\n" +
    "EMP-1390,Margaret Cho,Senior Registrar,Administration,2027-01-31,31 Years,Clear\n" +
    "EMP-1402,Grace Hopper,Lead Systems Analyst,IT,2027-02-28,29 Years,Clear";

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "retiring_employees_forecast_2026_2028.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Exported upcoming retirements report to CSV!', 'success');
}

function openAuditLogsModal() {
  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <h2>Tamper-Evident Immutable Audit Log (FR-10.6 & NFR-11)</h2>
        <div style="font-size: 13px; color: #64748b;">Statutory Audit Trail • Retained for minimum 10 years</div>
      </div>
      <button class="modal-close-btn" onclick="closeRetirementModal()">&times;</button>
    </div>

    <div class="modal-body">
      <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 16px; font-size: 13px; color: #475569;">
        Every login, application creation, document verification, departmental clearance, benefit computation, and sanction event is permanently recorded with client IP and timestamps.
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Record</th>
              <th>Details</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            ${AUDIT_LOGS.map(log => `
              <tr>
                <td style="font-family: monospace; font-size: 12px;">${log.timestamp}</td>
                <td><strong>${log.user}</strong></td>
                <td><span class="badge badge-info">${log.role}</span></td>
                <td><code>${log.action}</code></td>
                <td><strong>${log.recordId}</strong></td>
                <td>${log.details}</td>
                <td style="font-family: monospace; font-size: 12px;">${log.ip}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeRetirementModal()">Close</button>
      <button class="btn-primary" onclick="showToast('Audit report exported with digital verification signature.', 'success')">Export Audit Log (PDF) 📥</button>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function addAuditLog(details, action = 'SYSTEM_EVENT', recordId = 'SYSTEM') {
  const now = new Date();
  const timeStr = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
  AUDIT_LOGS.unshift({
    timestamp: timeStr,
    user: APP_STATE.currentUser.name,
    role: APP_STATE.currentUser.roleLabel || APP_STATE.currentUser.title,
    action: action,
    recordId: recordId,
    details: details,
    ip: '10.14.33.109'
  });
}

// ==========================================================================
// NEW RETIREMENT APPLICATION FORM WIZARD (FR-3)
// ==========================================================================
function openNewApplicationModal() {
  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <h2>Retirement Application Submission (FR-3)</h2>
        <div style="font-size: 13px; color: #64748b;">Applicant: Robert Chen • EMP-1042</div>
      </div>
      <button class="modal-close-btn" onclick="closeRetirementModal()">&times;</button>
    </div>

    <div class="modal-body">
      <!-- Pre-filled HR Data Warning (FR-2.1) -->
      <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #166534;">
        Personal and service particulars are pre-filled directly from the HR System. Flag errors before submitting (FR-2.4).
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Employee Full Name</label>
          <input type="text" class="form-control" value="Robert Chen" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Employee ID & Cadre</label>
          <input type="text" class="form-control" value="EMP-1042 • Grade-A Senior Officer" readonly>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Retirement Scheme / Category (FR-3.1)</label>
          <select class="form-control" id="newRetScheme">
            <option value="Superannuation">Superannuation (Normal Retirement on reaching age 60)</option>
            <option value="Voluntary (VRS)">Voluntary Retirement Scheme (VRS - 20+ Years Service)</option>
            <option value="Premature">Premature / Medical Retirement</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Intended Retirement Date (FR-3.2)</label>
          <input type="date" class="form-control" id="newRetDate" value="2026-12-31">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Post-Retirement Residential Address (FR-3.2)</label>
        <textarea class="form-control" id="newRetAddress" rows="2" placeholder="Enter complete address after retirement...">Plot 42, Sunrise Enclave, New Delhi - 110016</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Pension Disbursement Bank & Branch</label>
          <input type="text" class="form-control" id="newRetBank" value="State Apex Bank, Parliament Street Branch">
        </div>
        <div class="form-group">
          <label class="form-label">Bank Account Number & IFSC / Routing</label>
          <input type="text" class="form-control" id="newRetAccount" value="AC# 501004928192 • IFSC: SABK0001928">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Primary Nominee Name & Relationship</label>
          <input type="text" class="form-control" id="newRetNominee" value="Eleanor Chen (Spouse, 100% share)">
        </div>
        <div class="form-group">
          <label class="form-label">Commutation Option (% of pension to commute)</label>
          <select class="form-control" id="newRetComm">
            <option value="40">40% Commutation (Maximum Permissible Lump Sum)</option>
            <option value="30">30% Commutation</option>
            <option value="20">20% Commutation</option>
            <option value="0">0% (Nil Commutation - Full Monthly Pension)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeRetirementModal()">Cancel</button>
      <button class="btn-secondary" onclick="saveDraftApplication()">Save Draft (FR-3.3)</button>
      <button class="btn-primary" onclick="submitNewApplication()">Submit Retirement Application (FR-3.3) 🚀</button>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function saveDraftApplication() {
  showToast('Application draft saved successfully. You can return and complete it anytime.', 'info');
  closeRetirementModal();
}

function submitNewApplication() {
  const scheme = document.getElementById('newRetScheme').value;
  const date = document.getElementById('newRetDate').value;
  const comm = parseInt(document.getElementById('newRetComm').value);

  const newId = `RET-2026-0${Math.floor(Math.random() * 800) + 100}`;
  
  const newApp = {
    id: newId,
    employeeId: 'EMP-1042',
    employeeName: 'Robert Chen',
    designation: 'Sr. Staff Engineer',
    department: 'Information Technology',
    dob: '1966-12-15',
    joiningDate: '1994-06-01',
    superannuationDate: '2026-12-31',
    retirementType: scheme,
    intendedDate: date,
    status: 'Reporting Officer',
    currentStageIndex: 1,
    basicPay: 9400,
    daPercent: 42,
    qualifyingServiceYears: 32,
    leaveBalanceDays: 280,
    monthlyPensionEstimate: 6674,
    gratuityEstimate: 232000,
    leaveEncashmentEstimate: 125000,
    commutationPercentage: comm,
    daysElapsed: 1,
    slaDays: 15,
    vigilanceStatus: 'CLEAR',
    vigilanceNotes: 'Cleared.',
    documents: [
      { name: 'National ID Proof', status: 'Verified', size: '2.4 MB' },
      { name: 'Bank Passbook', status: 'Verified', size: '1.8 MB' },
      { name: 'Nomination Form', status: 'Verified', size: '3.1 MB' }
    ],
    noDues: {
      assets: { status: 'AWAITING', amount: 0, officer: 'David Ross' },
      library: { status: 'AWAITING', amount: 0, officer: 'K. Sharma' },
      it: { status: 'AWAITING', amount: 0, officer: 'D. Miller' },
      loans: { status: 'AWAITING', amount: 0, officer: 'A. Gupta' },
      quarters: { status: 'AWAITING', amount: 0, officer: 'M. Jenkins' }
    },
    remarksHistory: [
      { author: 'Robert Chen (Employee)', role: 'Employee', date: new Date().toISOString().slice(0, 10), text: 'New application submitted via Portal.' }
    ]
  };

  APPLICATIONS.unshift(newApp);
  addAuditLog(`Employee submitted new retirement application ${newId} (${scheme})`, 'APPLICATION_SUBMITTED', newId);
  showToast(`Application ${newId} submitted! SMS & Email confirmation sent (FR-3.5)`, 'success');

  closeRetirementModal();
  renderCards();
}

// ==========================================================================
// JOBIFY JOB DETAILS MODAL (Exact UI Mode)
// ==========================================================================
function openJobDetailModal(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return;

  const modalOverlay = document.getElementById('retirementModalOverlay');
  const modalContainer = document.getElementById('retirementModalContainer');

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="org-logo" style="font-size: 26px;">${job.logo}</div>
        <div>
          <h2>${job.title}</h2>
          <div style="font-size: 13px; color: #64748b;">${job.company} • ${job.applicants} Applicants • ${job.posted}</div>
        </div>
      </div>
      <button class="modal-close-btn" onclick="closeRetirementModal()">&times;</button>
    </div>

    <div class="modal-body">
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <span class="tag-pill tag-blue">${job.tags[0]}</span>
        <span class="tag-pill tag-purple">${job.tags[1]}</span>
        <span class="tag-pill tag-amber">${job.tags[2]}</span>
      </div>

      <div style="font-size: 24px; font-weight: 800; color: #059669; margin-bottom: 16px;">
        ${job.salary}
      </div>

      <h4 style="font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">Job Description</h4>
      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
        ${job.description} As a ${job.title} at ${job.company}, you will collaborate closely with engineering, product, and leadership teams to architect intuitive, world-class user experiences and modern design systems.
      </p>

      <h4 style="font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">Key Responsibilities</h4>
      <ul style="color: #475569; font-size: 13.5px; line-height: 1.8; margin-left: 20px; margin-bottom: 20px;">
        <li>Define information architecture, wireframes, and design token hierarchies.</li>
        <li>Conduct rapid prototyping and usability testing with global user segments.</li>
        <li>Partner with design technologists and frontend developers to ship high-fidelity UI components.</li>
      </ul>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeRetirementModal()">Close</button>
      <button class="btn-primary" onclick="applyJobMock('${job.company}', '${job.title}')">Apply for this Job 🚀</button>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function applyJobMock(company, title) {
  showToast(`Application for ${title} at ${company} submitted successfully!`, 'success');
  closeRetirementModal();
}

function viewDocumentMock(docName) {
  showToast(`Opening preview for ${docName}... Verified successfully.`, 'info');
}

// ==========================================================================
// NAVIGATION ACTION HANDLER
// ==========================================================================
function handleNavAction(action) {
  switch(action) {
    case 'home':
      APP_STATE.filters.search = '';
      renderCards();
      break;
    case 'find-jobs':
      switchMode('jobify');
      break;
    case 'applications':
      switchMode('retirement');
      break;
    case 'new-app':
      openNewApplicationModal();
      break;
    case 'pensioner-hub':
      openPensionerPortalModal();
      break;
    case 'forecast':
      openForecastReportModal();
      break;
    case 'audit-logs':
      openAuditLogsModal();
      break;
    default:
      break;
  }
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size: 16px;">${type === 'success' ? '✓' : (type === 'error' ? '⚠️' : 'ℹ️')}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
