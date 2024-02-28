import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './index.module.scss';
import ModalComponent from '../../Modal';
const FormFile = ({ field }) => {
  const [file, setFile] = useState(field.value);
  const { downLoadLink, allowUpload = true } = field;
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    onDrop: (file) => {
      setFile(file[0]);
      field.changed(file[0]);
    },
  });
  let modalBody = (
    <>
      <img
        className="d-block mx-auto"
        src={file ? downLoadLink : field.value}
        alt={file ? downLoadLink : field.value}
      />
    </>
  );
  const [isShowModal, setModal] = useState(false);
  const showModal = () => {
    setModal(true);
  };
  const hideModal = () => {
    setModal(false);
  };
  return (
    <>
      <div className="position-relative">
        <div className="position-relative cursor-pointer">
          <div
            {...(allowUpload && getRootProps())}
            className={`${styles.dropzoneWrapper} d-flex align-items-center justify-content-center`}
          >
            {allowUpload && (
              <input
                {...getInputProps()}
                className="position-absolute start-0 top-0 bottom-0 end-0"
              />
            )}
            <div className="d-flex align-items-center p-0 border-input-bottom form-control position-relative">
              <div
                className={`${styles.dropzoneInput} form-control border-0 ps-1 pe-0 text-gray-800`}
              >
                <a
                  href={downLoadLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-800 text-decoration-none"
                >
                  {file && typeof file === 'string'
                    ? file
                    : typeof file === 'object'
                    ? file.name
                    : allowUpload
                    ? 'Upload File'
                    : 'File Attachment'}
                </a>
              </div>
              {allowUpload && (
                <div className={`${styles.btnChoose} btn btn-secondary text-white fs-8`}>
                  Choose file
                </div>
              )}
            </div>
          </div>
        </div>
        {file &&
          (typeof file === 'object'
            ? file?.path?.match(/\.(jpeg|jpg|gif|png)$/) != null
            : file?.match(/\.(jpeg|jpg|gif|png)$/) != null) && (
            <div className="mt-2">
              <img
                className="w-50 ms-auto d-block cursor-pointer"
                src={
                  typeof file === 'string'
                    ? downLoadLink
                    : typeof file === 'object'
                    ? URL.createObjectURL(file)
                    : field.value
                }
                alt={file ? file : field.value}
                onClick={() => {
                  showModal();
                }}
              />
              <ModalComponent
                body={modalBody}
                show={isShowModal}
                onHide={hideModal}
                dialogClassName="modal-lg"
              ></ModalComponent>
            </div>
          )}
      </div>
    </>
  );
};

export default FormFile;
