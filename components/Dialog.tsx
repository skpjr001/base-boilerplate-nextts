import * as DialogPrimitive from "@radix-ui/react-dialog";
import React, { ReactNode } from "react";

export type DialogProps = React.ComponentProps<typeof DialogPrimitive["Root"]>;
export function Dialog(props: DialogProps) {
  const { children, ...other } = props;
  return (
    <DialogPrimitive.Root {...other}>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      {children}
    </DialogPrimitive.Root>
  );
}
type DialogContentProps = React.ComponentProps<typeof DialogPrimitive["Content"]>;

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, ...props }, forwardedRef) => (
    <DialogPrimitive.Content
      {...props}
      className="min-w-[360px] fixed left-1/2 top-1/2 p-6 text-left bg-white rounded shadow-xl overflow-hidden -translate-x-1/2 -translate-y-1/2 sm:align-middle sm:w-full sm:max-w-lg"
      ref={forwardedRef}>
      {children}
    </DialogPrimitive.Content>
  )
);

type DialogHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
};

export function DialogHeader(props: DialogHeaderProps) {
  return (
    <div className="mb-8">
      <h3 className="font-cal text-gray-900 text-lg font-bold leading-6" id="modal-title">
        {props.title}
      </h3>
      {props.subtitle && <div className="text-gray-400 text-sm">{props.subtitle}</div>}
    </div>
  );
}

export function DialogFooter(props: { children: ReactNode }) {
  return (
    <div>
      <div className="mt-5 flex space-x-2 justify-end">{props.children}</div>
    </div>
  );
}

DialogContent.displayName = "DialogContent";

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
