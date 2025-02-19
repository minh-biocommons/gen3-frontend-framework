import React, { ReactElement, useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteProps,
  Button,
  Stack,
  Group,
} from '@mantine/core';
import { MdClose as CloseIcon, MdSearch as SearchIcon } from 'react-icons/md';
import ResultCard from './ResultCard';
import { useMiniSearch } from 'react-minisearch';
import MiniSearch from 'minisearch';
import { DictionarySearchDocument, MatchingSearchResult } from './types';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';
import { useDictionaryContext } from './DictionaryProvider';
import { useLocalStorage } from '@mantine/hooks';
import { KEY_FOR_SEARCH_HISTORY, MAX_SEARCH_HISTORY } from './constants';

const getSearchResults = (
  searchResults: Array<DictionarySearchDocument>,
): Array<MatchingSearchResult> => {
  const matches: Array<MatchingSearchResult> = [];
  searchResults.forEach((r) => {
    matches.push({
      node: r.rootCategory,
      category: r.category,
      property: r.property,
    });
  });
  return matches.sort((a, b) => {
    if (a.node < b.node) return -1;
    if (a.node > b.node) return 1;
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    if (a.property < b.property) return -1;
    if (a.property > b.property) return 1;
    return 0;
  });
};

interface SearchMatches {
  node: string;
  category: string;
  property: string;
}

interface DictionarySearchHistoryObj {
  [key: string]: {
    matches?: SearchMatches[];
    term: string;
    datetime: string;
  };
}

interface TableSearchProps {
  selectItem: (_: MatchingSearchResult) => void;
}

const TableSearch = ({ selectItem }: TableSearchProps): ReactElement => {
  const { documents, config } = useDictionaryContext();
  const [dictionarySearchResults, setDictionarySearchResults] = useState(
    {} as any,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [dictionaryTableRows, setDictionaryTableRows] = useState<
    [] | ReactElement[]
  >([]);

  const [
    dictionarySearchHistory,
    setDictionarySearchHistory,
    removeDictionarySearchHistory,
  ] = useLocalStorage<DictionarySearchHistoryObj>({
    key: config?.historyStorageId ?? KEY_FOR_SEARCH_HISTORY,
    defaultValue: {},
  });

  const {
    search,
    autoSuggest,
    suggestions,
    searchResults,
    clearSearch,
    clearSuggestions,
  } = useMiniSearch(documents, {
    fields: ['description', 'type', 'property'],
    idField: 'id',
    storeFields: ['id'],
    searchOptions: {
      processTerm: MiniSearch.getDefault('processTerm'),
    },
  });

  useEffect(() => {
    if (searchTerm.length > 1) {
      search(searchTerm, { combineWith: 'AND' });
      autoSuggest(searchTerm);
    }
  }, [searchTerm, autoSuggest, search]);

  useEffect(() => {
    if (searchTerm === '') {
      setDictionarySearchResults({});
      clearSearch();
      clearSuggestions();
    }
  }, [clearSearch, clearSuggestions, searchTerm]);

  useEffect(() => {
    if (
      dictionarySearchResults?.term?.length &&
      !Object.keys(dictionarySearchHistory).includes(
        dictionarySearchResults?.term,
      ) &&
      dictionarySearchResults?.matches?.length
    ) {
      let searchHistoryArray = Object.entries(dictionarySearchHistory);
      searchHistoryArray.push([
        dictionarySearchResults?.term,
        {
          term: dictionarySearchResults.term,
          matches: dictionarySearchResults.matches,
          datetime: new Date().toLocaleString(),
        },
      ]);
      searchHistoryArray.sort(
        (a, b) => Date.parse(b[1].datetime) - Date.parse(a[1].datetime),
      );
      // Trim the array to the last 10 items
      searchHistoryArray = searchHistoryArray.slice(
        0,
        config?.maxHistoryItems ?? MAX_SEARCH_HISTORY,
      );
      // Convert the array back to an object
      const newSearchHistory = Object.fromEntries(searchHistoryArray);
      setDictionarySearchHistory(newSearchHistory);
    }
  }, [
    config?.maxHistoryItems,
    dictionarySearchHistory,
    dictionarySearchResults,
    setDictionarySearchHistory,
  ]);

  useDeepCompareEffect(() => {
    if (dictionarySearchHistory) {
      setDictionaryTableRows(
        Object.keys(dictionarySearchHistory).map((d) => {
          return (
            <div key={`dictionary-table-row-${d}`} className="my-2">
              <ResultCard
                term={d}
                matches={dictionarySearchHistory[d]?.matches}
                selectItem={selectItem}
              />
            </div>
          );
        }),
      );
    }
  }, [dictionarySearchHistory]);

  const suggestedData = useDeepCompareMemo(
    () =>
      (suggestions || [])?.map(({ suggestion }) => {
        return { value: suggestion };
      }),
    [suggestions],
  );

  const renderSuggestedItem: AutocompleteProps['renderOption'] = ({
    option,
  }) => {
    return (
      <div
        className={`h-inherit w-inherit hover:cursor-pointer hover:bg-gray-100 border-0 p-1 ${
          (suggestions || [])
            .map(({ suggestion }) => suggestion)
            .indexOf(option.value) !== 0 && 'border-t-0'
        }`}
      >
        <button
          className="border-0"
          onClick={() => setSearchTerm(option.value)}
        >
          {option.value}
        </button>
      </div>
    );
  };

  return (
    <>
      <Stack justify="flex-start" className="mt-2">
        <Autocomplete
          // TODO: replace for v7
          data={suggestedData}
          renderOption={renderSuggestedItem}
          leftSection={<SearchIcon size={24} className="text-accent" />}
          placeholder={'Search in Dictionary'}
          data-testid="dictionary-textbox-search-bar"
          aria-label="Dictionary Search Input"
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value as string);
          }}
          onOptionSubmit={(item) => {
            setDictionarySearchResults({
              term: item,
              matches: getSearchResults(searchResults ?? []),
            });
          }}
          classNames={{
            input: 'focus:border-2 focus:border-primary text-sm p-5',
          }}
          size="sm"
          rightSection={
            searchTerm.length > 0 && (
              <CloseIcon
                onClick={() => {
                  setSearchTerm('');
                  clearSearch();
                  clearSuggestions();
                }}
                className="cursor-pointer"
              />
            )
          }
        />
      </Stack>

      <Stack justify="flex-start" className="mt-2">
        <span className="font-semibold text-sm ">Search Results</span>
        {dictionarySearchResults?.matches?.length > 0 ? (
          <ResultCard
            term={dictionarySearchResults?.term}
            matches={dictionarySearchResults?.matches}
            selectItem={selectItem}
          />
        ) : (
          <span className="text-xs items-center">
            Try a different search query
          </span>
        )}
      </Stack>
      <Stack justify="flex-start" gap="xs" className="mt-1">
        <Group justify="space-between" align="center">
          <span className="flex flex-col font-semibold text-sm">
            Search History
          </span>
          <Button
            variant="outline"
            color="accent.4"
            radius="md"
            onClick={() => removeDictionarySearchHistory()}
          >
            Clear All
          </Button>
        </Group>

        {dictionaryTableRows?.length ? (
          <React.Fragment>{dictionaryTableRows}</React.Fragment>
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </Stack>
    </>
  );
};

export default TableSearch;
