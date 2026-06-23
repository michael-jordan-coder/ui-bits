const PreviewInput = ({ title = '', value = '', placeholder = '', maxLength, inputMode, onChange }) => (
  <label className="scrubber">
    <span className="scrubber-track scrubber-track--input">
      <span className="scrubber-label">{title}</span>
      <input
        type="text"
        className="scrubber-input"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        spellCheck={false}
        aria-label={title}
        onChange={e => onChange?.(e.target.value)}
      />
    </span>
  </label>
);

export default PreviewInput;
