import React from 'react';
import T from 'prop-types';
import Heading from '@splunk/react-ui/Heading';
import Modal from '@splunk/react-ui/Modal';
import JSONTree from '@splunk/react-ui/JSONTree';

const ViewModal = ({ openState, onClose, selectedRow }) => {
    return (
        <div>
            <Modal
                onRequestClose={onClose}
                open={openState}
                style={{ width: '500px', height: '600px' }}
            >
                <Modal.Header onRequestClose={onClose} title="Collection Details" />
                <Modal.Body>
                    <Heading level={4}>Collection</Heading>
                    <JSONTree json={selectedRow} expandChildren />
                </Modal.Body>
            </Modal>
        </div>
    );
};

ViewModal.propTypes = {
    onClose: T.func,
    selectedRow: T.object,
    openState: T.bool,
};
export default ViewModal;
