import clsx from "clsx";

export const IconBadge = ({ icon: Icon, variant = "default", size = "default" }) => {
  const backgroundClasses = clsx(
    "rounded-full flex items-center justify-center",
    {
      "bg-sky-100": variant === "default",
      "bg-emerald-100": variant === "success",
      "p-2": size === "default",
      "p-1": size === "sm",
    }
  );

  const iconClasses = clsx(
    {
      "text-sky-700": variant === "default",
      "text-emerald-700": variant === "success",
      "h-8 w-8": size === "default",
      "h-4 w-4": size === "sm",
    }
  );

  return (
    <div className={backgroundClasses}>
      <Icon className={iconClasses} />
    </div>
  );
};
