import React from 'react';
import { AesirXDam } from '@kakahuy113/test-dam-app';
import { Button, Modal } from 'react-bootstrap';
import './index.scss';
function ModalDAMComponent({ show, onHide, onInsert, onCancel }) {
  let dataSelected = [];
  return (
    <Modal
      dialogClassName={'modal-xl modal_digital_assets'}
      show={show}
      onHide={onHide}
      centered
      autoFocus={false}
    >
      <Modal.Body className="p-24">
        <div className="modal-class">
          <AesirXDam
            onSelect={(data) => {
              dataSelected = data;
            }}
          />
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <Button variant="light" className="px-3 fw-semibold" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="success"
            className="px-15 fw-semibold ms-16"
            onClick={() => {
              onInsert(dataSelected);
            }}
          >
            Insert Into Post
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalDAMComponent;
