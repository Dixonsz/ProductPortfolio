import PropTypes from "prop-types";
import { getPublicUrl } from "../../api/storage";

export default function ImageUploader({
  currentPath,
  preview,
  uploading,
  onChange,
}) {
  const displayUrl = preview ?? getPublicUrl(currentPath);

  function handleChange(event) {
    const file = event.target.files?.[0];
    if (file) onChange(file);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 rounded-2xl border border-outline-variant/50 bg-surface-container-low p-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest">
          {displayUrl ? (
          <img
            src={displayUrl}
              alt="Vista previa"
              className="h-full w-full object-cover"
          />
          ) : (
            <span
              className="material-symbols-outlined text-3xl text-on-surface-variant"
              aria-hidden="true"
            >
              image
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
            Imagen
          </p>
          <p className="truncate text-body-md text-on-surface">
            {displayUrl ? "Imagen seleccionada" : "Selecciona una imagen"}
          </p>

          <label
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2 text-label-sm font-semibold uppercase tracking-widest transition-all duration-200 ${
              uploading
                ? "cursor-not-allowed bg-surface-container text-on-surface-variant opacity-60"
                : "cursor-pointer bg-primary text-on-primary hover:bg-primary/90"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
              disabled={uploading}
            />
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              {uploading ? "progress_activity" : "upload"}
            </span>
            {uploading
              ? "Subiendo..."
              : displayUrl
                ? "Cambiar imagen"
                : "Subir imagen"}
          </label>
        </div>
      </div>
    </div>
  );
}

ImageUploader.propTypes = {
  currentPath: PropTypes.string,
  preview: PropTypes.string,
  uploading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

ImageUploader.defaultProps = {
  currentPath: null,
  preview: null,
  uploading: false,
};
