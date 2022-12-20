import React, { useState, useEffect } from 'react';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import { _ } from '@splunk/ui-utils/i18n';
import Table from '@splunk/react-ui/Table';
import Button from '@splunk/react-ui/Button';
import Tooltip from '@splunk/react-ui/Tooltip';
import Text from '@splunk/react-ui/Text';
import Pencil from '@splunk/react-icons/Pencil';
import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';
import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import EditRecord from './EditRecord';

const themeToVariant = {
    prisma: { colorScheme: 'light', family: 'prisma' },
};

const kvUrl = createRESTURL(`storage/collections/data/my_collection`, {
    app: config.app,
    sharing: 'app',
});

async function updateRecord(key, value) {
    // update the KV record for the key that is selected

    const fetchInit = defaultFetchInit;
    fetchInit.method = 'POST';
    const n = await fetch(`${kvUrl}/${key}`, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    })
        .then(handleResponse(200))
        .catch(handleError('error'))
        .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;
    return n;
}

async function deleteRecord(key) {
    // delete the KV record for the key that is selected

    const fetchInit = defaultFetchInit;
    fetchInit.method = 'DELETE';
    const n = await fetch(`${kvUrl}/${key}`, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
    })
        .then(handleResponse(200))
        .catch(handleError('error'))
        .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;
    return n;
}

async function addNewRecord(value) {
    // add a new record with the entered data from the user
    // adding record
    console.log('in add record');
    const fetchInit = defaultFetchInit;
    fetchInit.method = 'POST';
    const n = await fetch(`${kvUrl}`, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
    })
        .then(handleResponse(200))
        .catch(handleError('error'))
        .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;
    return n;
}

async function readCollection() {
    // read in theKV store collection of interest
    console.log('read collection');
    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'GET';
    const n = await fetch(kvUrl, {
        ...fetchInit,
        headers: {
            'X-Splunk-Form-Key': config.CSRFToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
        },
    })
        .then(handleResponse(200))
        .catch(handleError('error'))
        .catch((err) => (err instanceof Object ? 'error' : err)); // handleError sometimes returns an Object;
    return n;
}

const KVTable = () => {
    // initialize the state for the shown table, modal, clicked row, and entries
    const [dataTable, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState({});
    const [recordField1, setField1] = useState('');
    const [recordField2, setField2] = useState('');

    console.log(dataTable);
    console.log('test');

    const handleRequestOpen = (e, data) => {
        // handles what happens when modal is open
        setOpen(true);
        setSelected(data); // indicate which row we clicked on
    };

    const handleRequestClose = () => {
        // handles what happens when modal is closed
        setOpen(false);
        // modalToggle?.current?.focus(); // Must return focus to the invoking element when the modal closes
    };

    const handleAdditionalRecord = () => {
        if (recordField1 !== '' && recordField2 !== '') {
            // very basic validity check, a more robust one may have more conditions
            addNewRecord({ field1: recordField1, field2: recordField2 }).then((n) => {
                console.log(n);
                readCollection().then((g) => {
                    console.log(g);
                    console.log('added record');
                    setData(g);
                });
            }); // send this data to be created to a new record
        }
    };

    useEffect(() => {
        console.log('in effect');
        readCollection().then((n) => {
            console.log(n);
            console.log('reading kv');
            setData(n);
        }); // on first render, we want to read the collection and then set the table to it
    }, [open]);

    const buttonStyle = {
        padding: '10px',
    };

    const primaryActions = // adding row actions to our table
        (
            <Tooltip
                content={_('Edit')}
                contentRelationship="label"
                onClick={handleRequestOpen}
                style={{ marginRight: 8 }}
            >
                <Button appearance="secondary" icon={<Pencil hideDefaultTooltip />} />
            </Tooltip>
        );

    return (
        <div>
            <SplunkThemeProvider {...themeToVariant.prisma}>
                <div>
                    <div style={buttonStyle}>
                        <Text
                            inline
                            // canClear
                            value={recordField1}
                            onChange={(e) => {
                                setField1(e.target.value);
                            }}
                        />
                        <Text
                            inline
                            // canClear
                            value={recordField2}
                            onChange={(e) => {
                                setField2(e.target.value);
                            }}
                        />
                        <Button
                            label="Add Record"
                            appearance="primary"
                            onClick={handleAdditionalRecord}
                        />
                    </div>
                    <div>
                        <Table stripeRows actionsColumnWidth={104}>
                            <Table.Head>
                                <Table.HeadCell>_key</Table.HeadCell>
                                <Table.HeadCell>field1</Table.HeadCell>
                                <Table.HeadCell>field2</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {dataTable.map((row) => (
                                    <Table.Row
                                        key={row.key}
                                        data={row}
                                        actionPrimary={primaryActions}
                                    >
                                        <Table.Cell key={row._key}>{row._key}</Table.Cell>
                                        <Table.Cell>{row.field1}</Table.Cell>
                                        <Table.Cell>{row.field2}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <EditRecord
                            remove={deleteRecord}
                            update={updateRecord}
                            openState={open}
                            onClose={handleRequestClose}
                            selectedRow={selected}
                        />
                        {/* <AddRecord
                            addRecord={addNewRecord}
                            openState={additionalOpen}
                            onClose={handleRequestClose}
                        /> */}
                    </div>
                </div>
            </SplunkThemeProvider>
        </div>
    );
};

export default KVTable;
