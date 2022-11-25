import React from 'react';
import layout from '@splunk/react-page';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';

import KVTable from './KVTable';

layout(
    <SplunkThemeProvider {...{ colorScheme: 'light', family: 'prisma' }}>
        <KVTable />
    </SplunkThemeProvider>,
    {
        pageTitle: 'KV CRUD',
        hideFooter: true,
        layout: 'fixed',
    }
);
