import { useState, ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const AskQuestionDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Вопрос отправлен',
      description: 'Мы свяжемся с вами в ближайшее время.',
    });
    setEmail('');
    setPhone('');
    setComment('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Задать вопрос</DialogTitle>
          <DialogDescription>
            Оставьте контакты — подскажем формат под ваш возраст, компанию и повод.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ask-email">Email</Label>
            <Input
              id="ask-email"
              type="email"
              placeholder="you@mail.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ask-phone">Телефон</Label>
            <Input
              id="ask-phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ask-comment">Комментарий</Label>
            <Textarea
              id="ask-comment"
              placeholder="Расскажите, что вас интересует"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full">
            <Icon name="Send" size={18} className="mr-2" /> Отправить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestionDialog;
