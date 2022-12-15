import React from 'react';

import layout from '@splunk/react-page';
import { getUserTheme, getThemeOptions } from '@splunk/splunk-utils/themes';
import P from '@splunk/react-ui/Paragraph';
import Link from '@splunk/react-ui/Link';
import List from '@splunk/react-ui/List';
import Heading from '@splunk/react-ui/Heading';
import { StyledContainer, StyledGreeting } from './StartStyles';

getUserTheme()
    .then((theme) => {
        const splunkTheme = getThemeOptions(theme);
        layout(
            <StyledContainer>
                <StyledGreeting>KV-Store CRUD with the Splunk UI Toolkit</StyledGreeting>
                <div>
                    <P>
                        This app showcases a simple Create, Read, Update, Delete workflow with the
                        Splunk Enterprise KV Store, as well as the ability to view KV Store
                        collections for other apps in your instance. This app was created with the{' '}
                        <Link to="https://splunkui.splunk.com/" openInNewContext>
                            Splunk UI Toolkit
                        </Link>
                        . This app can be cloned, forked, or copied for your own use by seeing the
                        source code on{' '}
                        <Link to="https://github.com" openInNewContext>
                            Github
                        </Link>
                    </P>{' '}
                    <P>
                        . This app leverages the KV Store endpoints on the{' '}
                        <Link to="https://github.com" openInNewContext>
                            Splunk Enterprise REST API
                        </Link>{' '}
                        and the{' '}
                        <Link to="https://github.com" openInNewContext>
                            Splunk Utils
                        </Link>{' '}
                        package from the Splunk UI Toolkit to interact with those endpoints. THe
                        following documentation provides more detail on interacting with the KV
                        Store on Splunk.
                    </P>
                    <List>
                        <List.Item>
                            <Link to="https://dev.splunk.com/enterprise/docs/developapps/manageknowledge/kvstore/aboutkvstorecollections/">
                                About the KV Store
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to="https://dev.splunk.com/enterprise/docs/developapps/manageknowledge/kvstore/usingconfigurationfiles">
                                Create KV Store collections with .conf files
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to="https://dev.splunk.com/enterprise/docs/developapps/manageknowledge/kvstore/usetherestapitomanagekv">
                                Manage KV Store collections with the Splunk REST API
                            </Link>
                        </List.Item>
                    </List>
                    <Heading>Source Code</Heading>
                    <P>The following are some key files for the implementation of this app</P>
                    <List>
                        <List.Item>
                            src/main/webapp/pages/kv-crud/KVTable.jsx - The main code for the KVCRUD
                            page
                        </List.Item>
                        <List.Item>
                            src/main/webapp/pages/kv-crud/EditRecord.jsx - The modal action for
                            editing records in the KVCRUD page
                        </List.Item>
                        <List.Item>
                            src/main/webapp/pages/kv-viewer/CollectionViewer.jsx - The main code for
                            the Collection Viewer page
                        </List.Item>
                    </List>
                </div>
            </StyledContainer>,
            splunkTheme
        );
    })
    .catch((e) => {
        const errorEl = document.createElement('span');
        errorEl.innerHTML = e;
        document.body.appendChild(errorEl);
    });
