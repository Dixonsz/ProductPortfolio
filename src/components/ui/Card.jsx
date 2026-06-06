import PropTypes from "prop-types";

const TONES = {
  default: "bg-surface-container-lowest border-outline-variant/30",
  muted: "bg-surface-container-low border-outline-variant/30",
  accent: "bg-secondary-fixed/40 border-outline-variant/20",
};

function Card({ children, tone = "default", className = "" }) {
  return (
    <section className={`rounded-xl border p-6 ${TONES[tone]} ${className}`}>
      {children}
    </section>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  tone: PropTypes.oneOf(["default", "muted", "accent"]),
  className: PropTypes.string,
};

export default Card;
