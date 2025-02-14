import React, { ReactElement, useState } from 'react';
import GraphiQL from 'graphiql';
import type { Fetcher } from '@graphiql/toolkit';
import { Text } from '@mantine/core';
import {
  GEN3_GUPPY_API,
  selectHeadersWithCSRFToken,
  useCoreSelector,
} from '@gen3/core';
import { GqlQueryEditorProps } from './types';

/**
 * Fetches graphql data from a graphql endpoint if one is specified, or guppy by default.
 * @param graphQLEndpoint - The location of the graphql endpoint.
 * @returns a component containing a GraphiQl editor
 */
const GqlQueryEditor = ({
  graphQLEndpoint,
}: GqlQueryEditorProps): ReactElement => {
  const [query, setQuery] = useState('');
  const headers = useCoreSelector(selectHeadersWithCSRFToken);

  // Typically we would put this in core but it's only used here
  const fetcher: Fetcher = async (graphQLParams) => {
    const data = await fetch(graphQLEndpoint || `${GEN3_GUPPY_API}/graphql`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(graphQLParams),
    });
    return data.json().catch(() => data.text());
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center m-2">
        <Text size="xl" fw={500}>
          Query Graph
        </Text>
      </div>
      <GraphiQL
        editorTheme="light"
        fetcher={fetcher}
        query={query}
        onEditQuery={setQuery}
      >
        <GraphiQL.Logo> {null} </GraphiQL.Logo>
      </GraphiQL>
    </div>
  );
};

export default GqlQueryEditor;
