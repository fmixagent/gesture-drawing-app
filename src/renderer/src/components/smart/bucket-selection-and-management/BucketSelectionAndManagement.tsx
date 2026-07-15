import Button from '@renderer/components/ui/button/Button';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bucket, getBucketNameFromBucket } from '@renderer/models/bucket';
import CreatableSelectField from '../creatable-select-field/creatable-select-field';
import { useAppContext } from '@renderer/context-providers/app-context';
import { UserConfiguration } from '@renderer/models/userConfiguration';
import ModalLayout from '@renderer/components/layout/modal/ModalLayout';
import TextField from '../text-field/text-field';

interface BucketSelectionAndManagementProps {
  userConfiguration: UserConfiguration;
  onChange?: (userConfiguration: UserConfiguration) => void;
}
const BucketSelectionAndManagement: React.FC<BucketSelectionAndManagementProps> = ({
  userConfiguration,
  onChange,
}) => {
  const { buckets, saveBucket, deleteBucket } = useAppContext();
  const [bucketOptions, setBucketOptions] = useState<{ label: string; value: Bucket }[]>([]);

  useEffect(() => {
    const removableBuckets = buckets.filter((bucket) => bucket.isRemovable);
    const nonRemovableBuckets = buckets.filter((bucket) => !bucket.isRemovable);
    const allBuckets = [...nonRemovableBuckets, ...removableBuckets];

    const options = allBuckets.map((bucket) => ({
      label: getBucketNameFromBucket(bucket),
      value: bucket,
    }));
    setBucketOptions(options);
  }, [buckets]);

  const onChangeBucket = (bucket: Bucket): void => {
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      bucketSelected: bucket,
      folderSelected: undefined,
    };
    onChange?.(newConfiguration);
  };

  const [editingBucket, setEditingBucket] = React.useState<Bucket | null>(null);

  const onEditBucket = (bucket: Bucket): void => {
    console.log('Attempting to delete bucket: ', bucket);
    if (!bucket.isRemovable) return;
    setEditingBucket(bucket);
  };

  const onCreateNewBucket = (bucketName: string): void => {
    const newBucket: Bucket = {
      ...new Bucket(),
      id: crypto.randomUUID(),
      name: bucketName,
    };
    setEditingBucket(newBucket);
  };

  const onDeleteBucket = (bucket: Bucket): void => {
    if (!bucket.isRemovable) return;
    deleteBucket(bucket);
    setEditingBucket(null);

    if (userConfiguration.bucketSelected?.name === bucket.name) {
      const newConfiguration: UserConfiguration = {
        ...userConfiguration,
        folderSelected: undefined,
      };
      onChange?.(newConfiguration);
    }
  };

  const onChangeEditingBucketProperty = (property: string, value: any): void => {
    if (!editingBucket) return;

    const updatedSession = {
      ...editingBucket,
      [property]: value,
    };
    setEditingBucket(updatedSession);
  };

  const onCloseEditingBucket = (): void => {
    // TODO: confirm modal?
    setEditingBucket(null);
  };

  const onSaveEditingSession = (): void => {
    if (!editingBucket) return;

    saveBucket(editingBucket);
    onChangeBucket(editingBucket);
    setEditingBucket(null);
  };

  return (
    <div className="flex flex-col items-start justify-start gap-3">
      <CreatableSelectField
        label="Or select a bucket"
        labelClassName="text-gray-100 text-sm"
        options={bucketOptions}
        selectedOption={
          userConfiguration.bucketSelected
            ? {
                label: getBucketNameFromBucket(userConfiguration.bucketSelected),
                value: userConfiguration.bucketSelected,
              }
            : undefined
        }
        onChange={(option) => {
          onChangeBucket(option?.value as Bucket);
        }}
        isClearable={false}
        placeholder="Select bucket..."
        onCreateNewOption={onCreateNewBucket}
        onOptionDelete={(option) => onDeleteBucket(option?.value as Bucket)}
        onOptionEdit={(option) => onEditBucket(option?.value as Bucket)}
      />
      {userConfiguration.bucketSelected && (
        <div className="w-full truncate rounded-md border border-gray-300/20 px-3 py-2 text-gray-400">
          SELECTED: {userConfiguration.bucketSelected.name}
        </div>
      )}

      {/* Bucket modal */}
      {editingBucket &&
        createPortal(
          <ModalLayout
            modalTitle={`New bucket (${editingBucket.name})`}
            onClose={onCloseEditingBucket}
          >
            <section className="flex w-full flex-1 flex-col overflow-hidden">
              <main className="flex h-full flex-col justify-between overflow-hidden">
                <div className="flex flex-none py-3">
                  <TextField
                    id="bucketName"
                    label="Bucket name"
                    value={editingBucket?.name ?? ''}
                    onChange={(value) => onChangeEditingBucketProperty('name', value)}
                  />
                </div>
                <div>//TODO BUCKET MANAGEMENT//</div>
              </main>
              <footer className="border-t border-gray-400 pt-5">
                <ul className="flex items-center justify-end gap-3">
                  <li>
                    <Button
                      label="Cancel"
                      variant="secondary"
                      onClick={onCloseEditingBucket}
                    ></Button>
                  </li>
                  <li>
                    <Button label="Save" onClick={onSaveEditingSession}></Button>
                  </li>
                </ul>
              </footer>
            </section>
          </ModalLayout>,
          document.body
        )}
    </div>
  );
};

export default BucketSelectionAndManagement;
