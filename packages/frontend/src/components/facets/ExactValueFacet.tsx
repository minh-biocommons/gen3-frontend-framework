import React, { useState, useMemo } from 'react';
import { FacetCardProps, FacetDataHooks } from './types';
import { ActionIcon, Badge, Group, TextInput, Tooltip } from '@mantine/core';
import {
  controlsIconStyle,
  FacetIconButton,
  FacetText,
  FacetHeader,
} from './components';
import { MdClose as CloseIcon } from 'react-icons/md';
import { FaUndo as UndoIcon, FaPlus as PlusIcon } from 'react-icons/fa';
import {
  Operation,
  Excludes,
  Includes,
  trimFirstFieldNameToTitle,
  EnumFilterValue,
} from '@gen3/core';

type ExactValueProps = Omit<
  FacetCardProps<FacetDataHooks>,
  'showSearch' | 'showFlip' | 'showPercent' | 'valueLabel'
>;

const instanceOfIncludesExcludes = (op: Operation): op is Includes | Excludes =>
  ['in'].includes(op.operator); // TODO: Guppy does not support excludes

/**
 * Extracts the operands if the operation isIncludes or Excludes. Returns an empty Array
 * if filter is not the correct type.
 * @param operation - filters to extract values from
 */
const extractValues = (
  operation?: Operation,
): ReadonlyArray<string | number> => {
  if (operation && instanceOfIncludesExcludes(operation)) {
    return operation.operands;
  }
  return [] as ReadonlyArray<string>;
};

/**
 * Exact value facet component
 * @param field - field to facet on
 * @param description - description of the facet
 * @param facetName - name of the facet
 * @param dismissCallback - callback function to dismiss the facet
 * @param width - width of the facet
 * @param hooks - hooks to use for the facet
 * @category Facets
 */
const ExactValueFacet: React.FC<ExactValueProps> = ({
  field,
  description,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
  hooks,
}: ExactValueProps) => {
  const [textValue, setTextValue] = useState(''); // Handle the state of the TextInput
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);
  const facetValue = hooks.useGetFacetFilters(field);
  const textValues = useMemo(() => extractValues(facetValue), [facetValue]);

  const setValues = (values: EnumFilterValue) => {
    if (values.length > 0) {
      if (facetValue && instanceOfIncludesExcludes(facetValue)) {
        // updating facet value
        updateFacetFilters(field, {
          ...facetValue,
          operands: values,
        });
      }
      if (facetValue === undefined) {
        // TODO: Assuming Includes by default but this might change to Include|Excludes
        updateFacetFilters(field, {
          operator: 'in',
          field: field,
          operands: values,
        });
      }
    }
    // no values remove the filter
    else {
      clearFilters(field);
    }
  };

  const addValue = (s: string | number) => {
    if (s === '') return;
    if (textValues.includes(s)) return;
    setTextValue('');
    setValues([...textValues, s]);
  };

  const removeButton = (x: string | number) => {
    return (
      <ActionIcon
        size="xs"
        color="white"
        radius="xl"
        variant="transparent"
        onClick={() => setValues(textValues.filter((i) => i !== x))}
      >
        <CloseIcon size={10} aria-label="remove value from filter" />
      </ActionIcon>
    );
  };

  return (
    <div
      className={`flex flex-col ${
        width ? width : 'mx-0'
      } bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition`}
    >
      <FacetHeader>
        <Tooltip
          disabled={!description}
          label={description}
          position="bottom-start"
          multiline
          w={220}
          withArrow
          transitionProps={{ duration: 200, transition: 'fade' }}
        >
          <FacetText>{facetTitle}</FacetText>
        </Tooltip>
        <div className="flex flex-row">
          <Tooltip label="Clear selection">
            <FacetIconButton
              onClick={() => clearFilters(field)}
              aria-label="clear selection"
            >
              <UndoIcon size="1.15em" className={controlsIconStyle} />
            </FacetIconButton>
          </Tooltip>
          {dismissCallback && (
            <Tooltip label="Remove the facet">
              <FacetIconButton
                onClick={() => {
                  dismissCallback(field);
                }}
                aria-label="Remove the facet"
              >
                <CloseIcon size="1.25em" className={controlsIconStyle} />
              </FacetIconButton>
            </Tooltip>
          )}
        </div>
      </FacetHeader>
      <div className="flex flex-nowrap items-center p-2">
        <TextInput
          data-testid="textbox-add-filter-value"
          size="sm"
          placeholder={`Enter ${facetTitle}`}
          classNames={{ root: 'grow', input: 'border-r-0 rounded-r-none py-1' }}
          aria-label="enter value to add filter"
          value={textValue}
          onChange={(event) => setTextValue(event.currentTarget.value)}
        />
        <ActionIcon
          size="lg"
          aria-label="add string value"
          className="bg-accent text-accent-contrast border-base-min border-1 rounded-l-none h-[30px]"
          onClick={() => {
            if (textValue.length > 0) addValue(textValue.trim());
          }}
        >
          <PlusIcon />
        </ActionIcon>
      </div>
      {/* h-96 is max height for the content of ExactValueFacet, EnumFacet, UploadFacet */}
      <Group
        gap="xs"
        className="px-2 py-2 max-h-96 overflow-y-auto"
        data-testid="values group"
      >
        {textValues.map((x) => (
          <Badge
            size="sm"
            variant="filled"
            color="accent"
            key={x}
            rightSection={removeButton(x)}
          >
            {x}
          </Badge>
        ))}
      </Group>
    </div>
  );
};

export default ExactValueFacet;
