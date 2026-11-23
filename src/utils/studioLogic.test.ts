import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppBookingUrl,
  filterWorksByCategory,
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
    serviceId: 'srv-volume-brasileiro',
    preferredPeriod: 'Tarde (13h30–18h)',
    preferredDate: '2026-11-25',
    notes: 'Prefiro curvatura C',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('buildWhatsAppBookingUrl encodes consultation message cleanly without fictional prices', () => {
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
  assert.ok(decoded.includes('Incluir Design de Sobrancelhas no mesmo atendimento'));
  assert.ok(!decoded.includes('R$'));
});
