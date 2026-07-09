import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { YCLIENTS_URL, BOOKING_EVENT_NAME } from '@/lib/booking';

const BookingDrawer = () => {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handler = () => {
      setLoaded(true);
      setOpen(true);
    };
    window.addEventListener(BOOKING_EVENT_NAME, handler);
    return () => window.removeEventListener(BOOKING_EVENT_NAME, handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* PANEL */}
      <aside
        className={`fixed right-0 top-0 z-[140] flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="flex items-center gap-2 font-display text-lg font-semibold">
            <Icon name="CalendarCheck" size={20} className="text-primary" /> Онлайн-запись
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="relative flex-1">
          {loaded && (
            <iframe
              src={YCLIENTS_URL}
              title="Онлайн-запись Дымов Керамика"
              className="h-full w-full border-0"
              allow="payment; clipboard-write"
            />
          )}
        </div>
      </aside>
    </>
  );
};

export default BookingDrawer;
