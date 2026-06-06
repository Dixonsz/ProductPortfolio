import PropTypes from "prop-types";

const VARIANTS = {
  primary:
    "bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary/30",
  secondary:
    "bg-surface-container text-on-surface hover:bg-surface-container-high focus-visible:ring-outline/30",
  danger:
    "bg-error-container text-on-error-container hover:bg-error-container/80 focus-visible:ring-error/30",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-primary focus-visible:ring-outline/30",
};

function Button({
  children,
  text,
  variant = "primary",
  type = "button",
  icon,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2 text-label-sm font-semibold uppercase tracking-widest transition-all duration-200 focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
          {icon}
        </span>
      )}
      {children ?? text}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "ghost"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  icon: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
