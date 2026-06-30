import { useState } from 'react';

const PreviewFile = ({ title = '', accept = 'image/*', placeholder = 'Choose file…', onChange }) => {
  const [name, setName] = useState('');

  const handleChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    onChange?.(file);
  };

  const display = name ? (name.length > 24 ? `…${name.slice(-23)}` : name) : placeholder;

  return (
    <label className="scrubber">
      <span className="scrubber-track scrubber-track--select">
        <span className="scrubber-label">{title}</span>
        <span className="scrubber-select-right">
          <span className="scrubber-value">{display}</span>
        </span>
      </span>
      <input type="file" accept={accept} className="scrubber-file-input" aria-label={title} onChange={handleChange} />
    </label>
  );
};

export default PreviewFile;
