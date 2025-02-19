// Generated by CodiumAI
import { SearchTerms } from '../../types';
import { hasSearchTerms } from '../utils';
import { SearchCombination } from '../types';

describe('hasSearchTerms', () => {
  // Returns true if keyword search has keywords
  it('should return true when keyword search has keywords', () => {
    const searchTerms: SearchTerms = {
      keyword: {
        keywords: ['apple', 'banana'],
        operator: 'AND' as SearchCombination,
      },
      advancedSearchTerms: {
        operation: 'AND' as SearchCombination,
        filters: {},
      },
      selectedTags: {},
    };
    const result = hasSearchTerms(searchTerms);
    expect(result).toBe(true);
  });

  // Returns true if advanced search has selected filters
  it('should return true when advanced search has selected filters', () => {
    const searchTerms: SearchTerms = {
      keyword: {
        keywords: [],
        operator: 'AND' as SearchCombination,
      },
      advancedSearchTerms: {
        operation: 'AND' as SearchCombination,
        filters: {
          filter1: {
            option1: true,
            option2: false,
          },
          filter2: {
            option1: false,
            option2: true,
          },
        },
      },
      selectedTags: {},
    };
    const result = hasSearchTerms(searchTerms);
    expect(result).toBe(true);
  });

  // Returns true if both keyword and advanced search have selected filters
  it('should return true when both keyword and advanced search have selected filters', () => {
    const searchTerms: SearchTerms = {
      keyword: {
        keywords: ['apple', 'banana'],
        operator: 'AND' as SearchCombination,
      },
      advancedSearchTerms: {
        operation: 'AND' as SearchCombination,
        filters: {
          filter1: {
            option1: true,
            option2: false,
          },
          filter2: {
            option1: false,
            option2: true,
          },
        },
      },
      selectedTags: {},
    };
    const result = hasSearchTerms(searchTerms);
    expect(result).toBe(true);
  });

  // Returns false if keyword search has no keywords and advanced search has no selected filters
  it('should return false when keyword search has no keywords and advanced search has no selected filters', () => {
    const searchTerms: SearchTerms = {
      keyword: {
        keywords: [],
        operator: 'AND' as SearchCombination,
      },
      advancedSearchTerms: {
        operation: 'AND' as SearchCombination,
        filters: {},
      },
    };
    const result = hasSearchTerms(searchTerms);
    expect(result).toBe(false);
  });

  // Returns false if searchTerms is undefined or null
});
