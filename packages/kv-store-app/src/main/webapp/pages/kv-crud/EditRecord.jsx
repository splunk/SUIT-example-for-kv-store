import React, { useState } from 'react';
import T from 'prop-types';
import Table from '@splunk/react-ui/Table';
import Button from '@splunk/react-ui/Button';
import Heading from '@splunk/react-ui/Heading';
import Text from '@splunk/react-ui/Text';
import Modal from '@splunk/react-ui/Modal';

const EditRecord = ({ remove, update, openState, onClose, selectedRow }) => {
    const [newName, setNewName] = useState();
    const [newOwner, setNewOwner] = useState();

    const deleteRepo = () => {
        remove(selectedRow._key);
        onClose();
    };

    const updateRepo = () => {
        const currentRow = { ...selectedRow, field1: newName, field2: newOwner }; // for some reason I needed to do this and I couldn't store in state
        console.log('inside function', currentRow);
        update(selectedRow._key, currentRow);
        onClose();
    };

    return (
        <div>
            <Modal onRequestClose={onClose} open={openState} style={{ width: '500px' }}>
                <Modal.Header onRequestClose={onClose} title="Update Record" />
                <Modal.Body>
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>_key</Table.HeadCell>
                            <Table.HeadCell>repo_name</Table.HeadCell>
                            <Table.HeadCell>repo_owner</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row key={selectedRow._key}>
                                <Table.Cell>{selectedRow._key}</Table.Cell>
                                <Table.Cell>{selectedRow.field1}</Table.Cell>
                                <Table.Cell>{selectedRow.field2}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>{' '}
                    <Heading level={4}>Enter Repo Name</Heading>
                    <Text
                        canClear
                        value={newName}
                        onChange={(e) => {
                            setNewName(e.target.value);
                        }}
                    />
                    <Heading level={4}>Enter Repo Owner</Heading>
                    <Text
                        canClear
                        value={newOwner}
                        onChange={(e) => {
                            setNewOwner(e.target.value);
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="default" onClick={onClose} label="Cancel" />
                    <Button appearance="destructive" onClick={deleteRepo} label="Delete Record" />
                    <Button appearance="primary" onClick={updateRepo} label="Submit" />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

EditRecord.propTypes = {
    remove: T.func,
    update: T.func,
    onClose: T.func,
    selectedRow: T.object,
    openState: T.bool,
};
export default EditRecord;
