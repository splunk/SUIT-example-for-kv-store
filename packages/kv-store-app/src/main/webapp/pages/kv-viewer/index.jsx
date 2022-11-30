import React from 'react';
import layout from '@splunk/react-page';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';

import CollectionViewer from './CollectionViewer';

layout(
    <SplunkThemeProvider {...{ colorScheme: 'light', family: 'prisma' }}>
        <CollectionViewer />
    </SplunkThemeProvider>,
    {
        pageTitle: 'Collection Viewer',
        hideFooter: true,
        layout: 'scrolling',
    }
);
