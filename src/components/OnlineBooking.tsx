import Icon from '@/components/ui/icon';
import { openBooking } from '@/lib/booking';

const OnlineBooking = () => (
  <button
    type="button"
    onClick={openBooking}
    aria-label="Онлайн-запись"
    className="group fixed bottom-6 right-6 z-[110] flex items-center gap-2.5 rounded-full bg-primary px-5 py-3.5 font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-2xl md:px-6"
  >
    <span className="relative flex h-6 w-6 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground/40 opacity-75" />
      <Icon name="CalendarCheck" size={22} className="relative" />
    </span>
    <span className="hidden sm:inline">Онлайн-запись</span>
  </button>
);

export default OnlineBooking;