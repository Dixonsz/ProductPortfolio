import PropTypes from "prop-types";

function ComboBox({
  id,
  label,
  options,
  register,
  error,
  placeholder,
  value,
  onChange,
  disabled = false,
}) {
  const fieldError = typeof error === "string" ? error : error?.message;
  const registerProps = register ? register(id) : {};

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant"
      >
        {label}
      </label>
      <select
        id={id}
        value={String(value ?? "")}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={disabled}
        className={`w-full rounded-full border bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
          fieldError ? "border-error" : "border-outline-variant/50"
        }`}
        aria-invalid={Boolean(fieldError)}
        aria-describedby={fieldError ? `${id}-error` : undefined}
        {...registerProps}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {fieldError && (
        <p id={`${id}-error`} className="text-label-sm font-medium text-error">
          {fieldError}
        </p>
      )}
    </div>
  );
}

ComboBox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  register: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

ComboBox.defaultProps = {
  register: null,
  error: null,
  placeholder: "",
  value: undefined,
  onChange: null,
  disabled: false,
};

export default ComboBox;
