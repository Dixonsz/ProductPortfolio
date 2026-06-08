import PropTypes from "prop-types";

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function getColumnAlign(column) {
  return column.align ?? (column.key === "actions" ? "right" : "left");
}

function Table({ columns, data, emptyMessage = "No hay registros disponibles." }) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-surface-container-low/70">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant ${
                    ALIGN_CLASS[getColumnAlign(column)]
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-on-surface-variant"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id ?? index}
                  className="transition-colors hover:bg-surface-container-low/50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-5 align-middle ${
                        ALIGN_CLASS[getColumnAlign(column)]
                      }`}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      align: PropTypes.oneOf(["left", "center", "right"]),
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string,
};

export default Table;
