import React, { useMemo } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import fileSize from 'filesize';
import {
  useGetSubmissionsQuery,
  SubmissionInfo,
  SubmissionDocument,
} from '@gen3/core';
import { Loader, Text } from '@mantine/core';

const cols = [
  {
    field: 'job_id',
    accessorKey: 'job_id',
    header: 'Id',
  },
  {
    field: 'submitter',
    accessorKey: 'submitter',
    header: 'Submitter',
  },
  {
    field: 'project_id',
    accessorKey: 'project_id',
    header: 'Project',
  },
  {
    field: 'created_datetime',
    accessorKey: 'created_datetime',
    header: 'Created Date',
  },
  {
    field: 'state',
    accessorKey: 'state',
    header: 'State',
  },
];

const SubmissionsTable = () => {
  const { data, isLoading, isFetching, isError } = useGetSubmissionsQuery();

  const rows = useMemo(() => {
    if (data) {
      return data.transactionList.map((row: SubmissionInfo) => {
        const fileSizeTotal = fileSize.filesize(
          row.documents.reduce(
            (acc: number, doc: SubmissionDocument) => acc + doc.doc_size,
            0,
          ),
        );

        return {
          job_id: row.id,
          submitter: row.submitter,
          project_id: row.project_id,
          created_datetime: row.created_datetime,
          state: row.state,
          fileSize: fileSizeTotal,
        };
      });
    }
    return [];
  }, [data]);

  const table = useMantineReactTable({
    columns: cols,
    data: rows,
    manualSorting: true,
    manualPagination: false,
    paginateExpandedRows: false,
    rowCount: rows.length,
    enableTopToolbar: false,
    layoutMode: 'semantic',
    state: {
      isLoading,
      showProgressBars: isFetching,
      showAlertBanner: isError,
      columnVisibility: {
        'mrt-row-expand': false,
      },
    },
    mantineTableHeadCellProps: {
      sx: (theme) => {
        return {
          backgroundColor: theme.colors.table[8],
          color: theme.colors.table[0],
          textAlign: 'center',
          padding: theme.spacing.md,
          fontWeight: 'bold',
          fontSize: theme.fontSizes.lg,
          textTransform: 'uppercase',
        };
      },
    },
    mantineTableProps: {
      sx: (theme) => {
        return {
          backgroundColor: theme.colors.base[9],
        };
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex w-full py-24 relative justify-center">
        <Loader variant="dots" />{' '}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full py-24 h-100 relative justify-center">
        <Text size={'xl'}>Error loading project data</Text>
      </div>
    );
  }

  return rows.length > 0 ? (
    <div className="flex-col">
      <Text>Submissions</Text>
      <div className="flex w-full bg-base-max p-4 rounded-lg">
        <div className="grow w-auto inline-block overflow-x-scroll">
          <MantineReactTable table={table} />
        </div>
      </div>
    </div>
  ) : null;
};

export default SubmissionsTable;
