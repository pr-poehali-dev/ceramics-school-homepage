import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import AskQuestionDialog from '@/components/AskQuestionDialog';

const FormatsCta = () => {
  return (
    <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
      <Icon name="MessageCircle" size={200} className="pointer-events-none absolute opacity-0" />
      <h3 className="font-display text-3xl font-semibold md:text-4xl">
        Не нашли подходящий формат?
      </h3>
      <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
        Напишите — подберём индивидуальный вариант под вашу группу, повод и бюджет.
      </p>
      <AskQuestionDialog>
        <Button size="lg" variant="secondary" className="mt-7 rounded-full px-8">
          <Icon name="Send" size={18} className="mr-2" /> Написать нам
        </Button>
      </AskQuestionDialog>
    </div>
  );
};

export default FormatsCta;