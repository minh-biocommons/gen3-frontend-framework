import React from 'react';
import { NavPageLayout, NavPageLayoutProps } from '../../features/Navigation';
import { DataLibraryLists } from '../../features/DataLibrary';

const DataLibraryPage = ({
  headerProps,
  footerProps,
}: NavPageLayoutProps): JSX.Element => {
  return (
    <NavPageLayout
      {...{ headerProps, footerProps }}
      headerData={{
        title: 'Gen3 DataLibrary Page',
        content: 'DataLibrary Data',
        key: 'gen3-data-library-page',
      }}
    >
      <DataLibraryLists />
    </NavPageLayout>
  );
};

export default DataLibraryPage;
