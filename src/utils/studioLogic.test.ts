import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppBookingUrl,
  calculateBookingSummary,
  filterClientsByCategory,
  formatBRL,
  formatDuration,
  validateBookingInput,
} from './studioLogic';
import { BOOKING_ADDONS, CLIENT_SHOWCASE, STUDIO_SERVICES } from '../data/studioData';

test('filterClientsByCategory filters by category and search query accurately', () => {
  const all = filterClientsByCategory(CLIENT_SHOWCASE, 'Todos');
  assert.equal(all.length, CLIENT_SHOWCASE.length);

  const foxOnly = filterClientsByCategory(CLIENT_SHOWCASE, 'Fox Eyes');
  assert.ok(foxOnly.length > 0);
  assert.ok(foxOnly.every((c) => c.category === 'Fox Eyes'));

  const camila = filterClientsByCategory(CLIENT_SHOWCASE, 'Todos', 'camila');
  assert.equal(camila.length, 1);
  assert.equal(camila[0].clientName, 'Camila Ferreira');
});

test('calculateBookingSummary computes price and duration including add-ons', () => {
  const service = STUDIO_SERVICES.find((s) => s.id === 'srv-volume-brasileiro');
  assert.ok(service);
  const summary = calculateBookingSummary(service, [BOOKING_ADDONS[0], BOOKING_ADDONS[1]]);
  assert.equal(summary.totalBRL, 165 + 40 + 25);
  assert.equal(summary.totalMinutes, 120 + 30 + 0);
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
    serviceId: 'srv-volume-brasileiro',
    preferredPeriod: 'Tarde (13h30–18h)',
    preferredDate: '2026-11-25',
    notes: 'Prefiro curvatura C',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('buildWhatsAppBookingUrl encodes studio booking message cleanly', () => {
  const service = STUDIO_SERVICES[0];
  const url = buildWhatsAppBookingUrl(
    '5527999990000',
    {
      clientName: 'Beatriz Souza',
      whatsapp: '27999887766',
      serviceId: service.id,
      preferredPeriod: 'Manhã (08h30–12h)',
      preferredDate: '2026-11-28',
      notes: '',
    },
    service,
    [BOOKING_ADDONS[0]],
  );
  assert.ok(url.startsWith('https://wa.me/5527999990000?text='));
  const decoded = decodeURIComponent(url.split('?text=')[1]);
  assert.ok(decoded.includes('Beatriz Souza'));
  assert.ok(decoded.includes(service.name));
  assert.ok(decoded.includes('Combo Design de Sobrancelhas'));
});

test('formatBRL and formatDuration produce clean Portuguese formatting', () => {
  assert.match(formatBRL(165), /R\$\s*165,00/);
  assert.equal(formatDuration(120), '2h');
  assert.equal(formatDuration(135), '2h 15min');
  assert.equal(formatDuration(45), '45 min');
});
