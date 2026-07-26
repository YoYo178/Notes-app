import { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

import { useAuthContext } from '../../../../contexts/AuthContext';
import { useUpdateNoteMutation } from '../../../../hooks/network/note/useUpdateNoteMutation';
import { useUploadImagesMutation } from '../../../../hooks/network/files/useUploadImagesMutation';
import { useDeleteFileMutation } from '../../../../hooks/network/files/useDeleteFileMutation';

import { INote } from '../../../../types/note.types';
import { getFileURL } from '../../../../utils/note.utils';

import './EditNoteModal.css';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: INote;
}

export const EditNoteModal: FC<EditNoteModalProps> = ({ isOpen, onClose, note }) => {
  const { auth } = useAuthContext();

  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);

  const [images, setImages] = useState(note.images ?? []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const imageURLs = [
    ...images.map((filename) => getFileURL(auth?.id ?? '', 'image', filename)),
    ...newImages.map((file) => URL.createObjectURL(file)),
  ];

  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const audioURL = getFileURL(auth?.id ?? '', 'audio', note.audio ?? '');

  const updateNoteMutation = useUpdateNoteMutation({ queryKey: ['notes'] });
  const uploadImageMutation = useUploadImagesMutation({});
  const deleteFilesMutation = useDeleteFileMutation({});

  useEffect(() => {
    setTitle(note.title);
    setDescription(note.description);
    setImages(note.images ?? []);
    setRemovedImages([]);
    setNewImages([]);
    setImagePreview('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteImage = async (index: number) => {
    const element = images?.[index];

    if (element) {
      setImages(images.filter((_, i) => i !== index));
      setRemovedImages([...removedImages, element]);
    } else {
      setNewImages([...newImages.filter((_, i) => i !== index - images.length)]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    let remainingSlots = 5 - imageURLs.length;

    if (remainingSlots <= 0) {
      alert('Maximum 5 images allowed');
      return;
    }

    const imgs = [];

    for (const file of Array.from(e.target.files)) {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 2MB limit`);
        continue;
      }

      if (remainingSlots <= 0) break;

      remainingSlots--;
      imgs.push(file);
    }

    setNewImages([...newImages, ...imgs]);
    e.target.value = '';
  };

  const handleSaveNote = async () => {
    if (!title || !description) {
      console.error('Title or description fields cannot be empty!');
      return;
    }

    const mutatedNote: Partial<INote> = {};

    if (title !== note.title) mutatedNote.title = title;

    if (description !== note.description) mutatedNote.description = description;

    if (removedImages.length) {
      await deleteFilesMutation.mutateAsync({
        payload: { files: removedImages },
      });

      mutatedNote.images = [...images];
    }

    if (newImages.length) {
      const fd = new FormData();
      newImages.forEach((img) => {
        fd.append('images[]', img);
      });

      const response = await uploadImageMutation.mutateAsync({ payload: fd });

      mutatedNote.images = [...images, ...response.filenames];
    }

    const hasChanged =
      note.title !== title ||
      note.description !== description ||
      removedImages.length ||
      newImages.length;

    if (hasChanged) {
      setIsUploading(true);

      await updateNoteMutation.mutateAsync({
        pathParams: { noteId: note._id },
        payload: mutatedNote,
      });

      onClose();
      setIsUploading(false);
      setNewImages([]);
      setRemovedImages([]);
    }
  };

  return createPortal(
    <div className='enm-backdrop' onMouseDown={onClose}>
      {imagePreview && (
        <div className='enm-image-preview' onMouseDown={(e) => e.stopPropagation()}>
          <div className='enm-image-preview-header'>
            <span>Image Preview</span>
            <button className='enm-image-preview-close-button' onClick={() => setImagePreview('')}>
              <IoMdClose className='enm-image-preview-close-button-icon' />
            </button>
          </div>
          <img src={imagePreview}></img>
        </div>
      )}
      <div className='enm' onMouseDown={(e) => e.stopPropagation()}>
        <div className='enm-header'>
          <h2 className='enm-title'>Edit Note</h2>
          <button className='enm-close-button' onClick={onClose}>
            <IoMdClose className='enm-close-button-icon' />
          </button>
        </div>
        <div className='enm-fields'>
          {/* HACK: src attribute expects a 'string | undefined' but we forcefully pass 'string | null' because react doesn't like the former */}
          {!note.isText && (
            <audio controls src={audioURL as string | undefined} className='enm-audio-player' />
          )}
          <div className='enm-text-field-container'>
            <input
              type='text'
              className='enm-field-title'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='enm-text-field-container enm-description-field-container'>
            <textarea
              className='enm-field-description'
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className='enm-images-container'>
            {imageURLs.map((url, i) => {
              return (
                <div key={`enm-image-container-${i + 1}`} className='enm-image-container'>
                  <img
                    id={`enm-image-${i + 1}`}
                    className='enm-image'
                    src={url}
                    onClick={() => setImagePreview(url)}
                  />
                  <button
                    id={`enm-image-delete-button-${i + 1}`}
                    className='enm-image-delete-button'
                    onClick={() => handleDeleteImage(i)}
                    disabled={isUploading}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              );
            })}
            {(!images || images.length < 5) && (
              <div
                className='enm-upload-image-button'
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  name='Upload Image'
                  type='file'
                  accept='image/*'
                  hidden
                  multiple
                  onChange={handleInputChange}
                />
                <FaPlus />
              </div>
            )}
          </div>
        </div>
        <div className='enm-footer'>
          <button className='cnm-check-button' disabled={isUploading} onClick={handleSaveNote}>
            <FaCheck />
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')!,
  );
};
