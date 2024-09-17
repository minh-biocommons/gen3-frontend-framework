import React, { useMemo, useState } from 'react';
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from 'use-deep-compare';
import {
  getAllFieldsFromFilterConfigs,
  useUpdateFilters,
} from '../../components/facets/utils';
import { Group } from '@mantine/core';
import FacetSelectionPanel from './FacetSelectionPanel';

import {
  CoreState,
  FacetDefinition,
  selectIndexFilters,
  useCoreSelector,
  useGetAggsQuery,
} from '@gen3/core';
import { CohortDiscoveryGroup } from './types';
import { classifyFacets } from '../../components/facets/utils';
import { TabConfig } from '../CohortBuilder/types';
import { ClearFacetHook } from '../../components/facets/types';

const IndexPanel = ({ dataConfig, tabs, tabTitle }: CohortDiscoveryGroup) => {
  const [controlsExpanded, setControlsExpanded] = useState(true);
  const [activeFields, setActiveFields] = useState<string[]>([]); // the fields that have been selected by the user

  const index = dataConfig.dataType;
  const fields = useMemo(
    () => getAllFieldsFromFilterConfigs(tabs ?? []),
    [tabs],
  );

  const [facetDefinitions, setFacetDefinitions] = useState<
    Record<string, FacetDefinition>
  >({});

  const [categories, setCategories] = useState<TabConfig[]>([]);

  const cohortFilters = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, index),
  );

  const {
    data,
    isSuccess,
    isError: isAggsQueryError,
  } = useGetAggsQuery({
    type: index,
    fields: fields,
    filters: cohortFilters,
  });

  const updateFields = useDeepCompareCallback(
    (field: string) => {
      if (activeFields.includes(field)) {
        setActiveFields(activeFields.filter((f) => f !== field));
      } else {
        setActiveFields([...activeFields, field]);
      }
    },
    [activeFields],
  );

  // Set the facet definitions based on the data only the first time the data is loaded
  useDeepCompareEffect(() => {
    if (isSuccess && Object.keys(facetDefinitions).length === 0) {
      const configFacetDefs = tabs.reduce(
        (acc: Record<string, FacetDefinition>, tab) => {
          return { ...tab.fieldsConfig, ...acc };
        },
        {},
      );

      const facetDefs = classifyFacets(data, index, [], configFacetDefs);
      setFacetDefinitions(facetDefs);
      // setup categories

      const categories = tabs.reduce((acc, tab) => {
        const updatedTab = tab;
        if (!updatedTab?.fieldsConfig) {
          updatedTab.fieldsConfig = {};
        }
        updatedTab.fields.forEach((x) => {
          tab.fieldsConfig[x] = {
            ...tab.fieldsConfig[x],
            ...(x in facetDefs ? facetDefs[x] : {}),
          };
        });

        acc.push(updatedTab);
        return acc;
      }, [] as TabConfig[]);
      setCategories(categories);
    }
  }, [isSuccess, data, facetDefinitions, index]);

  console.log('categories', categories);

  return (
    <Group>
      <FacetSelectionPanel
        categories={categories}
        hooks={{
          useClearFilter: () => (field: string) => null,
          useToggleExpandFilter: () => (field: string, expanded: boolean) =>
            null,
          useFilterExpanded: (field: string) => true,
          updateSelectedField: updateFields,
          useGetFields: () => [],
        }}
      />
    </Group>
  );
};

export default IndexPanel;
