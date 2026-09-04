// Seed data — only used the FIRST time the site runs, to seed the rates
// table in Neon (Postgres). After that, everything here is fully editable
// from /admin/rates and lives in the database instead.

export const DEFAULT_SETTINGS = {
  gstRate: 0.05,
};

export const DEFAULT_VEHICLES = {
  sedan: {
    label: 'Sedan',
    subLabel: 'Swift Dzire, Etios, Nissan Sunny or equivalent',
    seats: 4,
    bags: 2,
    tripTypes: ['airport', 'local', 'outstation', 'oneway'],
    enquiryOnly: false,
    airport: { minKm: 35, ratePerKm: 34 },
    local: {
      packages: [
        { hrs: 4, km: 40, price: 1500 },
        { hrs: 8, km: 80, price: 2500 },
        { hrs: 12, km: 120, price: 3600 },
      ],
      extraKmRate: 20,
      extraHrRate: 200,
    },
    outstation: { minKmPerDay: 300, ratePerKm: 13, da: 400 },
    oneWay: { minKm: 150, ratePerKm: 17, da: 400 },
  },
  suv: {
    label: 'SUV',
    subLabel: 'Ertiga, Innova or equivalent',
    seats: 7,
    bags: 2,
    tripTypes: ['airport', 'local', 'outstation', 'oneway'],
    enquiryOnly: false,
    airport: { minKm: 35, ratePerKm: 50 },
    local: {
      packages: [
        { hrs: 4, km: 40, price: 2500 },
        { hrs: 8, km: 80, price: 3100 },
        { hrs: 12, km: 120, price: 4800 },
      ],
      extraKmRate: 25,
      extraHrRate: 250,
    },
    outstation: { minKmPerDay: 300, ratePerKm: 17, da: 400 },
    oneWay: { minKm: 150, ratePerKm: 22, da: 400 },
  },
  crysta: {
    label: 'Innova Crysta',
    subLabel: 'Premium 7-seater',
    seats: 7,
    bags: 3,
    tripTypes: ['airport', 'local', 'outstation', 'oneway'],
    enquiryOnly: false,
    airport: { minKm: 35, ratePerKm: 63 },
    local: {
      packages: [
        { hrs: 8, km: 80, price: 4000 },
        { hrs: 12, km: 120, price: 6000 },
      ],
      extraKmRate: 30,
      extraHrRate: 300,
    },
    outstation: { minKmPerDay: 300, ratePerKm: 22, da: 500 },
    oneWay: { minKm: 150, ratePerKm: 30, da: 400 },
  },
  tt_ac: {
    label: 'Tempo Traveller — Non AC',
    subLabel: '12–17 seater, Non AC',
    seats: 12,
    // No `bags` set intentionally — bags facility is skipped for Tempo Traveller.
    tripTypes: ['airport', 'local', 'outstation'],
    enquiryOnly: false,
    airport: { flat: 4900, minKm: 35 },
    local: {
      packages: [{ hrs: 8, km: 80, price: 5600 }],
      extraKmRate: 30,
      extraHrRate: 300,
    },
    outstation: { minKmPerDay: 300, ratePerKm: 22, da: 500 },
  },
  tt_non_ac: {
    label: 'Tempo Traveller — AC',
    subLabel: '12–17 seater, AC',
    seats: 12,
    // No `bags` set intentionally — bags facility is skipped for Tempo Traveller.
    tripTypes: ['airport', 'local', 'outstation'],
    enquiryOnly: false,
    airport: { flat: 5600, minKm: 35 },
    local: {
      packages: [{ hrs: 8, km: 80, price: 4900 }],
      extraKmRate: 30,
      extraHrRate: 300,
    },
    outstation: { minKmPerDay: 300, ratePerKm: 25, da: 500 },
  },
  mini_bus_21_ac: { label: 'Mini Bus 21 Seater — AC', subLabel: 'Group travel', seats: 21, tripTypes: ['group'], enquiryOnly: true },
  mini_bus_21_non_ac: { label: 'Mini Bus 21 Seater — Non AC', subLabel: 'Group travel', seats: 21, tripTypes: ['group'], enquiryOnly: true },
  mini_bus_33_ac: { label: 'Mini Bus 33 Seater — AC', subLabel: 'Group travel', seats: 33, tripTypes: ['group'], enquiryOnly: true },
  mini_bus_33_non_ac: { label: 'Mini Bus 33 Seater — Non AC', subLabel: 'Group travel', seats: 33, tripTypes: ['group'], enquiryOnly: true },
  bus_50_ac: { label: 'Bus 50 Seater — AC', subLabel: 'Group travel', seats: 50, tripTypes: ['group'], enquiryOnly: true },
  bus_50_non_ac: { label: 'Bus 50 Seater — Non AC', subLabel: 'Group travel', seats: 50, tripTypes: ['group'], enquiryOnly: true },
};