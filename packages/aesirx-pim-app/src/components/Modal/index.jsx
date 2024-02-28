import React from 'react';

import { withTranslation } from 'react-i18next';

import './index.scss';
import { Modal } from 'react-bootstrap';

class ModalComponent extends React.Component {
  render() {
    let { header, footer, body, onHide, dialogClassName, noClose, show } = this.props;
    return (
      <>
        <Modal show={show} onHide={onHide} centered dialogClassName={dialogClassName}>
          <Modal.Header
            closeButton
            className={noClose ? `border-bottom-0 justify-content-center pb-2 noClose px-4` : ''}
          >
            {header && <Modal.Title className="fs-4">{header}</Modal.Title>}
          </Modal.Header>
          <Modal.Body className="px-4 pt-0 pb-2">{body}</Modal.Body>
          {footer && <Modal.Footer className="px-4">{footer}</Modal.Footer>}
        </Modal>
      </>
    );
  }
}

export default withTranslation('common')(ModalComponent);
