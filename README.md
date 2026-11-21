# Employee Retirement Portal & Jobify UI System
**Experiment 7: Implementation as per SRS and UI Design**  
*Academic & Enterprise-Grade Software Engineering Implementation*

---

## 📌 Executive Summary

This application is built strictly in accordance with the **Software Requirements Specification (SRS) for the Employee Retirement Portal** and the **Jobify Modern Web UI Design**. It provides an end-to-end web system covering the entire retirement lifecycle—from eligibility verification and application submission through multi-departmental no-dues clearance, statutory pension benefit calculation, digital sanction order generation, and post-retirement self-service—all presented in the clean, modern Jobify visual aesthetic.

In addition, the application includes a **Dual-Mode Switcher** in the top navigation:
1. 🏛️ **Retirement Portal (SRS Application)**: The full functional retirement workflow system covering all 10 Functional Requirements (FR-1 to FR-10) and 8 user classes.
2. 💼 **Jobify UI (Reference Design Mode)**: A pixel-perfect, interactive recreation of the exact Jobify job portal screenshot (`www.jobify-findjobs.com`), complete with dual search, filter sidebar, salary range slider ($50k/m - $120k/m), and job cards (Google, Apple, Spotify, Reddit, Discord, Pinterest, etc.).

---

## 🚀 How to Run the Application

The application is completely standalone and zero-dependency. You can run it in two ways:

### Option 1: Direct Browser Launch (Easiest)
Simply double-click [`index.html`](file:///c:/Users/RAGAVI/OneDrive/Desktop/exp%207/index.html) or open it in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).

### Option 2: Run via Node.js Server
Open a terminal in this directory (`c:\Users\RAGAVI\OneDrive\Desktop\exp 7`):
```bash
npm start
```
Then navigate to:
```
http://localhost:3000
```

---

## 📋 SRS Feature Traceability Matrix (Section 3 & 7)

| Requirement ID | Module / Feature | Implementation Details in Portal |
|---|---|---|
| **FR-1.1 – FR-1.5** | **Authentication & RBAC** | Top-right profile badge with 1-click Role Switcher supporting all 8 SRS user classes + Auditor; session indicator; audit-logged logins. |
| **FR-2.1 – FR-2.5** | **Profile & Retirement Eligibility** | Auto-calculates superannuation date based on DOB (turning age 60); checks VRS eligibility (20+ years service); displays active vigilance warning flags. |
| **FR-3.1 – FR-3.5** | **Retirement Application** | Step-by-step submission modal prefilled from HR records; specifies intended date, post-retirement address, bank details & nominee; save draft; withdrawal option (FR-3.4); simulated SMS & email alerts. |
| **FR-4.1 – FR-4.5** | **Document Management** | Checklist of mandatory documents (ID proof, bank passbook, nomination forms, photos, service book extract); file preview; review actions (Accept / Reject / Resubmit with remarks). |
| **FR-5.1 – FR-5.5** | **8-Stage Approval Workflow** | Visual interactive pipeline matching the diagram in Section 7.1: `Employee applies ➔ Reporting officer ➔ HR scrutiny ➔ No-dues clearance ➔ Accounts approval ➔ Final sanction ➔ Sanction order ➔ Pensioner account`, with return path and remarks. |
| **FR-6.1 – FR-6.4** | **Parallel No-Dues Clearance** | 5 configured departments (Assets, Central Library, IT, Loans & Advances, Staff Quarters); toggle clearance or input outstanding dues; auto-deduction from settlement; generates unified No-Dues Certificate (FR-6.4). |
| **FR-7.1 – FR-7.5** | **Pension & Benefit Calculation** | Transparent step-by-step formula breakdown: Monthly Pension (50% rule), DCRG Gratuity, Leave Encashment, Commutation (up to 40% lump-sum); includes an **interactive What-If simulator slider** and accounts officer audit adjustments. |
| **FR-8.1 – FR-8.5** | **Sanction Order & Closure** | Official printable government/corporate Sanction Order with reference number, itemized benefit table, **QR Code for online verification**, and **digital signature (e-Sign) seal**; auto-transition to pensioner. |
| **FR-9.1 – FR-9.4** | **Pensioner Self-Service** | View monthly pension credit; simulated Annual Digital Life Certificate (Jeevan Pramaan) submission; download payslips & Form 16; profile/bank update requests; grievance ticketing system. |
| **FR-10.1 – FR-10.6** | **Forecast Reports & Audit Logs** | HR forecast report filtering upcoming retirements in **next 6, 12, and 24 months** with **CSV/Excel export**; **tamper-evident immutable audit log** recording timestamp, user, action, record ID, and client IP. |

---

## 👥 SRS User Roles (Section 2.2)

Use the top-right profile dropdown to switch between any of the following roles to test their specific permissions:

1. **Employee (Robert Chen - EMP-1042)**: Check eligibility, apply for retirement, upload documents, test what-if pension estimates, track workflow stage, withdraw application.
2. **Reporting Officer / HOD (Marcus Vance)**: Review service particulars, recommend application to HR scrutiny, or return with remarks.
3. **HR Officer (Sarah Jenkins)**: Scrutinise service records, verify documents, flag discrepancies, advance to No-Dues clearance.
4. **Department Nodal Officer (David Ross)**: Manage the 5-department clearance matrix, record outstanding recovery amounts or clear dues.
5. **Accounts / Finance Officer (Elena Rostova)**: Verify pension and gratuity calculations, record mandatory adjustment justifications, certify financial exit figures.
6. **Competent Authority (Dr. William Sterling - Director)**: Issue final sanction order with cryptographic e-Sign stamp and QR code.
7. **Pensioner (Arthur Pendelton - Retd.)**: Access pensioner hub, submit annual digital life certificates, download monthly pension slips, raise grievances.
8. **System Administrator (Gausul Haque)**: Full system access, administrative overrides, rule configurations.
9. **Auditor (Patricia Hayes)**: Read-only access to records, timelines, and immutable audit logs.

---

## 🎨 Jobify UI Design System Alignment

The user interface reproduces the visual design language from the reference UI mockup:
- **Header & Browser Frame**: Mac window controls (red/yellow/green dots), URL bar, Jobify lightning/leaf logo, clean navigation links.
- **Left Sidebar**: 
  - "Filter" with "Reset" action.
  - "Sort By" radio grid (Recently, A-Z, Top Salary/Pension, Rating/Tenure).
  - "Salary / Pension Range" slider ($50k/m to $120k/m) with live amount labels.
  - Checkbox groups with custom emerald green checkboxes.
- **Hero & Search Bar**: 
  - Dual-input search bar (Title/Name + Location/Department).
  - Solid emerald green [Search] button.
- **Job Cards Grid**:
  - Entity icon, title, subtitle with applicant/review counts, bookmark button toggle.
  - Three color-coded status tags (light blue, light purple, amber/orange).
  - Description excerpt, highlighted monthly rate (`$102k/m`, `$7,455/m`), clock icon with days in progress.

---

## 📂 Project Structure

```
c:\Users\RAGAVI\OneDrive\Desktop\exp 7\
├── index.html       # Primary application entry point & semantic HTML layout
├── styles.css       # Jobify UI design system, custom CSS variables, responsive grid
├── app.js           # Core reactive engine, mock database, calculation formulas, workflow state
├── server.js        # Zero-dependency native Node.js HTTP server
├── package.json     # Project configuration and start scripts
└── README.md        # Comprehensive documentation and traceability matrix
```

---
*Developed for Experiment 7 · IEEE Std 830-1998 & ISO/IEC/IEEE 29148 Compliance*
