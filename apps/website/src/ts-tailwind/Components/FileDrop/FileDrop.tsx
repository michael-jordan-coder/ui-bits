import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type KeyboardEvent
} from 'react';
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'motion/react';
import { Upload, File as FileIcon, X } from 'lucide-react';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

const UNITS = ['bytes', 'kb', 'mb', 'gb'];

// Format a byte count into a short, lowercase, human-readable size.
const formatSize = (bytes: number): string => {
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
interface DroppedFile {
  id: number;
  name: string;
  size: number;
  file: File;
}

export interface FileDropProps extends HTMLAttributes<HTMLDivElement> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFiles?: (files: File[]) => void;
  className?: string;
}

export default function FileDrop({
  accept = '',
  multiple = true,
  maxSize = 5_000_000,
  onFiles,
  className = '',
  ...rest
}: FileDropProps) {
  const prefersReduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);
  const promptId = useId();
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [isActive, setIsActive] = useState(false);

  const commit = (next: DroppedFile[]) => {
    setFiles(next);
    onFiles?.(next.map(entry => entry.file));
  };

  const addFiles = (fileList: FileList) => {
    const incoming = Array.from(fileList).filter(file => file.size <= maxSize);
    if (incoming.length === 0) return;
    const accepted = multiple ? incoming : incoming.slice(0, 1);
    const mapped: DroppedFile[] = accepted.map(file => ({
      id: idRef.current++,
      name: file.name,
      size: file.size,
      file
    }));
    commit(multiple ? [...files, ...mapped] : mapped);
  };

  const removeFile = (id: number) => {
    commit(files.filter(entry => entry.id !== id));
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openPicker();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isActive) setIsActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    // Ignore drag-leave bubbling from child nodes; only deactivate when the
    // pointer actually exits the zone's bounds.
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setIsActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsActive(false);
    addFiles(event.dataTransfer.files);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    // Reset so selecting the same file again re-fires change.
    event.target.value = '';
  };

  const transition: Transition = prefersReduced ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' };

  return (
    <div className={join('flex w-full max-w-md flex-col gap-3', className)} {...rest}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="upload files"
        aria-describedby={promptId}
        className={join(
          'relative flex cursor-pointer flex-col items-center justify-center gap-[0.6rem] rounded-[0.875rem] border-[1.5px] border-dashed px-6 py-9 outline-none [-webkit-tap-highlight-color:transparent] transition-[border-color,background-color,color] duration-[160ms] ease-out focus-visible:border-[#6366f1] focus-visible:[box-shadow:0_0_0_3px_rgba(99,102,241,0.35)]',
          isActive ? 'border-[#6366f1] bg-[#1e1b3a] text-[#c7d2fe]' : 'border-[#3f3f46] bg-[#18181b] text-[#a1a1aa]'
        )}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={prefersReduced ? undefined : { scale: isActive ? 1.015 : 1 }}
        transition={transition}
      >
        <Upload className="h-6 w-6" aria-hidden="true" />
        <span id={promptId} className="text-[0.9rem] leading-tight">
          drag files here or click to browse
        </span>
        <input
          ref={inputRef}
          type="file"
          className="absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,0,0,0)]"
          accept={accept || undefined}
          multiple={multiple}
          onChange={handleInputChange}
          tabIndex={-1}
        />
      </motion.div>

      {files.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          <AnimatePresence initial={false}>
            {files.map(entry => (
              <motion.li
                key={entry.id}
                className="flex items-center gap-[0.625rem] rounded-[0.625rem] border border-[#27272a] bg-[#18181b] py-2 pr-[0.625rem] pl-3 text-[#e4e4e7]"
                layout={!prefersReduced}
                initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={transition}
              >
                <FileIcon className="h-[1.05rem] w-[1.05rem] shrink-0 text-[#a1a1aa]" aria-hidden="true" />
                <span className="min-w-0 flex-1 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                  {entry.name}
                </span>
                <span className="shrink-0 text-xs text-[#71717a]">{formatSize(entry.size)}</span>
                <button
                  type="button"
                  className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-0 text-[#a1a1aa] outline-none transition-[background-color,color] duration-[120ms] ease-out hover:bg-[#27272a] hover:text-[#fafafa] focus-visible:[box-shadow:0_0_0_2px_rgba(99,102,241,0.55)]"
                  aria-label={`remove ${entry.name}`}
                  onClick={() => removeFile(entry.id)}
                >
                  <X className="h-[0.95rem] w-[0.95rem]" aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
