import React, { FC, useEffect, useState } from 'react';
import { InlineFormLabel, LegacyForms, Button, Select } from '@grafana/ui';
const { Input } = LegacyForms;
import {
  DataSourcePluginOptionsEditorProps,
  onUpdateDatasourceJsonDataOptionSelect,
  onUpdateDatasourceResetOption,
  onUpdateDatasourceJsonDataOption,
  onUpdateDatasourceSecureJsonDataOption,
} from '@grafana/data';
// import { config } from '@grafana/runtime';

import {
  AwsDataSourceJsonData,
  AwsDataSourceSecureJsonData,
  awsAuthProviderOptions,
} from './types';
import { standardRegions } from './regions';

export interface Props
  extends DataSourcePluginOptionsEditorProps<
    AwsDataSourceJsonData,
    AwsDataSourceSecureJsonData
  > {
  standardRegions?: string[];
  loadRegions?: () => Promise<string[]>;
  defaultEndpoint?: string;
}

const toOption = (value: string) => ({ value, label: value });

export const ConnectionConfig: FC<Props> = (props: Props) => {
  const [regions, setRegions] = useState(
    (props.standardRegions || standardRegions).map(toOption)
  );

  useEffect(() => {
    if (!props.loadRegions) {
      return;
    }

    props.loadRegions().then((regions) => setRegions(regions.map(toOption)));
  }, []);

  const options = props.options;
  const secureJsonData = (options.secureJsonData ||
    {}) as AwsDataSourceSecureJsonData;
  let profile = options.jsonData.profile;
  if (profile === undefined) {
    profile = options.database;
  }

  return (
    <>
      <h3 className="page-heading">Connection Details</h3>
      <div className="gf-form-inline">
        <div className="gf-form">
          <InlineFormLabel
            className="width-14"
            tooltip="Specify which AWS credentials chain to use. AWS SDK Default is the recommended option for EKS, ECS, or if you've attached an IAM role to your EC2 instance."
          >
            Authentication Provider
          </InlineFormLabel>
          <Select
            className="width-30"
            value={
              awsAuthProviderOptions.find(
                (p) => p.value === options.jsonData.authType
              ) || awsAuthProviderOptions[0]
            }
            options={awsAuthProviderOptions}
            // options={awsAuthProviderOptions.filter((opt) =>
            //   config.awsAllowedAuthProviders.includes(opt.value!)
            // )}
            defaultValue={options.jsonData.authType}
            onChange={(option) => {
              onUpdateDatasourceJsonDataOptionSelect(props, 'authType')(option);
            }}
          />
        </div>
      </div>
      {options.jsonData.authType === 'credentials' && (
        <div className="gf-form-inline">
          <div className="gf-form">
            <InlineFormLabel
              className="width-14"
              tooltip="Credentials profile name, as specified in ~/.aws/credentials, leave blank for default."
            >
              Credentials Profile Name
            </InlineFormLabel>
            <div className="width-30">
              <Input
                className="width-30"
                placeholder="default"
                value={profile}
                onChange={onUpdateDatasourceJsonDataOption(props, 'profile')}
              />
            </div>
          </div>
        </div>
      )}
      {options.jsonData.authType === 'keys' && (
        <div>
          {options.secureJsonFields?.accessKey ? (
            <div className="gf-form-inline">
              <div className="gf-form">
                <InlineFormLabel className="width-14">
                  Access Key ID
                </InlineFormLabel>
                <Input
                  className="width-25"
                  placeholder="Configured"
                  disabled={true}
                />
              </div>
              <div className="gf-form">
                <div className="max-width-30 gf-form-inline">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={onUpdateDatasourceResetOption(
                      props as any,
                      'accessKey'
                    )}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="gf-form-inline">
              <div className="gf-form">
                <InlineFormLabel className="width-14">
                  Access Key ID
                </InlineFormLabel>
                <div className="width-30">
                  <Input
                    className="width-30"
                    value={secureJsonData.accessKey || ''}
                    onChange={onUpdateDatasourceSecureJsonDataOption(
                      props,
                      'accessKey'
                    )}
                  />
                </div>
              </div>
            </div>
          )}
          {options.secureJsonFields?.secretKey ? (
            <div className="gf-form-inline">
              <div className="gf-form">
                <InlineFormLabel className="width-14">
                  Secret Access Key
                </InlineFormLabel>
                <Input
                  className="width-25"
                  placeholder="Configured"
                  disabled={true}
                />
              </div>
              <div className="gf-form">
                <div className="max-width-30 gf-form-inline">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={onUpdateDatasourceResetOption(
                      props as any,
                      'secretKey'
                    )}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="gf-form-inline">
              <div className="gf-form">
                <InlineFormLabel className="width-14">
                  Secret Access Key
                </InlineFormLabel>
                <div className="width-30">
                  <Input
                    className="width-30"
                    value={secureJsonData.secretKey || ''}
                    onChange={onUpdateDatasourceSecureJsonDataOption(
                      props,
                      'secretKey'
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* {config.awsEnableAssumeRole && ( */}
      <>
        <div className="gf-form-inline">
          <div className="gf-form">
            <InlineFormLabel
              className="width-14"
              tooltip="Optionally, specify the ARN of a role to assume. Specifying a role here will ensure that the selected authentication provider is used to assume the specified role rather than using the credentials directly. Leave blank if you don't need to assume a role at all"
            >
              Assume Role ARN
            </InlineFormLabel>
            <div className="width-30">
              <Input
                className="width-30"
                placeholder="arn:aws:iam:*"
                value={options.jsonData.assumeRoleArn || ''}
                onChange={onUpdateDatasourceJsonDataOption(
                  props,
                  'assumeRoleArn'
                )}
              />
            </div>
          </div>
        </div>
        <div className="gf-form-inline">
          <div className="gf-form-inline">
            <div className="gf-form">
              <InlineFormLabel
                className="width-14"
                tooltip="If you are assuming a role in another account, that has been created with an external ID, specify the external ID here."
              >
                External ID
              </InlineFormLabel>
              <div className="width-30">
                <Input
                  className="width-30"
                  placeholder="External ID"
                  value={options.jsonData.externalId || ''}
                  onChange={onUpdateDatasourceJsonDataOption(
                    props,
                    'externalId'
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </>
      {/* )} */}
      <div className="gf-form-inline">
        <div className="gf-form">
          <InlineFormLabel
            className="width-14"
            tooltip="Optionally, specify a custom endpoint for the service"
          >
            Endpoint
          </InlineFormLabel>
          <div className="width-30">
            <Input
              className="width-30"
              placeholder={
                props.defaultEndpoint ??
                'https://{service}.{region}.amazonaws.com'
              }
              value={options.jsonData.endpoint || ''}
              onChange={onUpdateDatasourceJsonDataOption(props, 'endpoint')}
            />
          </div>
        </div>
      </div>
      <div className="gf-form-inline">
        <div className="gf-form">
          <InlineFormLabel
            className="width-14"
            tooltip="Specify the region, such as for US West (Oregon) use ` us-west-2 ` as the region."
          >
            Default Region
          </InlineFormLabel>
          <Select
            className="width-30"
            value={regions.find(
              (region) => region.value === options.jsonData.defaultRegion
            )}
            options={regions}
            defaultValue={options.jsonData.defaultRegion}
            onChange={onUpdateDatasourceJsonDataOptionSelect(
              props,
              'defaultRegion'
            )}
          />
        </div>
      </div>
    </>
  );
};
