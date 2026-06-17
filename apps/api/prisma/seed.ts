import { PrismaClient, Role, AccountType, CounterpartyType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding UzERP database...');

  // ============================================================
  // 1. Organization
  // ============================================================
  const org = await prisma.organization.create({
    data: {
      name: 'UzERP Demo Kompaniya',
      inn: '123456789',
      address: 'Toshkent sh., Amir Temur ko\'chasi, 1-uy',
      phone: '+998 71 200 00 01',
      email: 'info@uzerp-demo.uz',
      bankAccount: '20208000900100001010',
      mfo: '00873',
      oked: '62010',
      director: 'Karimov Akbar Sharipovich',
      accountant: 'Rahimova Dilnoza Baxtiyorovna',
    },
  });

  console.log(`Organization created: ${org.name}`);

  // ============================================================
  // 2. Users (3: admin, accountant, viewer)
  // ============================================================
  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@uzerp.uz',
      password: hashedPassword,
      firstName: 'Akbar',
      lastName: 'Karimov',
      role: Role.ADMIN,
      organizationId: org.id,
    },
  });

  const accountant = await prisma.user.create({
    data: {
      email: 'accountant@uzerp.uz',
      password: hashedPassword,
      firstName: 'Dilnoza',
      lastName: 'Rahimova',
      role: Role.ACCOUNTANT,
      organizationId: org.id,
    },
  });

  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@uzerp.uz',
      password: hashedPassword,
      firstName: 'Sardor',
      lastName: 'Aliyev',
      role: Role.VIEWER,
      organizationId: org.id,
    },
  });

  console.log('Users created: admin, accountant, viewer');

  // ============================================================
  // 3. Chart of Accounts (BHMS - 60 accounts)
  // ============================================================
  const accounts = [
    // Class 01: Asosiy vositalar (Fixed Assets)
    { code: '0100', name: 'Asosiy vositalar', nameRu: 'Основные средства', type: AccountType.ASSET },
    { code: '0110', name: 'Yer uchastkasi', nameRu: 'Земельные участки', type: AccountType.ASSET },
    { code: '0120', name: 'Binolar', nameRu: 'Здания', type: AccountType.ASSET },
    { code: '0130', name: 'Mashinalar va uskunalar', nameRu: 'Машины и оборудование', type: AccountType.ASSET },
    { code: '0140', name: 'Transport vositalari', nameRu: 'Транспортные средства', type: AccountType.ASSET },
    { code: '0150', name: 'Kompyuter texnikasi', nameRu: 'Компьютерная техника', type: AccountType.ASSET },
    { code: '0160', name: 'Boshqa asosiy vositalar', nameRu: 'Прочие основные средства', type: AccountType.ASSET },
    // Class 02: Eskirish (Depreciation)
    { code: '0200', name: 'Asosiy vositalar eskirishi', nameRu: 'Износ основных средств', type: AccountType.ASSET },
    { code: '0211', name: 'Binolar eskirishi', nameRu: 'Износ зданий', type: AccountType.ASSET },
    { code: '0212', name: 'Mashinalar eskirishi', nameRu: 'Износ машин', type: AccountType.ASSET },
    // Class 04: Nomoddiy aktivlar (Intangible Assets)
    { code: '0400', name: 'Nomoddiy aktivlar', nameRu: 'Нематериальные активы', type: AccountType.ASSET },
    { code: '0410', name: 'Patentlar', nameRu: 'Патенты', type: AccountType.ASSET },
    { code: '0420', name: 'Litsenziyalar', nameRu: 'Лицензии', type: AccountType.ASSET },
    // Class 06: Uzoq muddatli investitsiyalar
    { code: '0600', name: 'Uzoq muddatli investitsiyalar', nameRu: 'Долгосрочные инвестиции', type: AccountType.ASSET },
    // Class 10: Materiallar (Materials)
    { code: '1000', name: 'Materiallar', nameRu: 'Материалы', type: AccountType.ASSET },
    { code: '1010', name: 'Xom ashyo', nameRu: 'Сырье и материалы', type: AccountType.ASSET },
    { code: '1020', name: 'Yoqilg\'i', nameRu: 'Топливо', type: AccountType.ASSET },
    { code: '1030', name: 'Ehtiyot qismlar', nameRu: 'Запасные части', type: AccountType.ASSET },
    { code: '1040', name: 'Qurilish materiallari', nameRu: 'Строительные материалы', type: AccountType.ASSET },
    { code: '1050', name: 'Inventar va xo\'jalik jihozlari', nameRu: 'Инвентарь и хоз. принадлежности', type: AccountType.ASSET },
    // Class 28: Tayyor mahsulot (Finished goods)
    { code: '2800', name: 'Tayyor mahsulot', nameRu: 'Готовая продукция', type: AccountType.ASSET },
    { code: '2810', name: 'Tayyor mahsulot omborida', nameRu: 'Готовая продукция на складе', type: AccountType.ASSET },
    { code: '2900', name: 'Tovarlar', nameRu: 'Товары', type: AccountType.ASSET },
    // Class 40: Pul mablag\'lari (Cash)
    { code: '5000', name: 'Hisob-kitob schyoti', nameRu: 'Расчетный счет', type: AccountType.ASSET },
    { code: '5010', name: 'Milliy valyutada hisob-kitob', nameRu: 'Расчетный счет в нац. валюте', type: AccountType.ASSET },
    { code: '5020', name: 'Chet el valyutasi schyoti', nameRu: 'Валютный счет', type: AccountType.ASSET },
    { code: '5100', name: 'Kassa', nameRu: 'Касса', type: AccountType.ASSET },
    { code: '5110', name: 'Milliy valyutada kassa', nameRu: 'Касса в нац. валюте', type: AccountType.ASSET },
    // Class 40: Debitorlar (Receivables)
    { code: '4000', name: 'Debitorlik qarzlari', nameRu: 'Дебиторская задолженность', type: AccountType.ASSET },
    { code: '4010', name: 'Xaridorlar va buyurtmachilar', nameRu: 'Покупатели и заказчики', type: AccountType.ASSET },
    { code: '4020', name: 'Berilgan avanslar', nameRu: 'Авансы выданные', type: AccountType.ASSET },
    { code: '4030', name: 'Xodimlarga berilgan avanslar', nameRu: 'Авансы сотрудникам', type: AccountType.ASSET },
    // Class 60: Kreditorlar (Payables) - Liabilities
    { code: '6000', name: 'Kreditorlik qarzlari', nameRu: 'Кредиторская задолженность', type: AccountType.LIABILITY },
    { code: '6010', name: 'Yetkazib beruvchilar', nameRu: 'Поставщики и подрядчики', type: AccountType.LIABILITY },
    { code: '6020', name: 'Olingan avanslar', nameRu: 'Авансы полученные', type: AccountType.LIABILITY },
    { code: '6030', name: 'Byudjetga to\'lovlar', nameRu: 'Расчеты с бюджетом', type: AccountType.LIABILITY },
    { code: '6040', name: 'Ijtimoiy sug\'urta bo\'yicha', nameRu: 'Расчеты по соц. страхованию', type: AccountType.LIABILITY },
    { code: '6050', name: 'Mehnat haqi bo\'yicha', nameRu: 'Расчеты по оплате труда', type: AccountType.LIABILITY },
    { code: '6060', name: 'Ta\'sischilar bilan hisob-kitoblar', nameRu: 'Расчеты с учредителями', type: AccountType.LIABILITY },
    { code: '6070', name: 'Qisqa muddatli kreditlar', nameRu: 'Краткосрочные кредиты', type: AccountType.LIABILITY },
    { code: '6080', name: 'Uzoq muddatli kreditlar', nameRu: 'Долгосрочные кредиты', type: AccountType.LIABILITY },
    // Class 80: Ustav kapitali (Equity)
    { code: '8000', name: 'Ustav kapitali', nameRu: 'Уставный капитал', type: AccountType.EQUITY },
    { code: '8100', name: 'Qo\'shilgan kapital', nameRu: 'Добавленный капитал', type: AccountType.EQUITY },
    { code: '8200', name: 'Rezerv kapitali', nameRu: 'Резервный капитал', type: AccountType.EQUITY },
    { code: '8300', name: 'Taqsimlanmagan foyda', nameRu: 'Нераспределенная прибыль', type: AccountType.EQUITY },
    // Class 90: Daromadlar (Income)
    { code: '9000', name: 'Asosiy faoliyatdan daromadlar', nameRu: 'Доходы от основной деятельности', type: AccountType.INCOME },
    { code: '9010', name: 'Sotishdan tushum', nameRu: 'Выручка от реализации', type: AccountType.INCOME },
    { code: '9020', name: 'Xizmatlardan daromad', nameRu: 'Доходы от услуг', type: AccountType.INCOME },
    { code: '9100', name: 'Boshqa operatsion daromadlar', nameRu: 'Прочие операционные доходы', type: AccountType.INCOME },
    { code: '9200', name: 'Moliyaviy daromadlar', nameRu: 'Финансовые доходы', type: AccountType.INCOME },
    { code: '9300', name: 'Favqulodda daromadlar', nameRu: 'Чрезвычайные доходы', type: AccountType.INCOME },
    // Class 90: Xarajatlar (Expenses)
    { code: '9400', name: 'Sotilgan mahsulot tannarxi', nameRu: 'Себестоимость реализации', type: AccountType.EXPENSE },
    { code: '9410', name: 'Ishlab chiqarish xarajatlari', nameRu: 'Производственные затраты', type: AccountType.EXPENSE },
    { code: '9420', name: 'Xom ashyo xarajatlari', nameRu: 'Расходы на сырье', type: AccountType.EXPENSE },
    { code: '9430', name: 'Mehnat haqi xarajatlari', nameRu: 'Расходы на оплату труда', type: AccountType.EXPENSE },
    { code: '9500', name: 'Davr xarajatlari', nameRu: 'Расходы периода', type: AccountType.EXPENSE },
    { code: '9510', name: 'Sotish xarajatlari', nameRu: 'Расходы на реализацию', type: AccountType.EXPENSE },
    { code: '9520', name: 'Ma\'muriy xarajatlar', nameRu: 'Административные расходы', type: AccountType.EXPENSE },
    { code: '9530', name: 'Operatsion xarajatlar', nameRu: 'Операционные расходы', type: AccountType.EXPENSE },
    { code: '9600', name: 'Moliyaviy xarajatlar', nameRu: 'Финансовые расходы', type: AccountType.EXPENSE },
    { code: '9900', name: 'Foyda solig\'i', nameRu: 'Налог на прибыль', type: AccountType.EXPENSE },
  ];

  for (const account of accounts) {
    await prisma.account.create({
      data: {
        ...account,
        organizationId: org.id,
      },
    });
  }

  console.log(`Accounts created: ${accounts.length} BHMS accounts`);

  // ============================================================
  // 4. Counterparties (10)
  // ============================================================
  const counterparties = [
    { name: 'Texnodom OOO', type: CounterpartyType.SUPPLIER, inn: '301234567', phone: '+998 71 200 10 10' },
    { name: 'Artel Electronics', type: CounterpartyType.SUPPLIER, inn: '301234568', phone: '+998 71 200 10 11' },
    { name: 'Coca-Cola Ichimliklari Uzbekiston', type: CounterpartyType.SUPPLIER, inn: '301234569', phone: '+998 71 200 10 12' },
    { name: 'Hamkorbank ATB', type: CounterpartyType.OTHER, inn: '201234567', phone: '+998 71 200 20 20' },
    { name: 'Ipoteka Bank ATB', type: CounterpartyType.OTHER, inn: '201234568', phone: '+998 71 200 20 21' },
    { name: 'Navoiy Kon-Metallurgiya Kombinati', type: CounterpartyType.CLIENT, inn: '401234567', phone: '+998 79 200 30 30' },
    { name: 'Uzbekiston Temir Yo\'llari', type: CounterpartyType.CLIENT, inn: '401234568', phone: '+998 71 200 30 31' },
    { name: 'UzAuto Motors', type: CounterpartyType.CLIENT, inn: '401234569', phone: '+998 71 200 30 32' },
    { name: 'Beeline Uzbekistan', type: CounterpartyType.SUPPLIER, inn: '301234570', phone: '+998 71 200 40 40' },
    { name: 'Uztelecom AK', type: CounterpartyType.SUPPLIER, inn: '301234571', phone: '+998 71 200 40 41' },
  ];

  for (const cp of counterparties) {
    await prisma.counterparty.create({
      data: {
        ...cp,
        organizationId: org.id,
      },
    });
  }

  console.log('Counterparties created: 10');

  // ============================================================
  // 5. Departments (5)
  // ============================================================
  const departments = [
    { name: 'Boshqaruv', code: 'MGT' },
    { name: 'Buxgalteriya', code: 'ACC' },
    { name: 'Sotish bo\'limi', code: 'SALES' },
    { name: 'IT bo\'limi', code: 'IT' },
    { name: 'Ombor', code: 'WH' },
  ];

  const createdDepts: any[] = [];
  for (const dept of departments) {
    const d = await prisma.department.create({
      data: {
        ...dept,
        organizationId: org.id,
      },
    });
    createdDepts.push(d);
  }

  console.log('Departments created: 5');

  // ============================================================
  // 6. Positions and Employees (7)
  // ============================================================
  const positions = [
    { name: 'Direktor', departmentId: createdDepts[0].id },
    { name: 'Bosh hisobchi', departmentId: createdDepts[1].id },
    { name: 'Hisobchi', departmentId: createdDepts[1].id },
    { name: 'Sotuv menejeri', departmentId: createdDepts[2].id },
    { name: 'Dasturchi', departmentId: createdDepts[3].id },
    { name: 'Omborchi', departmentId: createdDepts[4].id },
  ];

  const createdPositions: any[] = [];
  for (const pos of positions) {
    const p = await prisma.position.create({
      data: {
        ...pos,
        organizationId: org.id,
      },
    });
    createdPositions.push(p);
  }

  const employees = [
    { tabNumber: '001', firstName: 'Akbar', lastName: 'Karimov', hireDate: new Date('2020-01-15'), baseSalary: 15000000, departmentId: createdDepts[0].id, positionId: createdPositions[0].id },
    { tabNumber: '002', firstName: 'Dilnoza', lastName: 'Rahimova', hireDate: new Date('2020-02-01'), baseSalary: 12000000, departmentId: createdDepts[1].id, positionId: createdPositions[1].id },
    { tabNumber: '003', firstName: 'Sardor', lastName: 'Aliyev', hireDate: new Date('2021-03-10'), baseSalary: 8000000, departmentId: createdDepts[1].id, positionId: createdPositions[2].id },
    { tabNumber: '004', firstName: 'Javlon', lastName: 'Tursunov', hireDate: new Date('2021-06-15'), baseSalary: 9000000, departmentId: createdDepts[2].id, positionId: createdPositions[3].id },
    { tabNumber: '005', firstName: 'Nodira', lastName: 'Xasanova', hireDate: new Date('2022-01-10'), baseSalary: 10000000, departmentId: createdDepts[3].id, positionId: createdPositions[4].id },
    { tabNumber: '006', firstName: 'Ulug\'bek', lastName: 'Mirzayev', hireDate: new Date('2022-04-01'), baseSalary: 7000000, departmentId: createdDepts[4].id, positionId: createdPositions[5].id },
    { tabNumber: '007', firstName: 'Zilola', lastName: 'Abdullayeva', hireDate: new Date('2023-01-15'), baseSalary: 8500000, departmentId: createdDepts[2].id, positionId: createdPositions[3].id },
  ];

  for (const emp of employees) {
    await prisma.employee.create({
      data: {
        ...emp,
        organizationId: org.id,
      },
    });
  }

  console.log('Employees created: 7');

  // ============================================================
  // 7. Products (12)
  // ============================================================
  const products = [
    { name: 'Noutbuk HP ProBook 450', sku: 'NB-001', salePrice: 8500000, purchasePrice: 7200000 },
    { name: 'Monitor Samsung 27"', sku: 'MN-001', salePrice: 3200000, purchasePrice: 2700000 },
    { name: 'Klaviatura Logitech K380', sku: 'KB-001', salePrice: 450000, purchasePrice: 350000 },
    { name: 'Sichqoncha Logitech M720', sku: 'MS-001', salePrice: 380000, purchasePrice: 290000 },
    { name: 'Printer HP LaserJet Pro', sku: 'PR-001', salePrice: 4200000, purchasePrice: 3500000 },
    { name: 'Router TP-Link AX1800', sku: 'RT-001', salePrice: 850000, purchasePrice: 680000 },
    { name: 'UPS APC 1500VA', sku: 'UP-001', salePrice: 2100000, purchasePrice: 1750000 },
    { name: 'SSD Samsung 1TB', sku: 'SD-001', salePrice: 1200000, purchasePrice: 950000 },
    { name: 'Web kamera Logitech C920', sku: 'WC-001', salePrice: 750000, purchasePrice: 600000 },
    { name: 'Naushnik Sony WH-1000XM5', sku: 'NH-001', salePrice: 4500000, purchasePrice: 3800000 },
    { name: 'Planshet iPad Air', sku: 'TB-001', salePrice: 9800000, purchasePrice: 8500000 },
    { name: 'Smartfon Samsung Galaxy S24', sku: 'PH-001', salePrice: 12000000, purchasePrice: 10200000 },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        organizationId: org.id,
      },
    });
  }

  console.log('Products created: 12');

  // ============================================================
  // 8. Warehouses (2)
  // ============================================================
  await prisma.warehouse.create({
    data: {
      name: 'Asosiy ombor',
      code: 'WH-01',
      address: 'Toshkent, Sergeli tumani, Sanoat ko\'chasi 5',
      responsiblePerson: 'Mirzayev Ulug\'bek',
      organizationId: org.id,
    },
  });

  await prisma.warehouse.create({
    data: {
      name: 'Yordamchi ombor',
      code: 'WH-02',
      address: 'Toshkent, Yakkasaroy tumani, Bobur ko\'chasi 12',
      responsiblePerson: 'Tursunov Javlon',
      organizationId: org.id,
    },
  });

  console.log('Warehouses created: 2');

  // ============================================================
  // 9. Bank Accounts (2)
  // ============================================================
  await prisma.bankAccount.create({
    data: {
      name: 'Asosiy hisob-raqam (UZS)',
      accountNumber: '20208000900100001010',
      bankName: 'Hamkorbank ATB',
      mfo: '00873',
      currency: 'UZS',
      balance: 125000000,
      isMain: true,
      organizationId: org.id,
    },
  });

  await prisma.bankAccount.create({
    data: {
      name: 'Valyuta hisobi (USD)',
      accountNumber: '20208000900100001020',
      bankName: 'Ipoteka Bank ATB',
      mfo: '00444',
      currency: 'USD',
      balance: 15000,
      isMain: false,
      organizationId: org.id,
    },
  });

  console.log('Bank accounts created: 2');

  // ============================================================
  console.log('\n=== Seed completed successfully! ===');
  console.log('\nDemo login credentials:');
  console.log('  Admin:      admin@uzerp.uz / password123');
  console.log('  Accountant: accountant@uzerp.uz / password123');
  console.log('  Viewer:     viewer@uzerp.uz / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
