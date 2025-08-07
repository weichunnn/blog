export default function Header({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return <h1 className={`text-lg mb-2 font-medium ${className}`}>{title}</h1>;
}
