import {
  useCoreSelector,
  FilterSet,
  selectCohortFilters,
  useCoreDispatch,
  selectAvailableCohorts,
  Cohort,
  removeCohort,
} from '@gen3/core';

import { useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

export const useSetupInitialCohorts = (): boolean => {
  const [fetched, setFetched] = useState(false);
  const cohortsListData = undefined;
  const isSuccess = true;
  const isError = false;
  // const {
  //   data: cohortsListData,
  //   isSuccess,
  //   isError,
  // } = useGetCohortsByContextIdQuery(null, { skip: fetched });

  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const updatedCohortIds = (cohortsListData || []).map(
    (cohort: Cohort) => cohort.id,
  );
  const outdatedCohortsIds = cohorts
    .filter((c) => c.saved && !updatedCohortIds.includes(c.id))
    .map((c) => c.id);

  useDeepCompareEffect(() => {
    if ((isSuccess || isError) && !fetched) {
      const updatedList: Cohort[] = (cohortsListData || []).map((data) => {
        const existingCohort = cohorts.find((c) => c.id === data.id);
        return existingCohort?.modified
          ? existingCohort
          : {
              id: data.id,
              name: data.name,
              filters: buildGqlOperationToFilterSet(data.filters),
              modified_datetime: data.modified_datetime,
              saved: true,
              modified: false,
            };
      });

      coreDispatch(setActiveCohortList(updatedList)); // will create caseSet if needed
      // A saved cohort that's not present in the API response has been deleted in another session
      for (const id of outdatedCohortsIds) {
        coreDispatch(removeCohort({ id }));
      }

      setFetched(true);
    }
  }, [
    cohortsListData,
    isSuccess,
    isError,
    cohorts,
    fetched,
    setFetched,
    coreDispatch,
    outdatedCohortsIds,
  ]);

  return fetched;
};

export const useCohortFacetFilters = (index: string): FilterSet => {
  return useCoreSelector((state) => selectCohortFilters(state)[index]);
};
