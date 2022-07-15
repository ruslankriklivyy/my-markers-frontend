import React, { FC } from 'react';
import DatePicker from 'react-datepicker';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useColorMode,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import 'react-datepicker/dist/react-datepicker.css';
import UploadFile from './upload-file';

interface CustomFieldsProps {
  name: string;
  type: string;
  defaultValue?: string;
  is_important?: boolean;
  items?: string[];
  control: any;
  errors: any;
}

const CustomFields: FC<CustomFieldsProps> = ({
  name: fieldName,
  type,
  defaultValue,
  is_important,
  items,
  control,
  errors,
}) => {
  const { colorMode } = useColorMode();

  switch (type) {
    case 'text':
      return (
        <Controller
          control={control}
          name={fieldName.toLowerCase()}
          defaultValue={defaultValue}
          render={({ field: { value, onChange } }) => (
            <FormControl
              mb={3}
              isInvalid={!!errors[fieldName.toLowerCase()]}
              isRequired={is_important}
            >
              <FormLabel>{fieldName}</FormLabel>

              <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
              />

              {errors && errors[fieldName.toLowerCase()] && (
                <p className={'error'}>
                  {errors[fieldName.toLowerCase()]?.message}
                </p>
              )}
            </FormControl>
          )}
        />
      );

    case 'date':
      return (
        <Controller
          control={control}
          name={fieldName.toLowerCase()}
          defaultValue={defaultValue ? new Date(defaultValue) : undefined}
          render={({ field: { value, onChange } }) => (
            <FormControl
              mb={3}
              isInvalid={!!errors[fieldName.toLowerCase()]}
              isRequired={is_important}
            >
              <FormLabel>{fieldName}</FormLabel>

              <DatePicker
                selected={value}
                onChange={onChange}
                customInput={<Input />}
                calendarClassName={colorMode === 'dark' && 'calendar-dark'}
              />

              {errors && errors[fieldName.toLowerCase()] && (
                <p className={'error'}>
                  {errors[fieldName.toLowerCase()]?.message}
                </p>
              )}
            </FormControl>
          )}
        />
      );

    case 'multiline':
      return (
        <Controller
          control={control}
          name={fieldName.toLowerCase()}
          defaultValue={defaultValue}
          render={({ field: { value, onChange } }) => (
            <FormControl
              mb={3}
              isInvalid={!!errors[fieldName.toLowerCase()]}
              isRequired={is_important}
            >
              <FormLabel>{fieldName}</FormLabel>

              <Textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
              />

              {errors && errors[fieldName.toLowerCase()] && (
                <p className={'error'}>
                  {errors[fieldName.toLowerCase()]?.message}
                </p>
              )}
            </FormControl>
          )}
        />
      );

    case 'file':
      return (
        <Controller
          control={control}
          name={fieldName.toLowerCase()}
          defaultValue={defaultValue}
          render={({ field: { onChange } }) => (
            <FormControl
              mb={3}
              isInvalid={!!errors[fieldName.toLowerCase()]}
              isRequired={is_important}
            >
              <FormLabel>{fieldName}</FormLabel>

              <UploadFile
                defaultValue={defaultValue}
                onInput={(file) => onChange(file)}
              />

              {errors && errors[fieldName.toLowerCase()] && (
                <p className={'error'}>
                  {errors[fieldName.toLowerCase()]?.message}
                </p>
              )}
            </FormControl>
          )}
        />
      );

    case 'select':
      return (
        <Controller
          control={control}
          name={fieldName.toLowerCase()}
          defaultValue={defaultValue}
          render={({ field: { onChange } }) => (
            <FormControl mb={3} isRequired={is_important}>
              <FormLabel>{fieldName}</FormLabel>

              <Select
                placeholder="Select value"
                defaultValue={defaultValue}
                onChange={(event) => onChange(event.target.value)}
              >
                {items?.map((elem) => (
                  <option value={elem}>{elem}</option>
                ))}
              </Select>

              {errors && errors[fieldName.toLowerCase()] && (
                <p className={'error'}>
                  {errors[fieldName.toLowerCase()]?.message}
                </p>
              )}
            </FormControl>
          )}
        />
      );

    default:
      return <></>;
  }
};

export default CustomFields;
