import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { type ComponentProps, useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { COMMON } from '@/shared/lib/strings';
import { cn } from '@/shared/lib/utils';

type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-r-3xl"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? COMMON.hidePassword : COMMON.showPassword}
        aria-pressed={visible}
      >
        <HugeiconsIcon icon={visible ? ViewOffIcon : ViewIcon} className="size-4" />
      </button>
    </div>
  );
}
