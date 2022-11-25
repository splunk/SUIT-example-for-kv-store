import React, { useState, useEffect } from 'react';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import Table from '@splunk/react-ui/Table';
import Button from '@splunk/react-ui/Button';
import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';
import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import EditRecord from './EditRecord';
import AddRecord from './AddRecord';

const themeToVariant = {
    prisma: { colorScheme: 'light', family: 'prisma' },
};

const kvUrl = createRESTURL(`storage/collections/data/my_collection`, {
    app: config.app,
    sharing: 'app',
});

async function updateRecord(key, value) {
    // update the KV record for the key that is selected
    //  console.log('value from modal in REST call', value);
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
    // update the KV record for the key that is selected
    //  console.log('value from modal in REST call', value);
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
    //  console.log('value from modal in REST call', value);
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
    // console.log('GET Call', n);
    return n;
}

const KVTable = () => {
    const [dataTable, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [additionalOpen, setAdditionalOpen] = useState(false);
    const [selected, setSelected] = useState({});
    // const modalToggle = useRef(null);

    const handleRequestOpen = (e, data) => {
        setOpen(true);
        setSelected(data);
        console.log('raw data', data);
    };
    // console.log('selected state', selected.value);

    const handleRequestClose = () => {
        setOpen(false);
        setAdditionalOpen(false);
        // modalToggle?.current?.focus(); // Must return focus to the invoking element when the modal closes
    };

    const handleAdditionalRecord = () => {
        setAdditionalOpen(true);
        // addNewRecord({ repo_name: 'test-repo-for-recording' });
    };

    useEffect(() => {
        readCollection().then((n) => setData(n));
    }, [open, additionalOpen]);

    const buttonStyle = {
        padding: '10px',
    };

    return (
        <div>
            <SplunkThemeProvider {...themeToVariant.prisma}>
                <div>
                    <div style={buttonStyle}>
                        {/* <Text
                            inline
                            canClear
                            value={additionalRepo}
                            onChange={(e) => {
                                setAdditionalRepo(e.target.value);
                            }}
                        /> */}
                        <Button
                            label="Add Record"
                            appearance="primary"
                            onClick={handleAdditionalRecord}
                        />
                    </div>
                    <div>
                        <Table stripeRows>
                            <Table.Head>
                                <Table.HeadCell>_key</Table.HeadCell>
                                <Table.HeadCell>field1</Table.HeadCell>
                                <Table.HeadCell>field2</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {dataTable.map((row) => (
                                    <Table.Row
                                        key={row.key}
                                        onClick={handleRequestOpen}
                                        // ref={modalToggle}
                                        data={row}
                                    >
                                        <Table.Cell key={row._key}>{row._key}</Table.Cell>
                                        <Table.Cell key={row.field1}>{row.field1}</Table.Cell>
                                        <Table.Cell key={row.field2}>{row.field2}</Table.Cell>
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
                        <AddRecord
                            addRecord={addNewRecord}
                            openState={additionalOpen}
                            onClose={handleRequestClose}
                        />
                    </div>
                </div>
            </SplunkThemeProvider>
        </div>
    );
};

export default KVTable;
