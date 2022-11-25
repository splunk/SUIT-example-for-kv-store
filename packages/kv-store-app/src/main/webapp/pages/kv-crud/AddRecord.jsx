import React, { useState } from 'react';
import T from 'prop-types';
import Text from '@splunk/react-ui/Text';
import Heading from '@splunk/react-ui/Heading';
import Button from '@splunk/react-ui/Button';
import Modal from '@splunk/react-ui/Modal';

const AddRecord = ({ addRecord, openState, onClose }) => {
    const [repoName, setRepoName] = useState();
    const [repoOwner, setRepoOwner] = useState();

    const addRepo = () => {
        addRecord({ field1: repoName, field2: repoOwner });
        onClose();
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '500px' }}>
                <Modal.Header onRequestClose={onClose} title="Add New Record to Collection" />
                <Modal.Body>
                    <Heading level={4}>Enter Repo Name</Heading>
                    <Text
                        canClear
                        value={repoName}
                        onChange={(e) => {
                            setRepoName(e.target.value);
                        }}
                    />
                    <Heading level={4}>Enter Repo Owner</Heading>
                    <Text
                        canClear
                        value={repoOwner}
                        onChange={(e) => {
                            setRepoOwner(e.target.value);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="default" onClick={onClose} label="Cancel" />
                    <Button appearance="primary" onClick={addRepo} label="Submit" />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

AddRecord.propTypes = {
    addRecord: T.func,
    onClose: T.func,
    openState: T.bool,
};
export default AddRecord;
