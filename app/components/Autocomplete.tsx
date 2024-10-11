import * as React from "react";
import {
  useAutocomplete,
  UseAutocompleteProps,
} from "@mui/base/useAutocomplete";
import { Button } from "@mui/base/Button";
import { Popper } from "@mui/base/Popper";
import { unstable_useForkRef as useForkRef } from "@mui/utils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { Input } from "@mui/base";
import Image from "next/image";

export const Autocomplete = React.forwardRef(function Autocomplete(
  props: UseAutocompleteProps<Record<string, any>, false, false, false>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    disableClearable = false,
    disabled = false,
    readOnly = false,
    ...other
  } = props;

  const {
    getRootProps,
    getInputProps,
    getPopupIndicatorProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
    dirty,
    id,
    popupOpen,
    focused,
    anchorEl,
    setAnchorEl,
    groupedOptions,
  } = useAutocomplete({
    ...props,
    filterOptions: (x) => x,
    isOptionEqualToValue(option, value) {
      return option.id === value.id;
    },
    getOptionLabel(option) {
      return option.title;
    },
    componentName: "BaseAutocompleteIntroduction",
  });

  const hasClearIcon = !disableClearable && !disabled && dirty && !readOnly;

  const rootRef = useForkRef(ref, setAnchorEl);

  console.log({ groupedOptions, props, popupOpen, rootRef, anchorEl });
  return (
    <React.Fragment>
      <div
        {...getRootProps(other)}
        ref={rootRef}
        className={`flex gap-2 border border-gray-300 rounded-md p-2}`}
      >
        <Input
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          className="text-black"
          {...getInputProps()}
        />
        {hasClearIcon && (
          <Button {...getClearProps()}>
            <ClearIcon />
          </Button>
        )}
        <Button {...getPopupIndicatorProps()} className={"relative"}>
          <ArrowDropDownIcon />
        </Button>
      </div>
      {anchorEl ? (
        <Popper
          open={popupOpen}
          anchorEl={anchorEl}
          modifiers={[
            { name: "flip", enabled: false },
            { name: "preventOverflow", enabled: false },
          ]}
        >
          <ul
            {...getListboxProps()}
            className="bg-slate-50 text-black overflow-auto max-w-64 max-h-96"
          >
            {groupedOptions.map((option, index) => {
              const optionProps = getOptionProps({ option, index });

              return (
                <li
                  {...optionProps}
                  key={option.index}
                  className={`flex items-center py-1 gap-2 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-100"
                  } hover:bg-pink-200`}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${
                      option.poster_path || "/"
                    }`}
                    width={50}
                    height={50}
                    alt={option.title}
                  />
                  <span>
                    {option.title} {option.release_date.split("-")[0]}
                  </span>
                </li>
              );
            })}

            {groupedOptions.length === 0 && <li>No results</li>}
          </ul>
        </Popper>
      ) : null}
    </React.Fragment>
  );
});
