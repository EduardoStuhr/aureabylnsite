import { useState } from 'react';
import { BookingModal } from './components/BookingModal';
import { ClientsShowcase } from './components/ClientsShowcase';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InstagramArchive } from './components/InstagramArchive';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ServicesAndAcademy } from './components/ServicesAndAcademy';
import { STUDIO_SERVICES } from './data/studioData';

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState(STUDIO_SERVICES[0].id);
  const [mobileSection, setMobileSection] = useState<'inicio' | 'clientes' | 'servicos'>(
    'inicio',
  );

  const openBookingWithService = (serviceId?: string) => {
    setBookingServiceId(serviceId ?? STUDIO_SERVICES[0].id);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141210]">
      <Header onOpenBooking={() => openBookingWithService()} />

      <main>
        <HeroSection onOpenBooking={() => openBookingWithService()} />
        <ClientsShowcase />
        <ServicesAndAcademy onSelectService={(id) => openBookingWithService(id)} />
        <InstagramArchive />
      </main>

      <Footer onOpenBooking={() => openBookingWithService()} />

      <MobileBottomNav
        activeSection={mobileSection}
        onNavigate={setMobileSection}
        onOpenBooking={() => openBookingWithService()}
      />

      <BookingModal
        isOpen={bookingOpen}
        initialServiceId={bookingServiceId}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
