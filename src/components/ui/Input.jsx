import propTypes from "prop-types";

function Input({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input"
    />
  );
}

Input.propTypes = {
  type: propTypes.string,
  placeholder: propTypes.string,
  value: propTypes.string.OneOfType([propTypes.string, propTypes.number]),
  onChange: propTypes.func,
};

export default Input;
