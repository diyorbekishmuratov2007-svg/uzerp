import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';

// Phase 1: Core Accounting (MVP)
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { JournalModule } from './modules/journal/journal.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CounterpartiesModule } from './modules/counterparties/counterparties.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SettingsModule } from './modules/settings/settings.module';
import { CaslModule } from './modules/casl/casl.module';

// Phase 2: Tax & Compliance
import { TaxModule } from './modules/tax/tax.module';
import { VatModule } from './modules/vat/vat.module';
import { ProfitTaxModule } from './modules/profit-tax/profit-tax.module';
import { DidoxModule } from './modules/didox/didox.module';
import { InpsModule } from './modules/inps/inps.module';
import { NdflModule } from './modules/ndfl/ndfl.module';
import { SoliqModule } from './modules/soliq/soliq.module';
import { InvoicesModule } from './modules/invoices/invoices.module';

// Phase 3: HR & Payroll
import { EmployeesModule } from './modules/employees/employees.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { TimesheetModule } from './modules/timesheet/timesheet.module';
import { HrDocumentsModule } from './modules/hr-documents/hr-documents.module';

// Phase 4: Warehouse & Trade
import { ProductsModule } from './modules/products/products.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { SalesModule } from './modules/sales/sales.module';
import { RawMaterialsModule } from './modules/raw-materials/raw-materials.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ReceivablesModule } from './modules/receivables/receivables.module';

// Phase 5: Bank & Payments
import { BankStatementsModule } from './modules/bank-statements/bank-statements.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PaymentCalendarModule } from './modules/payment-calendar/payment-calendar.module';
import { CashModule } from './modules/cash/cash.module';

// Phase 6: Reports & Analysis
import { FinancialReportsModule } from './modules/financial-reports/financial-reports.module';
import { CashFlowModule } from './modules/cash-flow/cash-flow.module';
import { KpiModule } from './modules/kpi/kpi.module';
import { DepreciationModule } from './modules/depreciation/depreciation.module';
import { ConsolidationModule } from './modules/consolidation/consolidation.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { ExportModule } from './modules/export/export.module';

// Phase 7: Mobile & AI
import { MobileApiModule } from './modules/mobile-api/mobile-api.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiPostingModule } from './modules/ai-posting/ai-posting.module';
import { CashflowForecastModule } from './modules/cashflow-forecast/cashflow-forecast.module';
import { FraudDetectionModule } from './modules/fraud-detection/fraud-detection.module';

// Phase 8: Localization
import { LocalizationModule } from './modules/localization/localization.module';

// Phase 9: Security & Enterprise
import { AuditTrailModule } from './modules/audit-trail/audit-trail.module';
import { SecurityModule } from './modules/security/security.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    PrismaModule,

    // Health Check
    HealthModule,

    // Phase 1: Core Accounting (MVP)
    AuthModule,
    UsersModule,
    OrganizationsModule,
    AccountsModule,
    JournalModule,
    TransactionsModule,
    BalanceModule,
    CounterpartiesModule,
    DashboardModule,
    SettingsModule,
    CaslModule,

    // Phase 2: Tax & Compliance
    TaxModule,
    VatModule,
    ProfitTaxModule,
    DidoxModule,
    InpsModule,
    NdflModule,
    SoliqModule,
    InvoicesModule,

    // Phase 3: HR & Payroll
    EmployeesModule,
    DepartmentsModule,
    PayrollModule,
    TimesheetModule,
    HrDocumentsModule,

    // Phase 4: Warehouse & Trade
    ProductsModule,
    WarehouseModule,
    SalesModule,
    RawMaterialsModule,
    InventoryModule,
    ContractsModule,
    ReceivablesModule,

    // Phase 5: Bank & Payments
    BankStatementsModule,
    PaymentsModule,
    PaymentCalendarModule,
    CashModule,

    // Phase 6: Reports & Analysis
    FinancialReportsModule,
    CashFlowModule,
    KpiModule,
    DepreciationModule,
    ConsolidationModule,
    CurrencyModule,
    ExportModule,

    // Phase 7: Mobile & AI
    MobileApiModule,
    NotificationsModule,
    AiPostingModule,
    CashflowForecastModule,
    FraudDetectionModule,

    // Phase 8: Localization
    LocalizationModule,

    // Phase 9: Security & Enterprise
    AuditTrailModule,
    SecurityModule,
  ],
})
export class AppModule {}
