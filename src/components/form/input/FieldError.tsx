type FieldErrorProps = {
  message?: string | null;
};

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return <p className="mt-1 text-[11px] text-rose-600">{message}</p>;
}
