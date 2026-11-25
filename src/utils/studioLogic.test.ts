import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppBookingUrl,
  formatServicePrice,
  formatServiceDuration,
  filterWorksByCategory,
  studioWhatsAppUrl,
  validateBookingInput,
} from './studioLogic';
import { BOOKING_ADDONS, STUDIO_SERVICES, STUDIO_WORKS } from '../data/studioData';

test('filterWorksByCategory filters by category and search query accurately', () => {
  const all = filterWorksByCategory(STUDIO_WORKS, 'Todos');
  assert.equal(all.length, STUDIO_WORKS.length);

  const brows = filterWorksByCategory(STUDIO_WORKS, 'Sobrancelhas');
  assert.deepEqual(brows.map(work => work.id), ['design', 'henna']);
  assert.deepEqual(filterWorksByCategory(STUDIO_WORKS, 'Cílios', 'fox').map(work => work.id), ['fox']);
});

test('validateBookingInput rejects empty/invalid fields and accepts valid input', () => {
  const invalid = validateBookingInput({
    clientName: ' ',
    whatsapp: '123',
    serviceId: '',
    preferredPeriod: '',
    preferredDate: '',
    notes: '',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.clientName);
  assert.ok(invalid.errors.whatsapp);
  assert.ok(invalid.errors.serviceId);
  assert.ok(invalid.errors.preferredPeriod);
  assert.ok(invalid.errors.preferredDate);

  const valid = validateBookingInput({
    clientName: 'Ana Paula Silva',
    whatsapp: '(27) 99812-3456',
    serviceId: 'srv-hibrido',
    preferredPeriod: 'Tarde (13h30–18h)',
    preferredDate: '2026-11-25',
    notes: 'Prefiro curvatura C',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('booking message encodes the selected price and duration', () => {
  const service = STUDIO_SERVICES[0];
  const url = buildWhatsAppBookingUrl(
    {
      clientName: 'Beatriz Souza',
      whatsapp: '27999887766',
      serviceId: service.id,
      preferredPeriod: 'Manhã (08h30–12h)',
      preferredDate: '2026-11-28',
      notes: 'Preço & horário? + à tarde',
    },
    service,
    [BOOKING_ADDONS[0]],
  );
  assert.equal(studioWhatsAppUrl, 'https://wa.me/5527999202100');
  const destination = new URL(url);
  assert.equal(destination.origin + destination.pathname, studioWhatsAppUrl);
  const decoded = destination.searchParams.get('text') ?? '';
  assert.deepEqual([...destination.searchParams.keys()], ['text']);
  assert.ok(decoded.includes('Preço & horário? + à tarde'));
  assert.ok(decoded.includes('Beatriz Souza'));
  assert.ok(decoded.includes(service.name));
  assert.ok(decoded.includes('Incluir Design personalizado no mesmo atendimento'));
  assert.ok(decoded.includes(formatServicePrice(service)));
  assert.ok(decoded.includes(formatServiceDuration(service)));
  assert.ok(decoded.includes('sujeita à disponibilidade'));
});

test('catalog preserves every confirmed price and duration without merging variants', () => {
  const expected = [
    ['Egípcio',14500,120], ['Brasileiro',14500,120], ['Híbrido',14500,120],
    ['Volume egípcio',15500,120], ['Volume brasileiro',15500,120], ['Volume híbrido',15500,120],
    ['Fox Eyes',16000,120], ['Fio a fio',14000,120], ['Efeito rímel',14500,120],
    ['Efeito wispy',17000,120], ['Volume com fans',18000,120],
    ['Efeito anime',17000,120], ['Manutenção',12000,90],
    ['Manutenção de wispy e volume com fans',15000,90],
    ['Design personalizado com henna',4000,60], ['Design simples',3000,30],
    ['Epilação de buço',1000,15], ['Spa dos lábios',1500,20],
  ];
  assert.deepEqual(STUDIO_SERVICES.filter(s => s.priceCents !== null).map(s =>
    [s.name, s.priceCents, s.durationMinutes]), expected);
  assert.equal(new Set(STUDIO_SERVICES.map(s => s.id)).size, STUDIO_SERVICES.length);
  assert.equal(STUDIO_WORKS.length, 7);
  for (const name of ['Design personalizado', 'Volume brown']) {
    const service = STUDIO_SERVICES.find(s => s.name === name)!;
    assert.equal(service.priceCents, null);
    assert.equal(service.durationMinutes, null);
    assert.equal(formatServicePrice(service), 'Sob consulta');
    assert.equal(formatServiceDuration(service), 'Duração sob consulta');
  }
  assert.ok(!STUDIO_SERVICES.some(s => /lamination/i.test(s.name)));
});

test('multiple procedures keep distinct services and calculate only confirmed amounts', async () => {
  const { summarizeBookingServices } = await import('./studioLogic');
  const fox = STUDIO_SERVICES.find(service => service.id === 'srv-fox')!;
  const simple = STUDIO_SERVICES.find(service => service.id === 'srv-design-simples')!;
  const brown = STUDIO_SERVICES.find(service => service.id === 'srv-brown')!;
  const summary = summarizeBookingServices([fox, simple, fox]);
  assert.equal(summary.services.length, 2);
  assert.match(summary.priceLabel, /190,00/);
  assert.equal(summary.durationLabel, '150 minutos');
  const partial = summarizeBookingServices([fox, brown]);
  assert.match(partial.priceLabel, /160,00 \+ itens sob consulta/);
  assert.match(partial.durationLabel, /120 minutos \+ itens sob consulta/);
  assert.equal(summarizeBookingServices([brown]).priceLabel, 'Sob consulta');
  const url = buildWhatsAppBookingUrl({ clientName: 'Ana Paula', whatsapp: '27999887766', serviceId: fox.id,
    preferredPeriod: 'Tarde (13h30–18h)', preferredDate: '2026-12-01', notes: '' }, [fox, simple], []);
  const message = new URL(url).searchParams.get('text')!;
  assert.match(message, /Fox Eyes, Design simples/);
  assert.match(message, /190,00/);
  assert.match(message, /150 minutos/);
  assert.match(message, /tempo total serão confirmados/);
});
