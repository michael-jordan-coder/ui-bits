import { useId, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Upload, File as FileIcon, X } from 'lucide-react';
import './FileDrop.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

const UNITS = ['bytes', 'kb', 'mb', 'gb'];

// Format a byte count into a short, lowercase, human-readable size.
const formatSize = bytes => {
  if (bytes < 1) return '0 bytes';
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1);
  const value = bytes / 1024 ** exponent;
  const rounded = exponent === 0 ? value : Math.round(value * 10) / 10;
  return `${rounded} ${UNITS[exponent]}`;
};

// A drag-and-drop upload zone. Files dropped onto the zone — or chosen through
// the hidden input the zone opens on click/Enter/Space — are listed as chips
// below, each removable. Oversized files (over `maxSize`) are dropped quietly.
// Nothing is uploaded; `onFiles` reports the current set on every change. With
// reduced motion the active state and chip add/remove are instant.
export default function FileDrop({
  accept = '',
  multiple = true,
  maxSize = 5_000_000,
  onFiles,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const inputRef = useRef(null);
  const idRef = useRef(0);
  const promptId = useId();
  const [files, setFiles] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const commit = next => {
    setFiles(next);
    onFiles?.(next.map(entry => entry.file));
  };

  const addFiles = fileList => {
    const incoming = Array.from(fileList).filter(file => file.size <= maxSize);
    if (incoming.length === 0) return;
    const accepted = multiple ? incoming : incoming.slice(0, 1);
    const mapped = accepted.map(file => ({
      id: idRef.current++,
      name: file.name,
      size: file.size,
      file
    }));
    commit(multiple ? [...files, ...mapped] : mapped);
  };

  const removeFile = id => {
    commit(files.filter(entry => entry.id !== id));
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openPicker();
  };

  const handleDragOver = event => {
    event.preventDefault();
    if (!isActive) setIsActive(true);
  };

  const handleDragLeave = event => {
    // Ignore drag-leave bubbling from child nodes; only deactivate when the
    // pointer actually exits the zone's bounds.
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setIsActive(false);
  };

  const handleDrop = event => {
    event.preventDefault();
    setIsActive(false);
    addFiles(event.dataTransfer.files);
  };

  const handleInputChange = event => {
    if (event.target.files) addFiles(event.target.files);
    // Reset so selecting the same file again re-fires change.
    event.target.value = '';
  };

  const transition = prefersReduced ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' };

  return (
    <div className={join('file-drop', className)} {...rest}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="upload files"
        aria-describedby={promptId}
        className={join('file-drop__zone', isActive && 'is-active')}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={prefersReduced ? undefined : { scale: isActive ? 1.015 : 1 }}
        transition={transition}
      >
        <Upload className="file-drop__icon" aria-hidden="true" />
        <span id={promptId} className="file-drop__prompt">
          drag files here or click to browse
        </span>
        <input
          ref={inputRef}
          type="file"
          className="file-drop__input"
          accept={accept || undefined}
          multiple={multiple}
          onChange={handleInputChange}
          tabIndex={-1}
        />
      </motion.div>

      {files.length > 0 && (
        <ul className="file-drop__list">
          <AnimatePresence initial={false}>
            {files.map(entry => (
              <motion.li
                key={entry.id}
                className="file-drop__chip"
                layout={!prefersReduced}
                initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={transition}
              >
                <FileIcon className="file-drop__chip-icon" aria-hidden="true" />
                <span className="file-drop__chip-name">{entry.name}</span>
                <span className="file-drop__chip-size">{formatSize(entry.size)}</span>
                <button
                  type="button"
                  className="file-drop__chip-remove"
                  aria-label={`remove ${entry.name}`}
                  onClick={() => removeFile(entry.id)}
                >
                  <X className="file-drop__chip-remove-icon" aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
