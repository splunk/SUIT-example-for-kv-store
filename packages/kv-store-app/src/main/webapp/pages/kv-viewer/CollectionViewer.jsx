import React, { useState, useEffect } from 'react';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import Table from '@splunk/react-ui/Table';
import Select from '@splunk/react-ui/Select';
import Message from '@splunk/react-ui/Message';
import * as config from '@splunk/splunk-utils/config';
import { handleError, handleResponse, defaultFetchInit } from '@splunk/splunk-utils/fetch';
import ViewModal from './ViewModal';

const themeToVariant = {
    prisma: { colorScheme: 'light', family: 'prisma' },
};

const appsEndpoint = '/en-US/splunkd/__raw/servicesNS/nobody/system/apps/local/'; // this is the endpoint that will get us in the apps list

async function readCollection(url) {
    // read in theKV store collection of interest
    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'GET';
    const n = await fetch(url, {
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

async function getApps() {
    // this function will fetch a list of apps from the apps endpoint

    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'GET';
    const n = await fetch(`${appsEndpoint}?output_mode=json&count=100`, {
        ...fetchInit,
    }).then(handleResponse(200));
    return n;
}

async function readAppCollections(endpoint) {
    // read what collections are available in all apps

    const fetchInit = defaultFetchInit; // from splunk-utils API
    fetchInit.method = 'GET';
    const n = await fetch(`${endpoint}?output_mode=json`, {
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

const CollectionViewer = () => {
    // all state variables for the selected app, selected collection and the applist
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [appCollections, setAppCollections] = useState([
        { collection: 'No app selected', app: '' },
    ]);
    const [selectedApp, setSelectedApp] = useState('kv-store-app'); // state control for app selected in dropdown
    const [appsList, setAppsList] = useState([]);

    const collectionsEP = `/en-US/splunkd/__raw/servicesNS/nobody/${selectedApp}/storage/collections/config`; // endpoint for all app collections

    const handleRequestOpen = (e, data) => {
        // open modal
        const collectionURL = `/en-US/splunkd/__raw/servicesNS/nobody/${data.app}/storage/collections/data/${data.collection}`; // this is the endpoint that will get us in the apps list
        readCollection(collectionURL).then((n) => setSelectedRow(n));
        setOpen(true);
    };

    const handleRequestClose = () => {
        // close modal
        setOpen(false);
        // modalToggle?.current?.focus(); // Must return focus to the invoking element when the modal closes
    };

    const handleAppChange = (e, data) => {
        // when user selects an app from list
        setSelectedApp(data.value);
    };

    useEffect(() => {
        // for each render, we want to do two things
        getApps().then((r) => {
            // first, grab all the app data on the instance and display it on the list
            const list = r.entry.map((entry) => entry.name);
            setAppsList(list);
        });
        readAppCollections(collectionsEP).then((r) => {
            // we then want to populate the table depending on the selected app
            // call specifically reads collections in all apps
            const list = r.entry.map((entry) => {
                return {
                    collection: entry.name, // from the returned data, we are only interested in the app and collection name
                    app: entry.acl.app,
                };
            });
            const filter = list.filter((row) => {
                // since we selected a particular app, we need to filter the returned list only for that app
                return row.app === selectedApp;
            });
            setAppCollections(filter); // now we can set the app collection state to the collections within our selected app
        });
    }, [selectedApp]);

    const buttonStyle = {
        padding: '10px',
        display: 'flex',
    };

    return (
        <div>
            <SplunkThemeProvider {...themeToVariant.prisma}>
                <div>
                    <div style={buttonStyle}>
                        <Select
                            prefixLabel="Selected App"
                            style={{ width: 350 }}
                            label={selectedApp}
                            defaultValue={selectedApp}
                            onChange={handleAppChange}
                        >
                            {appsList.map((app) => {
                                return <Select.Option label={app} value={app} />;
                            })}
                        </Select>
                        <Message
                            style={{ width: 'fit-content', marginLeft: '20px' }}
                            type="info"
                            appearance="fill"
                        >
                            Select an app to view it's KV store collections (currently defaults to
                            this app)
                        </Message>
                    </div>
                </div>
                <Table stripeRows actionsColumnWidth={104}>
                    <Table.Head>
                        <Table.HeadCell>Collection</Table.HeadCell>
                        <Table.HeadCell>App Name</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {appCollections.map((row) => (
                            <Table.Row
                                key={row.collection}
                                onClick={handleRequestOpen}
                                // ref={modalToggle}
                                data={row}
                            >
                                <Table.Cell key={row.collection}>{row.collection}</Table.Cell>
                                <Table.Cell>{row.app}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <ViewModal
                    openState={open}
                    onClose={handleRequestClose}
                    selectedRow={selectedRow}
                />
            </SplunkThemeProvider>
        </div>
    );
};

export default CollectionViewer;
